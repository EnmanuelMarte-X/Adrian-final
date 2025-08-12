import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import type { OrderType, OrderTypeWithProducts } from "@/types/models/orders";
import { queryClient } from "@/lib/query";
import type { OrderFilters } from "./types";

export function useOrdersCount() {
	return useQuery({
		queryKey: ["ordersCount"],
		queryFn: async () => {
			const response = await fetch("/api/orders/count");

			if (!response.ok) {
				throw new Error(`Failed to fetch orders count: ${response.status}`);
			}

			const { count } = await response.json();
			return count ?? 0;
		},
	});
}

export function useOrders({
	page,
	limit,
	sort = [],
	filters = {},
}: {
	page?: number;
	limit?: number;
	sort?: { field: string; order: string }[];
	filters?: OrderFilters;
} = {}) {
	return useQuery({
		queryKey: ["orders", page, limit, sort, filters],
		placeholderData: keepPreviousData,
		refetchOnWindowFocus: false,
		queryFn: async () => {
			const params = new URLSearchParams();

			if (page !== undefined) params.set("page", page.toString());
			if (limit !== undefined) params.set("limit", limit.toString());

			if (sort && sort.length > 0) {
				const sortString = sort.map((s) => `${s.field}:${s.order}`).join(",");
				params.set("sort", sortString);
			}

			if (filters && Object.keys(filters).length > 0) {
				params.set("filters", JSON.stringify(filters));
			}

			const queryString = params.toString();
			const url = queryString ? `/api/orders?${queryString}` : "/api/orders";

			const response = await fetch(url);

			if (!response.ok && response.status !== 404) {
				throw new Error(`Failed to fetch orders: ${response.status}`);
			}

			const { data, total } = await response.json();
			return {
				orders: data as OrderType[],
				total: total as number,
			};
		},
	});
}

export function useOrderById(id: string) {
	return useQuery({
		queryKey: ["order", id],
		queryFn: async () => {
			const response = await fetch(`/api/orders/${id}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch order: ${response.status}`);
			}

			return (await response.json()) as OrderTypeWithProducts;
		},
	});
}

export const useDeleteOrderMutation = (
	orderId: string,
	options?: {
		onSuccess?: () => void;
		onError?: () => void;
	},
) =>
	useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/orders/${orderId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error(`Failed to delete order: ${response.status}`);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			queryClient.invalidateQueries({ queryKey: ["ordersCount"] });
			queryClient.invalidateQueries({ queryKey: ["latestOrderId"] });
			queryClient.invalidateQueries({ queryKey: ["latestCfSequence"] });
			queryClient.invalidateQueries({ queryKey: ["latestNcfSequence"] });
			options?.onSuccess?.();
		},
		onError: () => {
			options?.onError?.();
		},
	});

export function useLatestOrderId() {
	return useQuery({
		queryKey: ["latestOrderId"],
		queryFn: async () => {
			const response = await fetch("/api/orders/latest-id");

			if (!response.ok) {
				throw new Error(`Failed to fetch latest order ID: ${response.status}`);
			}

			const { orderId } = await response.json();
			return orderId as number;
		},
	});
}

export function useLatestCfSequence() {
	return useQuery({
		queryKey: ["latestCfSequence"],
		queryFn: async () => {
			const response = await fetch("/api/orders/last-sequence?type=cf");

			if (!response.ok) {
				throw new Error(
					`Failed to fetch latest CF sequence: ${response.status}`,
				);
			}

			const { cfSequence } = await response.json();
			return cfSequence as number;
		},
	});
}

export function useLatestNcfSequence() {
	return useQuery({
		queryKey: ["latestNcfSequence"],
		queryFn: async () => {
			const response = await fetch("/api/orders/last-sequence?type=ncf");

			if (!response.ok) {
				throw new Error(
					`Failed to fetch latest NCF sequence: ${response.status}`,
				);
			}

			const { ncfSequence } = await response.json();
			return ncfSequence as number;
		},
	});
}

export const useCreateOrderMutation = (options?: {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (data: Partial<OrderType>) => {
			const response = await fetch("/api/orders", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || `Failed to create order: ${response.status}`,
				);
			}

			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["orders"] });
			queryClient.invalidateQueries({ queryKey: ["ordersCount"] });
			queryClient.invalidateQueries({ queryKey: ["latestOrderId"] });
			queryClient.invalidateQueries({ queryKey: ["latestCfSequence"] });
			queryClient.invalidateQueries({ queryKey: ["latestNcfSequence"] });
			options?.onSuccess?.();
		},
		onError: (error) => {
			console.error("Create order error:", error);
			options?.onError?.(error);
		},
	});
