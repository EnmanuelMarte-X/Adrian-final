import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { OrderType } from "@/types/models/orders";
import {
	getSafePaginationRequest,
	isValidObjectId,
	parseSafeUrlWithParams,
} from "@/lib/utils";
import type { OrderFilters } from "./types";

export function useOrdersForSelect({
	search,
	page = 1,
	limit = 20,
	_filters,
}: {
	search?: string;
	page?: number;
	limit?: number;
	_filters?: OrderFilters;
} = {}) {
	const safePagination = getSafePaginationRequest({ page, limit });

	return useQuery({
		queryKey: [
			"ordersForSelect",
			search,
			safePagination.page,
			safePagination.limit,
			_filters,
		],
		placeholderData: keepPreviousData,
		refetchOnWindowFocus: false,
		queryFn: async () => {
			const params = new URLSearchParams();
			params.set("page", safePagination.page.toString());
			params.set("limit", safePagination.limit.toString());

			const filters: Record<string, string | number> = {};

			if (search?.trim()) {
				const trimmedSearch = search.trim();

				if (isValidObjectId(trimmedSearch)) {
					filters.orderId = trimmedSearch;
				}
			}

			if (_filters?.buyerId) {
				if (isValidObjectId(_filters.buyerId)) {
					filters.buyerId = _filters.buyerId;
				}
			}

			if (Object.keys(filters).length > 0) {
				params.set("filters", JSON.stringify(filters));
			}

			console.log("Fetching orders with params:", params.toString());

			const response = await fetch(
				parseSafeUrlWithParams("/api/orders", params),
			);

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
