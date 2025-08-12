import type { RoleType } from "@/config/roles";

export type UserRole = RoleType;

export type UserType = {
	_id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	role: UserRole;
	isActive: boolean;
	lastLogin?: string;
	createdAt: string;
	updatedAt: string;
	phone?: string;
	avatar?: string;
};

export type UserBasicInfo = Pick<
	UserType,
	"_id" | "firstName" | "lastName" | "email" | "username" | "avatar"
>;
