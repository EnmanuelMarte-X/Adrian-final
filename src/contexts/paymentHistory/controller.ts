import { PaymentHistory } from "./model";
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
import type { PaymentHistoryFilters, PaymentHistorySort } from "./types";
import { connectToMongo } from "@/lib/mongo";
import mongoose from "mongoose";
import type { PaymentHistoryType } from "@/types/models/paymentHistory";
import {
	PaymentHistoryNotFoundException,
	InvalidPaymentAmountException,
} from "./exceptions";
import { Client } from "../clients/model";
import { Product } from "../products/model";
import { Order } from "../orders/model";

const ensureModelsRegistered = () => {
	void Client;
	void Product;
	void Order;
};

export const getPaymentHistoryCount = async () => {
	await connectToMongo();
	return await PaymentHistory.countDocuments({});
};

export const getPaymentHistory = async (
	pagination: PaginationRequest,
	filters: PaymentHistoryFilters,
	sort: PaymentHistorySort[],
): Promise<PaginationResponse<PaymentHistoryType>> => {
	const { page, limit } = getSafePaginationRequest(pagination);

	const query: RootFilterQuery<typeof PaymentHistory> = {};

	if (filters.orderId) {
		if (!isValidObjectId(filters.orderId)) {
			throw InvalidObjectIdException;
		}
		query.orderId = mongoose.Types.ObjectId.createFromHexString(
			filters.orderId,
		);
	}

	if (filters.clientId) {
		if (!isValidObjectId(filters.clientId)) {
			throw InvalidObjectIdException;
		}
		query.clientId = mongoose.Types.ObjectId.createFromHexString(
			filters.clientId,
		);
	}

	if (filters.method) {
		query.method = filters.method;
	}

	if (filters.amount) {
		query.amount = { $gte: filters.amount[0], $lte: filters.amount[1] };
	}

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

	const sortQuery: Record<string, SortOrder> = {};
	sort.map(({ field, order }) => {
		sortQuery[field] = order === "asc" ? 1 : -1;
	});

	if (Object.keys(sortQuery).length === 0) {
		sortQuery.date = -1;
	}

	ensureModelsRegistered();
	await connectToMongo();
	const [payments, total] = await Promise.all([
		PaymentHistory.find(query)
			.populate({
				path: "clientId",
				model: "Client",
				select: "name email documentType documentNumber type",
			})
			.populate({
				path: "orderId",
				model: "Order",
				select: "orderId",
			})
			.sort(sortQuery)
			.skip(getOffsetFromPage(page, limit))
			.limit(limit),
		PaymentHistory.countDocuments(query),
	]);

	if (isArrayEmpty(payments)) {
		throw new PaymentHistoryNotFoundException();
	}

	return {
		data: payments,
		total,
	};
};

export const getPaymentHistoryById = async (
	id: string,
): Promise<PaymentHistoryType> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();
	const payment = await PaymentHistory.findById(id)
		.populate({
			path: "clientId",
			model: "Client",
			select: "name email documentType documentNumber type",
		})
		.populate({
			path: "orderId",
			model: "Order",
			select: "orderId products",
			populate: {
				path: "products.productId",
				model: "Product",
				select: "name retailPrice wholesalePrice cost",
			},
		});

	if (!payment) {
		throw new PaymentHistoryNotFoundException();
	}

	return payment;
};

