"use client";

import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { ProductsTable } from "./ProductsTable";
import { usePaginationState } from "@/hooks/use-pagination-state";
import { useScrollPosition } from "@/hooks/use-scroll-position";

export function LastProductsTable() {
	const scrollRef = useScrollPosition();
	const [pagination, setPagination] = usePaginationState();

	const [sorting, setSorting] = useState<SortingState>([
		{ id: "_id", desc: true },
	]);

	return (
		<div ref={scrollRef}>
			<ProductsTable
				filters={{}}
				pagination={pagination}
				setPagination={setPagination}
				sorting={sorting}
				setSorting={setSorting}
			/>
		</div>
	);
}
