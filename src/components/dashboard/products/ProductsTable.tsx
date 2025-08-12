"use client";

import type {
	ColumnDef,
	PaginationState,
	SortingState,
} from "@tanstack/react-table";
import type {
	ProductType,
	ProductCapacityUnit,
	ProductStorageType,
} from "@/types/models/products";
import { DataTable } from "@/components/ui/data-table";
import { useProducts } from "@/contexts/products/queries";
import type { Dispatch, SetStateAction } from "react";
import { DataPagination } from "@/components/ui/data-pagination";
import { ProductsActions } from "./ProductsActions";
import { currencyFormat, dateFormat } from "@/config/formats";
import type { ProductFilters } from "@/contexts/products/types";
import { ProductCard } from "./ProductCard";
import { cn, getDateFromObjectId, getTotalPages } from "@/lib/utils";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
import { useWindowWidth } from "@/hooks/use-window-width";

const columns: ColumnDef<ProductType>[] = [
	{
		accessorKey: "name",
		header: "Nombre",
		enableColumnFilter: true,
		enableSorting: true,
		enableResizing: true,
		cell: ({ row }) => {
			return (
				<Link
					href={`/dashboard/products/${row.original._id}`}
					className="text-primary hover:underline"
					onClick={(e) => e.stopPropagation()}
				>
					{row.original.name}
				</Link>
			);
		},
	},
	{
		accessorKey: "brand",
		header: "Marca",
		enableColumnFilter: true,
		enableSorting: true,
	},
	{
		accessorKey: "category",
		header: "Categoría",
		enableColumnFilter: true,
		enableSorting: true,
	},
	{
		accessorKey: "cost",
		header: () => <div className="text-right w-full">Costo</div>,
		enableSorting: true,
		cell(row) {
			const amount = Number.parseFloat(String(row.cell.getValue()));
			return (
				<div className="text-right font-medium">
					{currencyFormat.format(amount)}
				</div>
			);
		},
	},
	{
		accessorKey: "capacity",
		header: () => <div className="text-right w-full">Capacidad</div>,
		enableSorting: true,
		cell(row) {
			return <div className="text-right">{row.cell.getValue() as string}</div>;
		},
	},
	{
		accessorKey: "capacityUnit",
		header: () => "Unidad",
		enableSorting: false,
		cell(row) {
			const unit = row.cell.getValue() as ProductCapacityUnit;

			if (unit === "count") {
				return (
					<div className="text-sm text-muted-foreground font-medium">
						Unidades
					</div>
				);
			}

			return (
				<div className="uppercase text-xs text-muted-foreground font-medium">
					{unit}
				</div>
			);
		},
	},
	{
		accessorKey: "stock",
		header: "Stock",
		enableColumnFilter: true,
		enableSorting: true,
		cell({ row }) {
			const totalStock = row.original.locations?.reduce(
				(sum: number, location: ProductStorageType) =>
					sum + (location.stock || 0),
				0,
			);
			return <div className="text-right">{totalStock}</div>;
		},
	},
	{
		accessorKey: "_id",
		header: "Fecha de creación",
		enableSorting: true,
		cell: ({ row }) => {
			return (
				<div className="font-medium">
					{dateFormat(getDateFromObjectId(row.original._id))}
				</div>
			);
		},
	},
	{
		accessorKey: "retailPrice",
		header: () => <div className="text-right w-full">Precio de venta</div>,
		enableSorting: true,
		cell(row) {
			const amount = Number.parseFloat(String(row.cell.getValue()));
			return (
				<div className="text-right font-medium">
					{currencyFormat.format(amount)}
				</div>
			);
		},
	},
	{
		accessorKey: "wholesalePrice",
		header: () => <div className="text-right w-full">Precio por mayor</div>,
		enableSorting: true,
		cell(row) {
			const amount = Number.parseFloat(String(row.cell.getValue()));
			const formatted = currencyFormat.format(amount);
			return <div className="text-right font-medium">{formatted}</div>;
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => <ProductsActions product={row.original} />,
	},
];

export function ProductsTable({
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
	filters: ProductFilters;
}) {
	const sortParams = sorting.map((sort) => ({
		field: sort.id,
		order: sort.desc ? "desc" : "asc",
	}));

	const { data, isFetching, isLoading } = useProducts({
		pagination: {
			page: pagination.pageIndex,
			limit: pagination.pageSize,
		},
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
					{data?.products && data.products.length > 0 ? (
						data.products.map((product) => (
							<ProductCard key={product._id} product={product} />
						))
					) : (
						<span className="text-muted-foreground text-center">
							No se encontraron productos.
						</span>
					)}
				</>
			) : (
				<DataTable
					columns={columns}
					data={data?.products ?? []}
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
				className={cn("flex items-center justify-between px-4 py-2", {
					"bg-secondary": !isMinInnerWidth,
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
					{`Mostrando ${data?.products?.length ?? 0} productos de ${data?.total ?? 0} totales.`}
				</span>
			</div>
		</section>
	);
}