export const getPaymentHistoryByOrderId = async (
	orderId: string,
): Promise<PaymentHistoryType[]> => {
	if (!isValidObjectId(orderId)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();
	const payments = await PaymentHistory.find({ orderId })
		.populate({
			path: "clientId",
			model: "Client",
			select: "name email documentType documentNumber type",
		})
		.sort({ date: -1 });

	return payments;
};

export const getPaymentHistoryByClientId = async (
	clientId: string,
	pagination?: PaginationRequest,
): Promise<PaginationResponse<PaymentHistoryType> | PaymentHistoryType[]> => {
	if (!isValidObjectId(clientId)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();

	if (pagination) {
		const { page, limit } = getSafePaginationRequest(pagination);
		const [payments, total] = await Promise.all([
			PaymentHistory.find({ clientId })
				.populate({
					path: "orderId",
					model: "Order",
					select: "orderId",
				})
				.sort({ date: -1 })
				.skip(getOffsetFromPage(page, limit))
				.limit(limit),
			PaymentHistory.countDocuments({ clientId }),
		]);

		return {
			data: payments,
			total,
		};
	}

	const payments = await PaymentHistory.find({ clientId })
		.populate({
			path: "orderId",
			model: "Order",
			select: "orderId",
		})
		.sort({ date: -1 });

	return payments;
};

export const createPaymentHistory = async (
	payment: Partial<PaymentHistoryType>,
): Promise<PaymentHistoryType> => {
	if (!payment.amount || payment.amount <= 0) {
		throw new InvalidPaymentAmountException();
	}

	if (!payment.orderId || !isValidObjectId(payment.orderId)) {
		throw InvalidObjectIdException;
	}

	if (!payment.clientId || !isValidObjectId(payment.clientId)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();

	const paymentData = {
		...payment,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	const newPayment = await PaymentHistory.create(paymentData);

	const populatedPayment = await PaymentHistory.findById(newPayment._id)
		.populate({
			path: "clientId",
			model: "Client",
			select: "name email documentType documentNumber type",
		})
		.populate({
			path: "orderId",
			model: "Order",
			select: "orderId",
		});

	if (!populatedPayment) {
		throw new PaymentHistoryNotFoundException();
	}

	return populatedPayment;
};

export const updatePaymentHistory = async (
	id: string,
	payment: Partial<PaymentHistoryType>,
): Promise<PaymentHistoryType> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	if (payment.amount !== undefined && payment.amount <= 0) {
		throw new InvalidPaymentAmountException();
	}

	await connectToMongo();

	const paymentData = {
		...payment,
		updatedAt: new Date(),
	};

	const updatedPayment = await PaymentHistory.findByIdAndUpdate(
		{ _id: id },
		paymentData,
		{ new: true },
	)
		.populate({
			path: "clientId",
			model: "Client",
			select: "name email documentType documentNumber type",
		})
		.populate({
			path: "orderId",
			model: "Order",
			select: "orderId",
		});

	if (!updatedPayment) {
		throw new PaymentHistoryNotFoundException();
	}

	return updatedPayment;
};

export const deletePaymentHistory = async (
	id: string,
): Promise<PaymentHistoryType> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();

	const deletedPayment = await PaymentHistory.findByIdAndDelete({ _id: id });
	if (!deletedPayment) {
		throw new PaymentHistoryNotFoundException();
	}

	return deletedPayment;
};

export const deletePaymentHistoryBatch = async (
	ids: Array<string>,
): Promise<number> => {
	if (!ids.every(isValidObjectId)) {
		throw InvalidObjectIdException;
	}

	if (isArrayEmpty(ids)) {
		throw new PaymentHistoryNotFoundException();
	}

	const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

	await connectToMongo();

	const { deletedCount } = await PaymentHistory.deleteMany({
		_id: { $in: objectIds },
	});

	if (deletedCount === 0) {
		throw new PaymentHistoryNotFoundException();
	}

	return deletedCount;
};

export const deletePaymentHistoryByOrderId = async (
	orderId: string,
): Promise<number> => {
	if (!orderId) {
		throw new PaymentHistoryNotFoundException();
	}

	await connectToMongo();

	const { deletedCount } = await PaymentHistory.deleteMany({
		orderId: orderId,
	});

	return deletedCount;
};

export const getPaymentAnalytics = async (period = 12) => {
	await connectToMongo();

	const startDate = new Date();
	startDate.setMonth(startDate.getMonth() - period);

	const analytics = await PaymentHistory.aggregate([
		{
			$match: {
				date: { $gte: startDate },
			},
		},
		{
			$group: {
				_id: {
					year: { $year: "$date" },
					month: { $month: "$date" },
					method: "$method",
				},
				totalAmount: { $sum: "$amount" },
				count: { $sum: 1 },
			},
		},
		{
			$group: {
				_id: {
					year: "$_id.year",
					month: "$_id.month",
				},
				methods: {
					$push: {
						method: "$_id.method",
						totalAmount: "$totalAmount",
						count: "$count",
					},
				},
				totalMonthAmount: { $sum: "$totalAmount" },
				totalMonthCount: { $sum: "$count" },
			},
		},
		{
			$sort: { "_id.year": 1, "_id.month": 1 },
		},
	]);

	const methodTotals = await PaymentHistory.aggregate([
		{
			$match: {
				date: { $gte: startDate },
			},
		},
		{
			$group: {
				_id: "$method",
				totalAmount: { $sum: "$amount" },
				count: { $sum: 1 },
			},
		},
	]);

	return {
		monthlyData: analytics,
		methodTotals,
		period,
	};
};
