import type { UserRole } from "@/types/models/users";

export interface UserFilters {
	username?: string;
	email?: string;
	name?: string;
	role?: UserRole;
	isActive?: boolean;
}
