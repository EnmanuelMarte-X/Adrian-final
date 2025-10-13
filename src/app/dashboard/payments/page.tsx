"use client";

import { PaymentHistoryTable } from "@/components/dashboard/paymentHistory/PaymentHistoryTable";
import { useState, Suspense } from "react";
import type { SortingState } from "@tanstack/react-table";
import type { PaymentHistoryFilters } from "@/contexts/paymentHistory/types";
import { PaymentHistoryFilters as PaymentHistoryFiltersComponent } from "@/components/dashboard/paymentHistory/PaymentHistoryFilters";
import { CreatePaymentSheet } from "@/components/dashboard/paymentHistory/CreatePaymentSheet";
import { usePaginationState } from "@/hooks/use-pagination-state";
import { motion } from "motion/react";
import { Spinner } from "@/components/ui/spinner";

function CreditPageContent() {
	const [pagination, setPagination] = usePaginationState({
		pageSize: 20,
	});

	const [sorting, setSorting] = useState<SortingState>([
		{ id: "date", desc: true },
	]);

	const [filters, setFilters] = useState<PaymentHistoryFilters>({});

	const handleFiltersChange = (newFilters: PaymentHistoryFilters) => {
		setFilters(newFilters);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
		setSorting([{ id: "date", desc: true }]);
	};

	return (
		<motion.main
			className="flex-1 p-6"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4 }}
		>
			<motion.section
				className="flex sm:flex-nowrap flex-wrap sm:justify-between items-end gap-3 mb-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.2 }}
				>
					<PaymentHistoryFiltersComponent
						filters={filters}
						onFiltersChange={handleFiltersChange}
					/>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.3 }}
				>
					<CreatePaymentSheet />
				</motion.div>
			</motion.section>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
			>
				<PaymentHistoryTable
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

export default function CreditPage() {
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
			<CreditPageContent />
		</Suspense>
	);
}
