"use client";

import { ProductsTable } from "@/components/dashboard/products/ProductsTable";
import { useState, Suspense } from "react";
import type { SortingState } from "@tanstack/react-table";
import type { ProductFilters } from "@/contexts/products/types";
import { ProductsFilters } from "@/components/dashboard/products/ProductsFilters";
import { CreateProductSheet } from "@/components/dashboard/products/CreateProductSheet";
import { useQueryPaginationState } from "@/hooks/use-pagination-state";
import { motion } from "motion/react";
import { Spinner } from "@/components/ui/spinner";

function ProductsPageContent() {
	const [pagination, setPagination] = useQueryPaginationState({
		pageSize: 25,
	});

	const [sorting, setSorting] = useState<SortingState>([
		{ id: "_id", desc: true },
	]);

	const [filters, setFilters] = useState<ProductFilters>({});

	const handleFiltersChange = (newFilters: ProductFilters) => {
		setFilters(newFilters);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
		setSorting([{ id: "_id", desc: true }]);
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
					<ProductsFilters
						filters={filters}
						onFiltersChange={handleFiltersChange}
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.3 }}
				>
					<CreateProductSheet />
				</motion.div>
			</motion.section>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
			>
				<ProductsTable
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

export default function ProductsPage() {
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
			<ProductsPageContent />
		</Suspense>
	);
}
