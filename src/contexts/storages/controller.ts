import type {
	InfiniteScrollPaginationRequest,
	PaginationResponse,
} from "@/types/pagination";
import { Storage } from "./model";
import { connectToMongo } from "@/lib/mongo";
import type { StorageType } from "@/types/models/storages";
import { StorageNotFoundException } from "./exceptions";
import { isValidObjectId, type RootFilterQuery } from "mongoose";
import { Product } from "@/contexts/products/model";

export const fixStorageProductCounts = async (): Promise<{
	success: boolean;
	fixed: Array<{
		storageId: string;
		storageName: string;
		oldCount: number;
		newCount: number;
	}>;
}> => {
	await connectToMongo();
	
	const storages = await Storage.find({});
	const fixed = [];
	
	for (const storage of storages) {
		// Count actual products that have this storage in their locations
		const actualProductCount = await Product.countDocuments({
			"locations.storageId": storage._id,
		});
		
		if (storage.productsCount !== actualProductCount) {
			fixed.push({
				storageId: storage._id.toString(),
				storageName: storage.name,
				oldCount: storage.productsCount,
				newCount: actualProductCount,
			});
			
			// Update the productsCount field
			await Storage.findByIdAndUpdate(storage._id, {
				productsCount: actualProductCount,
			});
		}
	}
	
	return {
		success: true,
		fixed,
	};
};

export const getStoragesCount = async (): Promise<number> => {
	await connectToMongo();

	const count = await Storage.countDocuments({});

	if (count === null) {
		throw new StorageNotFoundException();
	}

	return count;
};

export const getStorages = async (
	params: InfiniteScrollPaginationRequest & { ids?: string[] },
): Promise<PaginationResponse<StorageType>> => {
	await connectToMongo();

	const offset = Math.max(0, params.offset || 0);
	const limit = Math.max(1, Math.min(100, params.limit || 20));

	const query: RootFilterQuery<typeof Storage> = {};

	if (params.ids && params.ids.length > 0) {
		query._id = {
			$in: params.ids.map((id) => {
				if (!isValidObjectId(id)) {
					throw new StorageNotFoundException();
				}

				return id;
			}),
		};
	}

	const storages = await Storage.find({})
		.skip(offset)
		.limit(limit)
		.sort({ order: 1 });

	if (!storages) {
		throw new StorageNotFoundException();
	}

	const total = await Storage.countDocuments({});

	return {
		data: storages,
		total,
	};
};

export const getStorageById = async (id: string): Promise<StorageType> => {
	if (!isValidObjectId(id)) {
		throw new StorageNotFoundException();
	}

	await connectToMongo();
	const storage = await Storage.findById(id);

	if (!storage) {
		throw new StorageNotFoundException();
	}

	return storage;
};

export const createStorage = async (
	storage: StorageType,
): Promise<StorageType> => {
	await connectToMongo();
	return await Storage.create(storage);
};

export const updateStorage = async (
	id: string,
	storage: StorageType,
): Promise<StorageType> => {
	if (!isValidObjectId(id)) {
		throw new StorageNotFoundException();
	}

	await connectToMongo();
	const updatedStorage = await Storage.findByIdAndUpdate(id, storage, {
		new: true,
	});

	if (!updatedStorage) {
		throw new StorageNotFoundException();
	}

	return updatedStorage;
};

export const deleteStorage = async (id: string): Promise<StorageType> => {
	if (!isValidObjectId(id)) {
		throw new StorageNotFoundException();
	}

	await connectToMongo();
	const deletedStorage = await Storage.findByIdAndDelete(id);

	if (!deletedStorage) {
		throw new StorageNotFoundException();
	}

	return deletedStorage;
};

export const updateStorageOrder = async (
	storageIds: string[],
): Promise<void> => {
	await connectToMongo();

	const updateOperations = storageIds.map((id, index) => ({
		updateOne: {
			filter: { _id: id },
			update: { $set: { order: index } },
		},
	}));

	await Storage.bulkWrite(updateOperations);
};
