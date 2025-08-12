"use client";

import { CreateOrderSheet } from "@/components/dashboard/orders/CreateOrderSheet";
import { OrdersFilters } from "@/components/dashboard/orders/OrdersFilters";
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import type { OrderFilters } from "@/contexts/orders/types";
import { usePaginationState } from "@/hooks/use-pagination-state";
import type { SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function OrdersPage() {
	const [pagination, setPagination] = usePaginationState({
		pageSize: 25,
	});

	const [sorting, setSorting] = useState<SortingState>([
		{ id: "_id", desc: true },
	]);

	const [filters, setFilters] = useState<OrderFilters>({});

	const handleFiltersChange = (newFilters: OrderFilters) => {
		setFilters(newFilters);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: We don't want to re-run this effect when filters change.
	useEffect(() => {
		if (filters) {
			setFilters(filters);
		}
	}, [filters, setFilters]);

	return (
		<motion.main
			className="flex-1 p-6"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4 }}
		>
			<motion.section
				className="flex sm:flex-nowrap flex-wrap justify-between items-end gap-3 mb-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.2 }}
				>
					<OrdersFilters
						filters={filters}
						onFiltersChange={handleFiltersChange}
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.3 }}
				>
					<CreateOrderSheet />
				</motion.div>
			</motion.section>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
			>
				<OrdersTable
					pagination={pagination}
					setPagination={setPagination}
					sorting={sorting}
					setSorting={setSorting}
					filters={filters}
				/>
			</motion.div>
		</motion.main>
	);
}
