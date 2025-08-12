import type { PaginationState } from "@tanstack/react-table";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";

export const useQueryPaginationState = (
	initialState?: Partial<PaginationState>,
) => {
	const [page, setPage] = useQueryState(
		"page",
		parseAsInteger.withDefault(initialState?.pageIndex ?? 0),
	);
	const [pageSize, setPageSize] = useQueryState(
		"pageSize",
		parseAsInteger.withDefault(initialState?.pageSize ?? 10),
	);

	const handleChangePagination = (
		state: PaginationState | ((prev: PaginationState) => PaginationState),
	) => {
		if (typeof state === "function") {
			const newState = state({ pageIndex: page, pageSize });
			setPage(newState.pageIndex);
			setPageSize(newState.pageSize);
		} else {
			setPage(state.pageIndex);
			setPageSize(state.pageSize);
		}
	};

	return [
		{ pageIndex: page, pageSize } as PaginationState,
		handleChangePagination,
	] as const;
};

export const usePaginationState = (initialState?: Partial<PaginationState>) => {
	const [state, setState] = useState<PaginationState>({
		pageIndex: initialState?.pageIndex ?? 1,
		pageSize: initialState?.pageSize ?? 10,
	});

	return [state, setState] as const;
};
