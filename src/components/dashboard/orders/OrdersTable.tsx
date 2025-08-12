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
import { useOrders } from "@/contexts/orders/queries";
import { OrdersActions } from "./OrdersActions";
import type { OrderFilters } from "@/contexts/orders/types";
import { OrderCard } from "./OrderCard";
import type { OrderType } from "@/types/models/orders";

import { cn, getInitials, getTotalPages } from "@/lib/utils";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useSidebar } from "@/components/ui/sidebar";
import { useWindowWidth } from "@/hooks/use-window-width";
import { BanknoteIcon, CoinsIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { TAX_PERCENTAGE } from "@/config/shop";

const columns: ColumnDef<OrderType>[] = [
	{
		accessorKey: "orderId",
		header: "# ID",
		enableColumnFilter: true,
		enableSorting: true,
		cell: ({ row }) => {
			return (
				<Link
					href={`/dashboard/orders/${row.original._id}`}
					className="font-medium text-primary w-[15ch] truncate"
				>
					{row.original.orderId}
				</Link>
			);
		},
	},
	{
		accessorKey: "buyerId",
		header: "Cliente",
		enableColumnFilter: true,
		enableSorting: false,
		cell: ({ row }) => {
			const buyer = row.original.buyerId;

			if (typeof buyer === "string") {
				return (
					<div className="font-medium text-muted-foreground">ID: {buyer}</div>
				);
			}

			return (
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarFallback className="text-xs text-muted-foreground">
							{getInitials(buyer?.name)}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						{buyer?.name && buyer?.documentNumber ? (
							<>
								<Link
									href={`/dashboard/clients/${buyer?._id}`}
									className="font-medium text-primary hover:underline"
								>
									<div className="font-medium text-sm truncate max-w-[120px]">
										{buyer.name}
									</div>
								</Link>
								<div className="text-xs text-muted-foreground">
									{buyer.documentNumber}
								</div>
							</>
						) : buyer?.name ? (
							<Link
								href={`/dashboard/clients/${buyer?._id}`}
								className="font-medium text-primary hover:underline"
							>
								<div className="font-medium text-sm truncate max-w-[120px]">
									{buyer.name}
								</div>
							</Link>
						) : buyer?.documentNumber ? (
							<Link
								href={`/dashboard/clients/${buyer?._id}`}
								className="font-medium text-primary hover:underline"
							>
								<div className="text-xs text-muted-foreground">
									{buyer.documentNumber}
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
		accessorKey: "date",
		header: "Fecha de emisión",
		enableSorting: true,
		cell: ({ row }) => {
			return (
				<div className="font-medium">
					{row.original.date
						? dateFormat(new Date(row.original.date))
						: "Fecha no disponible"}
				</div>
			);
		},
	},
	{
		accessorKey: "products",
		header() {
			return <div className="w-full text-right">Productos</div>;
		},
		enableSorting: false,
		cell: ({ row }) => {
			return (
				<div className="font-medium text-right">
					{row.original.products?.length}
				</div>
			);
		},
	},
	{
		accessorKey: "total",
		header: () => <div className="text-right w-full">Total</div>,
		enableSorting: true,
		cell: ({ row }) => {
			const order = row.original;
			const subtotal =
				order?.products?.reduce((total, product) => {
					return total + product.price * product.quantity;
				}, 0) ?? 0;
			const totalDiscount =
				order?.products?.reduce((totalDiscount, product) => {
					return totalDiscount + (product.discount || 0);
				}, 0) ?? 0;
			const tax = subtotal * TAX_PERCENTAGE;
			const total = subtotal - totalDiscount + tax;

			return (
				<div className="text-right font-medium">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								{row.original.isCredit ? (
									<CoinsIcon className="size-4 inline mr-1 dark:text-success-foreground" />
								) : (
									<BanknoteIcon className="size-4 inline mr-1 dark:text-success-foreground" />
								)}
							</TooltipTrigger>
							<TooltipContent>
								<p>{row.original.isCredit ? "Crédito" : "Contado"}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					{currencyFormat.format(total)}
				</div>
			);
		},
	},
	{
		accessorKey: "sellerId",
		header: "Vendedor",
		enableSorting: false,
		cell: ({ row }) => {
			const user = row.original.sellerId;

			if (typeof user === "string") {
				return (
					<div className="font-medium text-muted-foreground">ID: {user}</div>
				);
			}

			const name = `${user?.firstName} ${user?.lastName}`;

			return (
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarFallback className="text-xs text-muted-foreground">
							{getInitials(name)}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						{name || user?.email ? (
							<>
								{name && (
									<div className="font-medium text-sm truncate max-w-[120px]">
										{name}
									</div>
								)}
								{user?.email && (
									<div className="text-xs text-muted-foreground">
										{user.email}
									</div>
								)}
							</>
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
		id: "actions",
		enableHiding: false,
		enableResizing: false,
		cell: ({ row }) => <OrdersActions order={row.original} />,
	},
];

export function OrdersTable({
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
	filters: OrderFilters;
}) {
	const sortParams = sorting.map((sort) => ({
		field: sort.id,
		order: sort.desc ? "desc" : "asc",
	}));

	const { data, isLoading, isFetching } = useOrders({
		page: pagination.pageIndex,
		limit: pagination.pageSize,
		sort: sortParams,
		filters,
	});

	const totalPages = getTotalPages(data?.total, pagination.pageSize);
	const { isMobile, state } = useSidebar();
	const windowWidth = useWindowWidth();
	const isMinInnerWidth =
		isMobile ||
		(state === "expanded" && windowWidth < 1380) ||
		(state === "collapsed" && windowWidth < 1170);

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
					{data?.orders && data.orders.length > 0 ? (
						data.orders.map((product) => (
							<OrderCard key={product.orderId} order={product} />
						))
					) : (
						<div className="flex flex-col items-center justify-center gap-y-4 min-h-24 text-muted-foreground text-center">
							<ShoppingCartIcon className="size-9" />
							<p>No se encontraron órdenes.</p>
						</div>
					)}
				</>
			) : (
				<DataTable
					columns={columns}
					data={data?.orders ?? []}
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
					{`Mostrando ${data?.orders?.length ?? 0} órdenes de ${data?.total ?? 0} totales.`}
				</span>
			</div>
		</section>
	);
}
