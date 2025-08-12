import { usePaginationState } from "@/hooks/use-pagination-state";
import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { OrdersTable } from "./OrdersTable";
import { useScrollPosition } from "@/hooks/use-scroll-position";

export function LastOrdersTable() {
	const scrollRef = useScrollPosition();
	const [pagination, setPagination] = usePaginationState();

	const [sorting, setSorting] = useState<SortingState>([
		{ id: "orderId", desc: true },
	]);

	return (
		<div ref={scrollRef}>
			<OrdersTable
				pagination={pagination}
				setPagination={setPagination}
				sorting={sorting}
				setSorting={setSorting}
				filters={{}}
			/>
		</div>
	);
}
