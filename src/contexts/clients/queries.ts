import {
	useQuery,
	keepPreviousData,
	useMutation,
	useInfiniteQuery,
} from "@tanstack/react-query";
import type { ClientFilters } from "./types";
import type { ClientType } from "@/types/models/clients";
import { queryClient } from "@/lib/query";
import type { PaginationRequest } from "@/types/pagination";
import {
	isArrayEmpty,
	isObjectEmpty,
	parseSafeUrlWithParams,
} from "@/lib/utils";

export function useClientsCount() {
	return useQuery({
		queryKey: ["clientsCount"],
		queryFn: async () => {
			const response = await fetch("/api/clients/count");

			if (!response.ok) {
				throw new Error(`Failed to fetch clients count: ${response.status}`);
			}

			const data = await response.json();
			return data.count as number;
		},
	});
}

export function useClients(
	{
		pagination,
		sort = [],
		filters = {},
	}: {
		pagination: PaginationRequest;
		sort?: { field: string; order: string }[];
		filters?: ClientFilters;
	} = { pagination: { page: 1, limit: 10 } },
) {
	return useQuery({
		queryKey: ["clients", pagination.page, pagination.limit, sort, filters],
		queryFn: async () => {
			const params = new URLSearchParams();

			if (pagination.page) params.set("page", pagination.page.toString());
			if (pagination.limit) params.set("limit", pagination.limit.toString());

			if (!isArrayEmpty(sort)) {
				const sortString = sort.map((s) => `${s.field}:${s.order}`).join(",");
				params.set("sort", sortString);
			}

			if (!isObjectEmpty(filters)) {
				params.set("filters", JSON.stringify(filters));
			}

			const response = await fetch(
				parseSafeUrlWithParams("/api/clients", params),
			);

			if (!response.ok && response.status !== 404) {
				throw new Error(`Failed to fetch clients: ${response.status}`);
			}

			if (response.status === 404) {
				return { clients: [], total: 0 };
			}

			const data = await response.json();
			return {
				clients: data.data as ClientType[],
				total: data.total as number,
			};
		},
		placeholderData: keepPreviousData,
	});
}

export const useClient = (clientId: string | undefined) =>
	useQuery({
		queryKey: ["clients", clientId],
		queryFn: async () => {
			if (!clientId) throw new Error("Client ID is required");
			const response = await fetch(`/api/clients/${clientId}`);

			if (!response.ok) {
				if (response.status === 404) {
					return null;
				}

				throw new Error(`Failed to fetch client: ${response.status}`);
			}

			const client = await response.json();
			return client as ClientType;
		},
		enabled: !!clientId,
	});

export const useDeleteClientMutation = (
	clientId: string,
	options?: {
		onSuccess?: () => void;
		onError?: () => void;
	},
) =>
	useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/clients/${clientId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error(`Failed to delete client: ${response.status}`);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["clients"] });
			queryClient.invalidateQueries({ queryKey: ["clientsCount"] });
			options?.onSuccess?.();
		},
		onError: () => {
			options?.onError?.();
		},
	});

export const useUpdateClientMutation = (
	clientId: string,
	options?: {
		onSuccess?: () => void;
		onError?: () => void;
	},
) =>
	useMutation({
		mutationFn: async (data: Partial<ClientType>) => {
			const response = await fetch(`/api/clients/${clientId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`Failed to update client: ${response.status}`);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["clients"] });
			queryClient.invalidateQueries({ queryKey: ["clientsCount"] });
			options?.onSuccess?.();
		},
		onError: () => {
			options?.onError?.();
		},
	});

export const useCreateClientMutation = (options?: {
	onSuccess?: () => void;
	onError?: () => void;
}) =>
	useMutation({
		mutationFn: async (data: Partial<ClientType>) => {
			const response = await fetch("/api/clients", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`Failed to create client: ${response.status}`);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["clients"] });
			queryClient.invalidateQueries({ queryKey: ["clientsCount"] });
			options?.onSuccess?.();
		},
		onError: () => {
			options?.onError?.();
		},
	});

export const useInfiniteClients = (filters?: ClientFilters, limit = 20) => {
	return useInfiniteQuery({
		queryKey: ["clients", "infinite", filters, limit],
		queryFn: async ({ pageParam = 1 }) => {
			const params = new URLSearchParams();
			params.set("page", pageParam.toString());
			params.set("limit", limit.toString());

			const queryFilters = { ...filters, isActive: true };
			if (!isObjectEmpty(queryFilters)) {
				params.set("filters", JSON.stringify(queryFilters));
			}

			const response = await fetch(
				parseSafeUrlWithParams("/api/clients", params),
			);

			if (!response.ok && response.status !== 404) {
				throw new Error(`Failed to fetch clients: ${response.status}`);
			}

			if (response.status === 404) {
				return { clients: [], total: 0 };
			}

			const data = await response.json();
			return {
				clients: data.data as ClientType[],
				total: data.total as number,
			};
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const totalPages = Math.ceil(lastPage.total / limit);
			const nextPage = allPages.length + 1;
			return nextPage <= totalPages ? nextPage : undefined;
		},
	});
};
