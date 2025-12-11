"use client";

import { ClientsTable } from "@/components/dashboard/clients/ClientsTable";
import { useState, Suspense } from "react";
import type { SortingState } from "@tanstack/react-table";
import type { ClientFilters } from "@/contexts/clients/types";
import { ClientsFilters } from "@/components/dashboard/clients/ClientsFilters";
import { CreateClientSheet } from "@/components/dashboard/clients/CreateClientSheet";
import { useQueryPaginationState } from "@/hooks/use-pagination-state";
import { motion } from "framer-motion";

function ClientsPageContent() {
	const [pagination, setPagination] = useQueryPaginationState({
		pageSize: 25,
	});

	const [sorting, setSorting] = useState<SortingState>([
		{ id: "name", desc: true },
	]);

	const [filters, setFilters] = useState<ClientFilters>({});

	const handleFiltersChange = (newFilters: ClientFilters) => {
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
					<ClientsFilters
						filters={filters}
						onFiltersChange={handleFiltersChange}
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.3 }}
				>
					<CreateClientSheet />
				</motion.div>
			</motion.section>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
			>
				<ClientsTable
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

export default function ClientsPage() {
	return (
		<Suspense fallback={
			<motion.main
				className="flex-1 p-6"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4 }}
			>
				<div className="flex items-center justify-center h-64">
					<div className="text-lg text-muted-foreground">Cargando clientes...</div>
				</div>
			</motion.main>
		}>
			<ClientsPageContent />
		</Suspense>
	);
}
