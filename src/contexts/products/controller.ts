import { Product } from "./model";
import {
	isValidObjectId,
	type RootFilterQuery,
	type SortOrder,
} from "mongoose";
import { InvalidObjectIdException } from "@/contexts/shared/exceptions";
import {
	getOffsetFromPage,
	getSafePaginationRequest,
	isArrayEmpty,
} from "@/lib/utils";
import type { PaginationRequest, PaginationResponse } from "@/types/pagination";
import type { ProductFilters, ProductSort } from "./types";
import { connectToMongo } from "@/lib/mongo";
import mongoose from "mongoose";
import type { ProductType } from "@/types/models/products";
import { Storage } from "@/contexts/storages/model";
import { ProductsNotFoundException } from "./exceptions";

export const getProductsCount = async () => {
	await connectToMongo();
	return await Product.countDocuments({});
};

export const getProducts = async (
	pagination: PaginationRequest,
	filters: ProductFilters,
	sort: ProductSort[],
): Promise<PaginationResponse<ProductType>> => {
	const { page, limit } = getSafePaginationRequest(pagination);

	const query: RootFilterQuery<typeof Product> = {};

	if (filters.name) {
		query.name = { $regex: filters.name, $options: "i" };
	}

	if (filters.cost) {
		query.cost = { $gte: filters.cost[0], $lte: filters.cost[1] };
	}

	if (filters.capacity) {
		query.capacity = filters.capacity;
	}

	if (filters.category) {
		query.category = filters.category;
	}

	if (filters.capacityUnit) {
		query.capacityUnit = filters.capacityUnit;
	}

	if (filters.brand) {
		query.brand = { $regex: filters.brand, $options: "i" };
	}

	if (filters.stock !== undefined) {
		if (filters.stock === 1) {
			query.locations = { $elemMatch: { stock: { $gt: 0 } } };
		} else if (filters.stock === 0) {
			query.locations = { $not: { $elemMatch: { stock: { $gt: 0 } } } };
		}
	}

	if (filters.inStore !== undefined) {
		if (filters.inStore) {
			query.images = { $exists: true, $not: { $size: 0 } };
		} else {
			query.images = { $size: 0 };
		}
	}

	if (filters.storageId && mongoose.isValidObjectId(filters.storageId)) {
		const storageObjectId = mongoose.Types.ObjectId.createFromHexString(
			filters.storageId,
		);
		query.locations = {
			$elemMatch: {
				storageId: storageObjectId,
			},
		};
	}

	const sortQuery: Record<string, SortOrder> = {};
	sort.map(({ field, order }) => {
		sortQuery[field] = order === "asc" ? 1 : -1;
	});

	await connectToMongo();
	const [products, total] = await Promise.all([
		Product.find(query)
			.sort(sortQuery)
			.skip(getOffsetFromPage(page, limit))
			.limit(limit),
		Product.countDocuments(query),
	]);

	if (isArrayEmpty(products)) {
		throw new ProductsNotFoundException();
	}

	return {
		data: products,
		total,
	};
};

export const getProductById = async (
	id: string,
	filters: ProductFilters,
): Promise<ProductType> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	const query: RootFilterQuery<typeof Product> = {
		_id: mongoose.Types.ObjectId.createFromHexString(id),
	};
	if (filters.storageId && mongoose.isValidObjectId(filters.storageId)) {
		const storageObjectId = mongoose.Types.ObjectId.createFromHexString(
			filters.storageId,
		);
		query.locations = {
			$elemMatch: {
				storageId: storageObjectId,
			},
		};
	}

	await connectToMongo();
	const product = await Product.findOne(query);
	if (!product) {
		throw new ProductsNotFoundException();
	}

	return product;
};

export const getProductsBatch = async (
	ids: Array<string>,
	fields: string[],
): Promise<ProductType[]> => {
	if (!ids.every(isValidObjectId)) {
		throw InvalidObjectIdException;
	}

	const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
	const projection = fields.reduce(
		(acc, field) => Object.assign(acc, { [field]: 1 }),
		{},
	);

	await connectToMongo();
	const products = await Product.find({ _id: { $in: objectIds } }, projection);
	if (isArrayEmpty(products)) {
		throw new ProductsNotFoundException();
	}

	return products;
};

