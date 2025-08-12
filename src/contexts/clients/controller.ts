import type { PaginationRequest, PaginationResponse } from "@/types/pagination";

import { connectToMongo } from "@/lib/mongo";
import { Client } from "./model";

import mongoose, {
	isValidObjectId,
	type RootFilterQuery,
	type SortOrder,
} from "mongoose";

import {
	getOffsetFromPage,
	getSafePaginationRequest,
	isArrayEmpty,
} from "@/lib/utils";

import {
	ClientNotFoundException,
	InvalidClientDataException,
} from "./exceptions";

import { InvalidObjectIdException } from "@/contexts/shared/exceptions";
import type { ClientType } from "@/types/models/clients";
import type { ClientFilters, ClientSort } from "./types";
import { PaymentHistory } from "../paymentHistory/model";
import { Order } from "../orders/model";
import { TAX_PERCENTAGE } from "@/config/shop";

export const getClientsCount = async (): Promise<number> => {
	await connectToMongo();
	return await Client.countDocuments({});
};

export const calculateClientDebt = async (
	clientId: string,
): Promise<number> => {
	const ordersTotal = await Order.aggregate([
		{ $match: { buyerId: new mongoose.Types.ObjectId(clientId) } },
		{ $unwind: "$products" },
		{
			$group: {
				_id: "$_id",
				orderTotal: {
					$sum: {
						$multiply: ["$products.price", "$products.quantity"],
					},
				},
				orderDiscount: {
					$sum: { $ifNull: ["$products.discount", 0] },
				},
			},
		},
		{
			$group: {
				_id: null,
				subtotal: { $sum: "$orderTotal" },
				totalDiscount: { $sum: "$orderDiscount" },
			},
		},
		{
			$project: {
				_id: 0,
				total: {
					$add: [
						{ $subtract: ["$subtotal", "$totalDiscount"] },
						{
							$multiply: [
								{ $subtract: ["$subtotal", "$totalDiscount"] },
								TAX_PERCENTAGE,
							],
						},
					],
				},
			},
		},
	]);

	const totalPaid = await PaymentHistory.aggregate([
		{ $match: { clientId: new mongoose.Types.ObjectId(clientId) } },
		{ $group: { _id: null, total: { $sum: "$amount" } } },
	]);

	const invoiceTotal = ordersTotal[0]?.total || 0;
	const paidTotal = totalPaid[0]?.total || 0;
	return paidTotal - invoiceTotal;
};

export const getClients = async (
	pagination: PaginationRequest,
	filters: ClientFilters,
	sort: ClientSort[],
): Promise<PaginationResponse<ClientType>> => {
	const { page, limit } = getSafePaginationRequest(pagination);

	const query: RootFilterQuery<typeof Client> = {};

	if (filters.name) {
		query.name = { $regex: filters.name, $options: "i" };
	}

	if (typeof filters.isActive === "boolean") {
		query.isActive = filters.isActive;
	}

	if (filters.documentNumber) {
		query.documentNumber = { $regex: filters.documentNumber, $options: "i" };
	}

	if (filters.documentType) {
		query.documentType = filters.documentType;
	}

	if (filters.type) {
		query.type = filters.type;
	}

	if (filters.email) {
		query.email = { $regex: filters.email, $options: "i" };
	}

	if (filters.phone) {
		query.phones = {
			$elemMatch: { number: { $regex: filters.phone, $options: "i" } },
		};
	}

	if (filters.isActive !== undefined) {
		query.isActive = filters.isActive;
	}

	const sortQuery: Record<string, SortOrder> = {};
	sort.map(({ field, order }) => {
		sortQuery[field] = order === "asc" ? 1 : -1;
	});

	await connectToMongo();
	const [clients, total] = await Promise.all([
		Client.find(query)
			.sort(sortQuery)
			.skip(getOffsetFromPage(page, limit))
			.limit(limit),
		Client.countDocuments(query),
	]);

	if (isArrayEmpty(clients)) {
		throw new ClientNotFoundException();
	}

	const clientsWithDebt = await Promise.all(
		clients.map(async (client) => {
			const debt = await calculateClientDebt(client._id.toString());
			return {
				...client.toObject(),
				debt,
			};
		}),
	);

	return {
		data: clientsWithDebt,
		total,
	};
};

