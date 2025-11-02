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
		header: ({ column }) => {
			return <span>Nombre</span>;
		},
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
		header: ({ column }) => {
			return <span>Marca</span>;
		},
		enableColumnFilter: true,
		enableSorting: true,
	},
	{
		accessorKey: "category",
		header: ({ column }) => {
			return <span>Categoría</span>;
		},
		cell: ({ row }) => {
			return (
				<div className="font-medium">{row.original.category || "Sin categoría"}</div>
			);
		},
		enableColumnFilter: true,
		enableSorting: true,
	},
	{
		accessorKey: "cost",
		header: ({ column }) => {
			return <span className="text-right w-full block">Costo</span>;
		},
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
		header: ({ column }) => {
			return <span className="text-center w-full block">Capacidad</span>;
		},
		enableSorting: true,
		cell(row) {
			return <div className="text-center font-medium">{row.cell.getValue() as string}</div>;
		},
	},
	{
		accessorKey: "capacityUnit",
		header: () => {
			return <span className="text-center w-full block">Unidad</span>;
		},
		enableSorting: false,
		cell(row) {
			const unit = row.cell.getValue() as ProductCapacityUnit;

			if (unit === "count") {
				return (
					<div className="text-center text-xs text-muted-foreground font-medium">
						UD
					</div>
				);
			}

			return (
				<div className="text-center uppercase text-xs text-muted-foreground font-medium">
					{unit}
				</div>
			);
		},
	},
	{
		accessorKey: "stock",
		header: ({ column }) => {
			return <span className="text-center w-full block">Stock</span>;
		},
		enableColumnFilter: true,
		enableSorting: true,
		cell({ row }) {
			const totalStock = row.original.locations?.reduce(
				(sum: number, location: ProductStorageType) =>
					sum + (location.stock || 0),
				0,
			);
			return <div className="text-center font-medium">{totalStock}</div>;
		},
	},
	{
		accessorKey: "_id",
		header: ({ column }) => {
			return <span className="text-center w-full block">Fecha de creación</span>;
		},
		enableSorting: true,
		cell: ({ row }) => {
			return (
				<div className="text-center font-medium text-sm">
					{dateFormat(getDateFromObjectId(row.original._id))}
				</div>
			);
		},
	},
	{
		accessorKey: "retailPrice",
		header: ({ column }) => {
			return <span className="text-right w-full block">Precio de venta</span>;
		},
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
		header: ({ column }) => {
			return <span className="text-right w-full block">Precio por mayor</span>;
		},
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
				{totalPages > 1 && (
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