export const createProduct = async (
	product: Partial<ProductType>,
): Promise<ProductType> => {
	await connectToMongo();

	const productData = { ...product };
	const newProduct = await Product.create(productData);

	const initialStock = Array.isArray(newProduct.locations)
		? newProduct.locations.reduce(
			(sum: number, location: { stock?: number }) => sum + (location.stock || 0),
			0
		)
		: 0;

	if (initialStock > 0) {
		await Product.findByIdAndUpdate(newProduct._id, { stock: initialStock });
		newProduct.stock = initialStock;
	}

	if (Array.isArray(newProduct.locations) && newProduct.locations.length > 0) {
		const storageIds = newProduct.locations.map(
			(location: { storageId: string | mongoose.Types.ObjectId }) =>
				location.storageId,
		);
		await Storage.updateMany(
			{ _id: { $in: storageIds } },
			{ $inc: { productsCount: 1 } },
		);
	}

	return newProduct;
};

export const updateProduct = async (
	id: string,
	product: Partial<ProductType>,
): Promise<ProductType> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();

	const currentProduct = await Product.findById(id);
	if (!currentProduct) {
		throw new ProductsNotFoundException();
	}

	const productData = { ...product };

	if (Array.isArray(productData.locations)) {
		const newStock = productData.locations.reduce(
			(sum: number, location: { stock?: number }) => sum + (location.stock || 0),
			0
		);
		productData.stock = newStock;
	}

	const updatedProduct = await Product.findByIdAndUpdate(
		{ _id: id },
		productData,
		{
			new: true,
		},
	);

	if (!updatedProduct) {
		throw new ProductsNotFoundException();
	}

	await updateStorageProductCount(currentProduct, updatedProduct);
	return updatedProduct;
};

export const deleteProduct = async (id: string): Promise<ProductType> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();

	const productToDelete = await Product.findById(id);
	if (!productToDelete) {
		throw new ProductsNotFoundException();
	}

	const deletedProduct = await Product.findByIdAndDelete({ _id: id });
	if (!deletedProduct) {
		throw new ProductsNotFoundException();
	}

	if (
		Array.isArray(productToDelete.locations) &&
		productToDelete.locations.length > 0
	) {
		const storageIds = productToDelete.locations.map(
			(location: { storageId: mongoose.Types.ObjectId }) => location.storageId,
		);
		await Storage.updateMany(
			{ _id: { $in: storageIds } },
			{ $inc: { productsCount: -1 } },
		);
	}

	return deletedProduct;
};

const updateStorageProductCount = async (
	oldProduct: ProductType,
	newProduct: ProductType,
) => {
	const oldStorageIds =
		oldProduct.locations?.map((loc) => loc.storageId.toString()) || [];
	const newStorageIds =
		newProduct.locations?.map((loc) => loc.storageId.toString()) || [];

	const addedStorageIds = newStorageIds.filter(
		(id) => !oldStorageIds.includes(id),
	);
	if (addedStorageIds.length > 0) {
		await Storage.updateMany(
			{ _id: { $in: addedStorageIds } },
			{ $inc: { productsCount: 1 } },
		);
	}

	const removedStorageIds = oldStorageIds.filter(
		(id) => !newStorageIds.includes(id),
	);
	if (removedStorageIds.length > 0) {
		await Storage.updateMany(
			{ _id: { $in: removedStorageIds } },
			{ $inc: { productsCount: -1 } },
		);
	}
};

export const deleteProducts = async (ids: Array<string>): Promise<number> => {
	if (!ids.every(isValidObjectId)) {
		throw InvalidObjectIdException;
	}

	if (isArrayEmpty(ids)) {
		throw new ProductsNotFoundException();
	}

	const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

	await connectToMongo();

	const productsToDelete = await Product.find({ _id: { $in: objectIds } });
	if (isArrayEmpty(productsToDelete)) {
		throw new ProductsNotFoundException();
	}

	const storageCountMap = new Map();
	for (const product of productsToDelete) {
		if (Array.isArray(product.locations)) {
			for (const location of product.locations) {
				const storageId = location.storageId.toString();
				storageCountMap.set(
					storageId,
					(storageCountMap.get(storageId) || 0) + 1,
				);
			}
		}
	}

	const { deletedCount } = await Product.deleteMany({
		_id: { $in: objectIds },
	});

	if (deletedCount === 0) {
		throw new ProductsNotFoundException();
	}

	const updateOperations = Array.from(storageCountMap.entries()).map(
		([storageId, count]) => ({
			updateOne: {
				filter: { _id: storageId },
				update: { $inc: { productsCount: -count } },
			},
		}),
	);

	if (updateOperations.length > 0) {
		await Storage.bulkWrite(updateOperations);
	}

	return deletedCount;
};