export const getClientById = async (id: string): Promise<ClientType> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();
	const client = await Client.findById(id);

	if (!client) {
		throw new ClientNotFoundException();
	}

	const debt = await calculateClientDebt(id);

	return {
		...client.toObject(),
		debt,
	};
};

export const getClientsBatch = async (
	ids: Array<string>,
	fields?: string[],
): Promise<ClientType[]> => {
	if (!ids.every(isValidObjectId)) {
		throw InvalidObjectIdException;
	}

	const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));
	const projection = fields?.reduce(
		(acc, field) => Object.assign(acc, { [field]: 1 }),
		{},
	);

	await connectToMongo();
	const clients = await Client.find({ _id: { $in: objectIds } }, projection);

	if (isArrayEmpty(clients)) {
		throw new ClientNotFoundException();
	}

	return clients;
};

export const createClient = async (
	client: Partial<ClientType>,
): Promise<ClientType> => {
	await connectToMongo();

	try {
		// Limpiar datos antes de crear
		const cleanedClient = { ...client };

		// Filtrar teléfonos que no tengan número
		if (cleanedClient.phones) {
			cleanedClient.phones = cleanedClient.phones.filter(
				(phone) => phone.number && phone.number.trim() !== "",
			);
		}

		// Filtrar direcciones que no tengan todos los campos requeridos
		if (cleanedClient.addresses) {
			cleanedClient.addresses = cleanedClient.addresses.filter(
				(address) =>
					address.street &&
					address.street.trim() !== "" &&
					address.city &&
					address.city.trim() !== "" &&
					address.state &&
					address.state.trim() !== "" &&
					address.zipCode &&
					address.zipCode.trim() !== "" &&
					address.country &&
					address.country.trim() !== "",
			);
		}

		// Validar que al menos haya un teléfono
		if (!cleanedClient.phones || cleanedClient.phones.length === 0) {
			throw new InvalidClientDataException();
		}

		// Asegurar que haya un teléfono primario
		if (cleanedClient.phones && cleanedClient.phones.length > 0) {
			const hasPrimaryPhone = cleanedClient.phones.some(
				(phone) => phone.isPrimary,
			);
			if (!hasPrimaryPhone) {
				cleanedClient.phones[0].isPrimary = true;
			}
		}

		// Asegurar que haya una dirección primaria si hay direcciones
		if (cleanedClient.addresses && cleanedClient.addresses.length > 0) {
			const hasPrimaryAddress = cleanedClient.addresses.some(
				(address) => address.isPrimary,
			);
			if (!hasPrimaryAddress) {
				cleanedClient.addresses[0].isPrimary = true;
			}
		}

		return await Client.create(cleanedClient);
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			throw new InvalidClientDataException();
		}
		throw error;
	}
};

export const updateClient = async (
	id: string,
	client: Partial<ClientType>,
): Promise<ClientType> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();

	client.updatedAt = new Date();

	try {
		const updatedClient = await Client.findByIdAndUpdate({ _id: id }, client, {
			new: true,
		});

		if (!updatedClient) {
			throw new ClientNotFoundException();
		}

		return updatedClient;
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			throw new InvalidClientDataException();
		}
		throw error;
	}
};

export const deleteClient = async (id: string): Promise<ClientType> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();
	const deletedClient = await Client.findByIdAndDelete(id);

	if (!deletedClient) {
		throw new ClientNotFoundException();
	}

	return deletedClient;
};

export const deleteClients = async (ids: string[]): Promise<number> => {
	if (!ids.every(isValidObjectId)) {
		throw InvalidObjectIdException;
	}

	if (isArrayEmpty(ids)) {
		throw new ClientNotFoundException();
	}

	const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

	await connectToMongo();
	const result = await Client.deleteMany({ _id: { $in: objectIds } });

	if (result.deletedCount === 0) {
		throw new ClientNotFoundException();
	}

	return result.deletedCount;
};
