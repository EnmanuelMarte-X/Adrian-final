"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import type { UserBasicInfo, UserType } from "@/types/models/users";
import type { PaginationRequest } from "@/types/pagination";
import type { UserFilters } from "./types";

const USERS_QUERY_KEY = "users";

// Get a user by ID
export const useUserById = (id: string | undefined) => {
	return useQuery<UserType>({
		queryKey: [USERS_QUERY_KEY, "id", id],
		queryFn: async () => {
			if (!id) throw new Error("User ID is required");
			const response = await fetch(`/api/users/${id}`);
			if (!response.ok) {
				throw new Error("Failed to fetch user");
			}
			return response.json();
		},
		enabled: !!id,
	});
};

// Get basic user info for displaying in components
export const useUserBasicInfo = (id: string | undefined) => {
	return useQuery<UserBasicInfo>({
		queryKey: [USERS_QUERY_KEY, "basic-info", id],
		queryFn: async () => {
			if (!id) throw new Error("User ID is required");
			const response = await fetch(`/api/users/${id}/basic-info`);
			if (!response.ok) {
				throw new Error("Failed to fetch user basic info");
			}
			return response.json();
		},
		enabled: !!id,
	});
};

export const useUsers = (
	pagination: PaginationRequest = { page: 1, limit: 100 },
) => {
	return useQuery<{ data: UserType[]; total: number }>({
		queryKey: [USERS_QUERY_KEY, "list", pagination],
		queryFn: async () => {
			const params = new URLSearchParams();
			params.set("page", pagination.page.toString());
			params.set("limit", pagination.limit.toString());

			const response = await fetch(`/api/users?${params.toString()}`);
			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}
			return response.json();
		},
	});
};

// Infinite query for users with search and filters
export const useInfiniteUsers = (
	search?: string,
	filters?: UserFilters,
	limit = 20,
) => {
	return useInfiniteQuery({
		queryKey: [USERS_QUERY_KEY, "infinite", search, filters, limit],
		queryFn: async ({ pageParam = 1 }) => {
			const params = new URLSearchParams();
			params.set("page", pageParam.toString());
			params.set("limit", limit.toString());
			params.set("isActive", "true");

			if (search?.trim()) {
				params.set("name", search.trim());
			}

			if (filters) {
				if (filters.username) params.set("username", filters.username);
				if (filters.email) params.set("email", filters.email);
				if (filters.role) params.set("role", filters.role.name);
				if (filters.isActive !== undefined)
					params.set("isActive", filters.isActive.toString());
			}

			const response = await fetch(`/api/users?${params.toString()}`);
			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}
			return response.json();
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const totalPages = Math.ceil(lastPage.total / limit);
			const nextPage = allPages.length + 1;
			return nextPage <= totalPages ? nextPage : undefined;
		},
	});
};
