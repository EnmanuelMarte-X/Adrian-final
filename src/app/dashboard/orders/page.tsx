"use client";

import { CreateOrderSheet } from "@/components/dashboard/orders/CreateOrderSheet";
import { OrdersFilters } from "@/components/dashboard/orders/OrdersFilters";
import { OrdersTable } from "@/components/dashboard/orders/OrdersTable";
import type { OrderFilters } from "@/contexts/orders/types";
import { usePaginationState } from "@/hooks/use-pagination-state";
import type { SortingState } from "@tanstack/react-table";
import { useState, Suspense } from "react";
import { motion } from "motion/react";
import { Spinner } from "@/components/ui/spinner";

function OrdersPageContent() {
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

export default function OrdersPage() {
	return (
		<Suspense fallback={
			<motion.main
				className="flex-1 p-6"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4 }}
			>
				<div className="flex items-center justify-center h-64">
					<Spinner className="size-8 text-primary" />
				</div>
			</motion.main>
		}>
			<OrdersPageContent />
		</Suspense>
	);
}
