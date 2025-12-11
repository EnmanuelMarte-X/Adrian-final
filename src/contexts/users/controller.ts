import { connectToMongo } from "@/lib/mongo";
import { User } from "./model";
import mongoose, { isValidObjectId, type RootFilterQuery } from "mongoose";
import {
	UserNotFoundException,
	UsersNotFoundException,
	UserValidationException,
} from "./exceptions";
import { InvalidObjectIdException } from "@/contexts/shared/exceptions";
import type { PaginationRequest, PaginationResponse } from "@/types/pagination";
import type { UserBasicInfo, UserType } from "@/types/models/users";
import {
	getOffsetFromPage,
	getSafePaginationRequest,
	isArrayEmpty,
} from "@/lib/utils";
import type { UserFilters } from "./types";

export const getUsersCount = async (): Promise<number> => {
	await connectToMongo();
	return await User.countDocuments({});
};

export const getUsers = async (
	pagination: PaginationRequest,
	filters?: UserFilters,
): Promise<PaginationResponse<UserType>> => {
	const { page, limit } = getSafePaginationRequest(pagination);

	const query: RootFilterQuery<typeof User> = {};

	if (filters) {
		if (filters.username)
			query.username = { $regex: filters.username, $options: "i" };
		if (filters.email) query.email = { $regex: filters.email, $options: "i" };
		if (filters.name) {
			query.$or = [
				{ firstName: { $regex: filters.name, $options: "i" } },
				{ lastName: { $regex: filters.name, $options: "i" } },
			];
		}
		if (filters.role) query["roles.name"] = filters.role;
		if (filters.isActive !== undefined) query.isActive = filters.isActive;
	}

	await connectToMongo();
	const users = await User.find(query)
		.sort({ createdAt: -1 })
		.limit(limit)
		.skip(getOffsetFromPage(page, limit));

	if (isArrayEmpty(users)) {
		throw new UsersNotFoundException();
	}

	const total = await User.find(query).countDocuments();

	// Transformar los documentos para que _id sea string
	const plainUsers = users.map((user) => {
		const obj = user.toObject();
		return {
			...obj,
			_id: obj._id.toString(),
			createdAt: obj.createdAt?.toString(),
			updatedAt: obj.updatedAt?.toString(),
			lastName: typeof obj.lastName === "string" ? obj.lastName : "",
			lastLogin:
				obj.lastLogin === undefined || obj.lastLogin === null
					? undefined
					: obj.lastLogin instanceof Date
						? obj.lastLogin.toISOString()
						: typeof obj.lastLogin === "string"
							? obj.lastLogin
							: undefined,
			phone: typeof obj.phone === "string" ? obj.phone : undefined,
			avatar: typeof obj.avatar === "string" ? obj.avatar : undefined,
		};
	});

	return {
		data: plainUsers,
		total,
	};
};

export const getUserById = async (id: string): Promise<UserType> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();
	const user = await User.findById(new mongoose.Types.ObjectId(id));

	if (!user) {
		throw new UserNotFoundException();
	}

	const obj = user.toObject();
	return {
		...obj,
		_id: obj._id.toString(),
		createdAt: obj.createdAt?.toString(),
		updatedAt: obj.updatedAt?.toString(),
		lastName: typeof obj.lastName === "string" ? obj.lastName : "",
		lastLogin:
			obj.lastLogin === undefined || obj.lastLogin === null
				? undefined
				: obj.lastLogin instanceof Date
					? obj.lastLogin.toISOString()
					: typeof obj.lastLogin === "string"
						? obj.lastLogin
						: undefined,
		phone: typeof obj.phone === "string" ? obj.phone : undefined,
		avatar: typeof obj.avatar === "string" ? obj.avatar : undefined,
	};
};

export const getUserBasicInfo = async (id: string): Promise<UserBasicInfo> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();
	const user = await User.findById(new mongoose.Types.ObjectId(id)).select(
		"firstName lastName email username avatar",
	);

	if (!user) {
		throw new UserNotFoundException();
	}

	const obj = user.toObject();
	return {
		...obj,
		_id: obj._id.toString(),
		firstName: typeof obj.firstName === "string" ? obj.firstName : "",
		lastName: typeof obj.lastName === "string" ? obj.lastName : "",
		email: typeof obj.email === "string" ? obj.email : "",
		username: typeof obj.username === "string" ? obj.username : "",
		avatar: typeof obj.avatar === "string" ? obj.avatar : undefined,
	};
};

export const createUser = async (
	userData: Partial<UserType>,
): Promise<UserType> => {
	await connectToMongo();

	try {
		const user = await User.create(userData);
		const obj = user.toObject();
		return {
			...obj,
			_id: obj._id.toString(),
			createdAt: obj.createdAt?.toString(),
			updatedAt: obj.updatedAt?.toString(),
			lastName: typeof obj.lastName === "string" ? obj.lastName : "",
			lastLogin:
				obj.lastLogin === undefined || obj.lastLogin === null
					? undefined
					: obj.lastLogin instanceof Date
						? obj.lastLogin.toISOString()
						: typeof obj.lastLogin === "string"
							? obj.lastLogin
							: undefined,
			phone: typeof obj.phone === "string" ? obj.phone : undefined,
			avatar: typeof obj.avatar === "string" ? obj.avatar : undefined,
		};
	} catch {
		throw new UserValidationException();
	}
};

export const updateUser = async (
	id: string,
	userData: Partial<UserType>,
): Promise<UserType> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();
	const updatedUser = await User.findByIdAndUpdate(
		new mongoose.Types.ObjectId(id),
		{ ...userData, updatedAt: new Date() },
		{ new: true },
	);

	if (!updatedUser) {
		throw new UserNotFoundException();
	}

	const obj = updatedUser.toObject();
	return {
		...obj,
		_id: obj._id.toString(),
		createdAt: obj.createdAt?.toString(),
		updatedAt: obj.updatedAt?.toString(),
		lastName: typeof obj.lastName === "string" ? obj.lastName : "",
		lastLogin:
			obj.lastLogin === undefined || obj.lastLogin === null
				? undefined
				: obj.lastLogin instanceof Date
					? obj.lastLogin.toISOString()
					: typeof obj.lastLogin === "string"
						? obj.lastLogin
						: undefined,
		phone: typeof obj.phone === "string" ? obj.phone : undefined,
		avatar: typeof obj.avatar === "string" ? obj.avatar : undefined,
	};
};

export const deleteUser = async (id: string): Promise<UserType> => {
	if (!isValidObjectId(id)) {
		throw InvalidObjectIdException;
	}

	await connectToMongo();
	const deletedUser = await User.findByIdAndDelete(id);

	if (!deletedUser) {
		throw new UserNotFoundException();
	}

	const obj = deletedUser.toObject();
	return {
		...obj,
		_id: obj._id.toString(),
		createdAt: obj.createdAt?.toString(),
		updatedAt: obj.updatedAt?.toString(),
		lastName: typeof obj.lastName === "string" ? obj.lastName : "",
		lastLogin:
			obj.lastLogin === undefined || obj.lastLogin === null
				? undefined
				: obj.lastLogin instanceof Date
					? obj.lastLogin.toISOString()
					: typeof obj.lastLogin === "string"
						? obj.lastLogin
						: undefined,
		phone: typeof obj.phone === "string" ? obj.phone : undefined,
		avatar: typeof obj.avatar === "string" ? obj.avatar : undefined,
	};
};
