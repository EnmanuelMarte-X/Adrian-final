"use client";

import type {
	ColumnDef,
	PaginationState,
	SortingState,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import type { Dispatch, SetStateAction } from "react";
import { DataPagination } from "@/components/ui/data-pagination";
import { currencyFormat, dateFormat } from "@/config/formats";
import { usePaymentHistory } from "@/contexts/paymentHistory/queries";
import type { PaymentHistoryFilters } from "@/contexts/paymentHistory/types";
import type {
	PaymentHistoryType,
	PaymentMethod,
} from "@/types/models/paymentHistory";
import { cn, getInitials, getTotalPages } from "@/lib/utils";
import { paymentMethods } from "@/contexts/paymentHistory/payment-method";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";
import { PaymentHistoryCard } from "./PaymentHistoryCard";
import {
	paymentMethodIcons,
	unknownPaymentMethod,
	unknownPaymentMethodIcon,
} from "@/config/orders";
import { BanknoteIcon } from "lucide-react";
import { PaymentHistoryActions } from "./PaymentHistoryActions";

const columns: ColumnDef<PaymentHistoryType>[] = [
	{
		accessorKey: "_id",
		header: "ID",
		cell: ({ row }) => {
			return (
				<span className="max-w-[12ch] overflow-hidden text-ellipsis whitespace-nowrap inline-block text-muted-foreground">
					{row.original._id}
				</span>
			);
		},
	},
	{
		accessorKey: "clientId",
		header: "Cliente",
		enableColumnFilter: true,
		enableSorting: false,
		cell: ({ row }) => {
			const client = row.original.clientId;

			if (typeof client === "string") {
				return (
					<div className="font-medium text-muted-foreground">ID: {client}</div>
				);
			}

			return (
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarFallback className="text-xs text-muted-foreground">
							{getInitials(client?.name)}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						{client?.name && client?.documentNumber ? (
							<>
								<Link
									href={`/dashboard/clients/${client?._id}`}
									className="font-medium text-primary hover:underline"
								>
									<div className="font-medium text-sm truncate max-w-[120px]">
										{client.name}
									</div>
								</Link>
								<div className="text-xs text-muted-foreground">
									{client.documentNumber}
								</div>
							</>
						) : client?.name ? (
							<Link
								href={`/dashboard/clients/${client?._id}`}
								className="font-medium text-primary hover:underline"
							>
								<div className="font-medium text-sm truncate max-w-[120px]">
									{client.name}
								</div>
							</Link>
						) : client?.documentNumber ? (
							<Link
								href={`/dashboard/clients/${client?._id}`}
								className="font-medium text-primary hover:underline"
							>
								<div className="text-xs text-muted-foreground">
									{client.documentNumber}
								</div>
							</Link>
						) : (
							<div className="font-medium text-sm text-muted-foreground">
								N/A
							</div>
						)}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "orderId",
		header: "Orden",
		enableColumnFilter: true,
		enableSorting: true,
		cell: ({ row }) => {
			const order = row.original.orderId;
			const orderId = typeof order === "string" ? order : order?.orderId;
			const orderObjectId = typeof order === "string" ? order : order?._id;

			return (
				<Link
					href={`/dashboard/orders/${orderObjectId || orderId}`}
					className="font-medium text-primary hover:underline"
				>
					#{orderId || orderObjectId}
				</Link>
			);
		},
	},
	{
		accessorKey: "date",
		header: "Fecha",
		enableColumnFilter: false,
		enableSorting: true,
		cell: ({ row }) => {
			return (
				<div className="font-medium text-foreground">
					{dateFormat(row.original.date)}
				</div>
			);
		},
	},
	{
		accessorKey: "amount",
		header: "Monto",
		enableColumnFilter: false,
		enableSorting: true,
		cell: ({ row }) => {
			return (
				<div className="font-medium text-foreground">
					{currencyFormat.format(row.original.amount)}
				</div>
			);
		},
	},
	{
		accessorKey: "paymentMethod",
		header: "Método Pago",
		enableSorting: false,
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-2">
					{paymentMethodIcons[row.original.method as PaymentMethod] ||
						unknownPaymentMethodIcon}{" "}
					{paymentMethods.find((m) => m.id === row.original.method)?.name ||
						unknownPaymentMethod}
				</div>
			);
		},
	},
	{
		accessorKey: "actions",
		header: undefined,
		enableSorting: false,
		cell: ({ row }) => {
			return <PaymentHistoryActions paymentHistory={row.original} />;
		},
	},
];

export function PaymentHistoryTable({
	pagination,
	setPagination,
	sorting,
	setSorting,
	filters,
}: {
	pagination: PaginationState;
	setPagination: Dispatch<SetStateAction<PaginationState>>;
	sorting: SortingState;
	setSorting: Dispatch<SetStateAction<SortingState>>;
	filters: PaymentHistoryFilters;
}) {
	const sortParams = sorting.map((sort) => ({
		field: sort.id,
		order: sort.desc ? "desc" : "asc",
	}));

	const { data, isLoading, isFetching } = usePaymentHistory({
		pagination: {
			page: pagination.pageIndex,
			limit: pagination.pageSize,
		},
		sort: sortParams,
		filters,
	});

	const totalPages = getTotalPages(data?.total, pagination.pageSize);
	const { isMobile, state } = useSidebar();
	const isMinInnerWidth =
		isMobile ||
		(state === "expanded" &&
			typeof window !== "undefined" &&
			window.innerWidth < 1380) ||
		(state === "collapsed" &&
			typeof window !== "undefined" &&
			window.innerWidth < 1170);

	const handlePageChange = (pageIndex: number) => {
		setPagination((prev) => ({ ...prev, pageIndex }));
	};

	return (
		<section
			className={cn("flex flex-col rounded-lg overflow-hidden max-w-full", {
				"border bg-card": !isMinInnerWidth,
				"space-y-4": isMinInnerWidth,
			})}
		>
			{isMinInnerWidth ? (
				<>
					{data?.payments && data.payments.length > 0 ? (
						data.payments.map((payment) => (
							<PaymentHistoryCard key={payment._id} payment={payment} />
						))
					) : (
						<div className="flex flex-col items-center justify-center gap-y-4 min-h-24 text-muted-foreground text-center">
							<BanknoteIcon className="size-9" />
							<p>No se encontraron pagos.</p>
						</div>
					)}
				</>
			) : (
				<DataTable
					columns={columns}
					data={data?.payments ?? []}
					rowCount={data?.total ?? 0}
					pagination={pagination}
					onPaginationChange={setPagination}
					sorting={sorting}
					onSortingChange={setSorting}
					enableSorting
					isLoading={isFetching}
				/>
			)}
			<div
				className={cn("flex items-center justify-between py-2", {
					"bg-secondary": !isMinInnerWidth,
					"px-4": !isMinInnerWidth,
				})}
			>
				{totalPages > 1 && !isMinInnerWidth && (
					<DataPagination
						totalPages={totalPages}
						currentPage={pagination.pageIndex}
						onPageChange={handlePageChange}
					/>
				)}
				<span
					className={cn("text-muted-foreground text-xs lg:text-nowrap", {
						"animate-pulse": isLoading || isFetching,
					})}
				>
					{`Mostrando ${data?.payments?.length ?? 0} pagos de ${data?.total ?? 0} totales.`}
				</span>
			</div>
		</section>
	);
}
