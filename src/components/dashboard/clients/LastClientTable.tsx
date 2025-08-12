"use client";

import type { SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { usePaginationState } from "@/hooks/use-pagination-state";
import { useScrollPosition } from "@/hooks/use-scroll-position";
import { ClientsTable } from "./ClientsTable";

export function LastClientsTable() {
	const scrollRef = useScrollPosition();
	const [pagination, setPagination] = usePaginationState();

	const [sorting, setSorting] = useState<SortingState>([
		{ id: "_id", desc: true },
	]);

	return (
		<div ref={scrollRef}>
			<ClientsTable
				filters={{}}
				pagination={pagination}
				setPagination={setPagination}
				sorting={sorting}
				setSorting={setSorting}
			/>
		</div>
	);
}
