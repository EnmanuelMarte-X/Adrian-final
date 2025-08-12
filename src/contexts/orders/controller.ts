import { connectToMongo } from "@/lib/mongo";
import { Order } from "./model";
import { Client } from "@/contexts/clients/model";
import { Product } from "@/contexts/products/model";
import { User } from "@/contexts/users/model";
import { calculateClientDebt } from "@/contexts/clients/controller";
import mongoose, { isValidObjectId, type RootFilterQuery } from "mongoose";
import type { PaginationRequest, PaginationResponse } from "@/types/pagination";
import type { OrderFilters } from "./types";
import {
	getOffsetFromPage,
	getSafePaginationRequest,
	isArrayEmpty,
} from "@/lib/utils";
import { OrdersNotFoundException } from "./exceptions";
import { InvalidObjectIdException } from "@/contexts/shared/exceptions";
import type {
	OrderProductDetails,
	OrderType,
	OrderTypeWithProducts,
} from "@/types/models/orders";

const ensureModelsRegistered = () => {
	void Client;
	void Product;
	void User;
};

export const getOrdersCount = async (): Promise<number> => {
	await connectToMongo();
	return await Order.countDocuments({});
};

export const getOrders = async (
	pagination: PaginationRequest,
	filters: OrderFilters,
): Promise<PaginationResponse<OrderType>> => {
	ensureModelsRegistered();
	const { page, limit } = getSafePaginationRequest(pagination);

	const query: RootFilterQuery<typeof Order> = {};
	if (filters.productId) {
		if (!mongoose.Types.ObjectId.isValid(filters.productId)) {
			throw new OrdersNotFoundException();
		}

		query.products = {
			$elemMatch: { productId: new mongoose.Types.ObjectId(filters.productId) },
		};
	}

	if (filters.orderId) query.orderId = filters.orderId;
	if (filters.buyerId)
		query.buyerId = new mongoose.Types.ObjectId(filters.buyerId);
	if (filters.sellerId)
		query.sellerId = new mongoose.Types.ObjectId(filters.sellerId);
	if (filters.cfSequence) query.cfSequence = filters.cfSequence;
	if (filters.ncfSequence) query.ncfSequence = filters.ncfSequence;

	if (filters.date) {
		const createDateBoundary = (date: string | Date, isStart: boolean) => {
			const dateObj = new Date(date);
			if (isStart) {
				return new Date(dateObj.setHours(0, 0, 0, 0));
			}

			return new Date(dateObj.setHours(23, 59, 59, 999));
		};

		if (filters.date instanceof Date || typeof filters.date === "string") {
			query.date = {
				$gte: createDateBoundary(filters.date, true),
				$lte: createDateBoundary(filters.date, false),
			};
		}

		if (typeof filters.date === "object") {
			query.date = {};

			if ("from" in filters.date && filters.date.from) {
				query.date.$gte = createDateBoundary(filters.date.from, true);
			}

			if ("to" in filters.date && filters.date.to) {
				query.date.$lte = createDateBoundary(filters.date.to, false);
			}
		}
	}

	if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod;
	if (filters.shippingAddress)
		query.shippingAddress = { $regex: filters.shippingAddress, $options: "i" };

	const orders = await Order.find(query)
		.populate({
			path: "buyerId",
			model: "Client",
			select: "name email documentType documentNumber type",
		})
		.populate({
			path: "sellerId",
			model: "User",
			select: "firstName lastName email username avatar",
		})
		.sort({ date: -1 })
		.limit(limit)
		.skip(getOffsetFromPage(page, limit));

	if (isArrayEmpty(orders)) {
		throw new OrdersNotFoundException();
	}

	const total = await Order.find(query).countDocuments();

	return {
		data: orders,
		total,
	};
};

export const getOrderById = async (
	id: string,
): Promise<OrderTypeWithProducts> => {
	ensureModelsRegistered();
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();

	const order = await Order.findById(new mongoose.Types.ObjectId(id))
		.populate({
			path: "products.productId",
			model: "Product",
		})
		.populate({
			path: "buyerId",
			model: "Client",
			select: "name email documentType documentNumber type",
		})
		.populate({
			path: "sellerId",
			model: "User",
			select: "firstName lastName email username avatar",
		});

	if (!order) {
		throw new OrdersNotFoundException();
	}

	const orderObject = order.toObject();

	if (orderObject.buyerId && typeof orderObject.buyerId === "object") {
		if (!orderObject.buyerId._id) {
			orderObject.buyerId = null;
		} else {
			const debt = await calculateClientDebt(
				orderObject.buyerId._id.toString(),
			);
			orderObject.buyerId.debt = debt;
		}
	}

	if (orderObject.sellerId && typeof orderObject.sellerId === "object") {
		if (!orderObject.sellerId._id) {
			orderObject.sellerId = null;
		}
	}

	if (!orderObject.products || orderObject.products.length === 0) {
		orderObject.products = [];
		return orderObject as OrderTypeWithProducts;
	}

	interface PopulatedOrderProduct {
		productId:
			| {
					_id: string;
					name?: string;
					retailPrice?: number;
					wholesalePrice?: number;
					cost?: number;
			  }
			| string;
		quantity: number;
		discount?: number;
	}

	const products = (orderObject.products as PopulatedOrderProduct[])
		.map((item) => {
			const product = item.productId;
			if (!product || typeof product !== "object" || !product._id) {
				console.warn("Product not found or invalid for item:", item);
				return null;
			}

			return {
				productId: product._id.toString(),
				name: product.name || "Producto sin nombre",
				retailPrice: product.retailPrice || 0,
				wholesalePrice: product.wholesalePrice || 0,
				cost: product.cost || 0,
				quantity: item.quantity || 0,
				discount: item.discount || 0,
			} as OrderProductDetails;
		})
		.filter(Boolean) as OrderProductDetails[];

	orderObject.products = products;

	return orderObject as OrderTypeWithProducts;
};

export const createOrder = async (
	order: Omit<OrderType, "_id">,
): Promise<OrderType> => {
	await connectToMongo();
	return await Order.create(order);
};

export const updateOrder = async (
	id: string,
	order: Partial<Omit<OrderType, "_id">>,
) => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();
	const updatedOrder = await Order.findByIdAndUpdate({ _id: id }, order, {
		new: true,
	});
	if (!updatedOrder) {
		throw new OrdersNotFoundException();
	}

	return updatedOrder;
};

export const deleteOrder = async (id: string): Promise<OrderType> => {
	await connectToMongo();
	const deletedOrder = await Order.findOneAndDelete({ orderId: id });
	if (!deletedOrder) {
		throw new OrdersNotFoundException();
	}

	return deletedOrder;
};

export const deleteOrders = async (ids: string[]): Promise<number> => {
	if (!ids.every(isValidObjectId)) {
		throw InvalidObjectIdException;
	}

	if (isArrayEmpty(ids)) {
		throw new OrdersNotFoundException();
	}

	const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

	await connectToMongo();
	const result = await Order.deleteMany({ _id: { $in: objectIds } });

	if (result.deletedCount === 0) {
		throw new OrdersNotFoundException();
	}

	return result.deletedCount;
};
