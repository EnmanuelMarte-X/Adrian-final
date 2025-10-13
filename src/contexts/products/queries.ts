import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import type { ProductFilters } from "./types";
import type { ProductType } from "@/types/models/products";
import { queryClient } from "@/lib/query";
import type { PaginationRequest } from "@/types/pagination";
import {
	isArrayEmpty,
	isObjectEmpty,
	parseSafeUrlWithParams,
} from "@/lib/utils";

export function useProductsCount() {
	return useQuery({
		queryKey: ["productsCount"],
		queryFn: async () => {
			const response = await fetch("/api/products/count");

			if (!response.ok) {
				throw new Error(`Failed to fetch products count: ${response.status}`);
			}

			const { count } = await response.json();
			return count ?? 0;
		},
	});
}

export function useProducts(
	{
		pagination,
		sort = [],
		filters = {},
	}: {
		pagination: PaginationRequest;
		sort?: { field: string; order: string }[];
		filters?: ProductFilters;
	} = { pagination: { page: 1, limit: 10 } },
) {
	return useQuery({
		queryKey: ["products", pagination.page, pagination.limit, sort, filters],
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
				parseSafeUrlWithParams("/api/products", params),
			);

			if (!response.ok) {
				if (response.status === 404) {
					return { products: [], total: 0 };
				}

				throw new Error(`Failed to fetch products: ${response.status}`);
			}

			const { data, total } = await response.json();
			return {
				products: data as ProductType[],
				total: total as number,
			};
		},
		placeholderData: keepPreviousData,
	});
}

export const useProduct = (
	productId: string | undefined,
	params?: { enabled: boolean },
	filters?: ProductFilters,
) =>
	useQuery({
		queryKey: ["products", productId, filters],
		queryFn: async () => {
			if (!productId) throw new Error("Product ID is required");

			const params = new URLSearchParams();
			if (!isObjectEmpty(filters)) {
				params.set("filters", JSON.stringify(filters));
			}

			const response = await fetch(
				parseSafeUrlWithParams(`/api/products/${productId}`, params),
			);

			if (!response.ok) {
				if (response.status === 404) {
					return null;
				}

				throw new Error(`Failed to fetch product: ${response.status}`);
			}

			const product = await response.json();
			return product as ProductType;
		},
		enabled: !!productId || params?.enabled,
	});

export const useDeleteProductMutation = (
	productId: string,
	options?: {
		onSuccess?: () => void;
		onError?: () => void;
	},
) =>
	useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/products/${productId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error(`Failed to delete product: ${response.status}`);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			queryClient.invalidateQueries({ queryKey: ["productsCount"] });
			options?.onSuccess?.();
		},
		onError: () => {
			options?.onError?.();
		},
	});

export const useUpdateProductMutation = (
	productId?: string,
	options?: {
		onSuccess?: () => void;
		onError?: () => void;
	},
) =>
	useMutation({
		mutationFn: async (data: Partial<ProductType>) => {
			if (!productId) throw new Error("Product ID is required");
			const response = await fetch(`/api/products/${productId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`Failed to update product: ${response.status}`);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			queryClient.invalidateQueries({ queryKey: ["productsCount"] });
			options?.onSuccess?.();
		},
		onError: () => {
			options?.onError?.();
		},
	});

export const useCreateProductMutation = (options?: {
	onSuccess?: () => void;
	onError?: () => void;
}) =>
	useMutation({
		mutationFn: async (data: Partial<ProductType>) => {
			const response = await fetch("/api/products", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				// Try to parse response body to provide a better error message
				let parsed: Record<string, unknown> | null = null;
				try {
					parsed = await response.json();
				} catch (_) {
					// ignore parse errors
				}

				let serverMessage: string | undefined;
				if (parsed && typeof parsed === "object") {
					const err = parsed.error as Record<string, unknown> | undefined;
					if (err && typeof err === "object") {
						const m = err.message;
						if (typeof m === "string") serverMessage = m;
					}

					if (!serverMessage) {
						const m = parsed.message;
						if (typeof m === "string") serverMessage = m;
					}
				}

				const message = serverMessage || `Failed to create product: ${response.status}`;
				throw new Error(message);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["products"] });
			queryClient.invalidateQueries({ queryKey: ["productsCount"] });
			options?.onSuccess?.();
		},
		onError: () => {
			options?.onError?.();
		},
	});
