import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import type { PaymentHistoryFilters } from "./types";
import type { PaymentHistoryType } from "@/types/models/paymentHistory";
import { queryClient } from "@/lib/query";
import type { PaginationRequest } from "@/types/pagination";
import {
	isArrayEmpty,
	isObjectEmpty,
	parseSafeUrlWithParams,
} from "@/lib/utils";

export function usePaymentHistoryCount() {
	return useQuery({
		queryKey: ["paymentHistoryCount"],
		queryFn: async () => {
			const response = await fetch("/api/payment-history/count");

			if (!response.ok) {
				throw new Error(
					`Failed to fetch payment history count: ${response.status}`,
				);
			}

			const { count } = await response.json();
			return count ?? 0;
		},
	});
}

export function usePaymentHistory(
	{
		pagination,
		sort = [],
		filters = {},
	}: {
		pagination: PaginationRequest;
		sort?: { field: string; order: string }[];
		filters?: PaymentHistoryFilters;
	} = { pagination: { page: 1, limit: 10 } },
) {
	return useQuery({
		queryKey: [
			"paymentHistory",
			pagination.page,
			pagination.limit,
			sort,
			filters,
		],
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
				parseSafeUrlWithParams("/api/payment-history", params),
			);

			if (!response.ok && response.status !== 404) {
				throw new Error(`Failed to fetch payment history: ${response.status}`);
			}

			const { data, total } = await response.json();
			return {
				payments: data as PaymentHistoryType[],
				total: total as number,
			};
		},
		placeholderData: keepPreviousData,
	});
}

export const usePaymentHistoryById = (paymentId: string) =>
	useQuery({
		queryKey: ["paymentHistory", paymentId],
		queryFn: async () => {
			const response = await fetch(`/api/payment-history/${paymentId}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch payment: ${response.status}`);
			}

			const payment = await response.json();
			return payment as PaymentHistoryType;
		},
		enabled: !!paymentId,
	});

export const usePaymentHistoryByOrderId = (orderId: string) =>
	useQuery({
		queryKey: ["paymentHistory", "order", orderId],
		queryFn: async () => {
			const response = await fetch(`/api/payment-history/order/${orderId}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch order payments: ${response.status}`);
			}

			const payments = await response.json();
			return payments as PaymentHistoryType[];
		},
		enabled: !!orderId,
	});

export const usePaymentHistoryByClientId = (
	clientId: string,
	pagination?: PaginationRequest,
) =>
	useQuery({
		queryKey: ["paymentHistory", "client", clientId, pagination],
		queryFn: async () => {
			const params = new URLSearchParams();

			if (pagination?.page) params.set("page", pagination.page.toString());
			if (pagination?.limit) params.set("limit", pagination.limit.toString());

			const response = await fetch(
				parseSafeUrlWithParams(
					`/api/payment-history/client/${clientId}`,
					params,
				),
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch client payments: ${response.status}`);
			}

			const result = await response.json();

			if (pagination) {
				return {
					payments: result.data as PaymentHistoryType[],
					total: result.total as number,
				};
			}

			return result as PaymentHistoryType[];
		},
		enabled: !!clientId,
	});

export const useDeletePaymentHistoryMutation = (
	paymentId: string,
	options?: {
		onSuccess?: () => void;
		onError?: () => void;
	},
) =>
	useMutation({
		mutationFn: async () => {
			const response = await fetch(`/api/payment-history/${paymentId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error(`Failed to delete payment: ${response.status}`);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
			queryClient.invalidateQueries({ queryKey: ["paymentHistoryCount"] });
			options?.onSuccess?.();
		},
		onError: () => {
			options?.onError?.();
		},
	});

export const useUpdatePaymentHistoryMutation = (
	paymentId: string,
	options?: {
		onSuccess?: () => void;
		onError?: () => void;
	},
) =>
	useMutation({
		mutationFn: async (data: Partial<PaymentHistoryType>) => {
			const response = await fetch(`/api/payment-history/${paymentId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`Failed to update payment: ${response.status}`);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
			queryClient.invalidateQueries({ queryKey: ["paymentHistoryCount"] });
			options?.onSuccess?.();
		},
		onError: () => {
			options?.onError?.();
		},
	});

export const useCreatePaymentHistoryMutation = (options?: {
	onSuccess?: () => void;
	onError?: () => void;
}) =>
	useMutation({
		mutationFn: async (data: Partial<PaymentHistoryType>) => {
			const response = await fetch("/api/payment-history", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`Failed to create payment: ${response.status}`);
			}

			return await response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
			queryClient.invalidateQueries({ queryKey: ["paymentHistoryCount"] });
			options?.onSuccess?.();
		},
		onError: () => {
			options?.onError?.();
		},
	});

export const useDeletePaymentHistoryBatchMutation = (options?: {
	onSuccess?: () => void;
	onError?: () => void;
}) =>
	useMutation({
		mutationFn: async (ids: string[]) => {
			const response = await fetch("/api/payment-history/batch", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ids }),
			});

			if (!response.ok) {
				throw new Error(`Failed to delete payments: ${response.status}`);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["paymentHistory"] });
			queryClient.invalidateQueries({ queryKey: ["paymentHistoryCount"] });
			options?.onSuccess?.();
		},
		onError: () => {
			options?.onError?.();
		},
	});

export function usePaymentAnalytics(period = 12) {
	return useQuery({
		queryKey: ["paymentAnalytics", period],
		queryFn: async () => {
			const params = new URLSearchParams();
			params.set("period", period.toString());

			const response = await fetch(
				parseSafeUrlWithParams("/api/payment-history/analytics", params),
			);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch payment analytics: ${response.status}`,
				);
			}

			const result = await response.json();
			return result;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});
}
