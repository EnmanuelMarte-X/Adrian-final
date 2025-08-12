"use client";

import { useState, useMemo, useCallback } from "react";
import type {
	ColumnDef,
	SortingState,
	PaginationState,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/contexts/products/queries";
import { ProductsActions } from "./ProductsActions";
import type { ProductType } from "@/types/models/products";
import type { ProductFilters } from "@/contexts/products/types";
import { ProductsFilters } from "./ProductsFilters";
import { currencyFormat } from "@/config/formats";
import { DataTable } from "@/components/ui/data-table";
import { DataPagination } from "@/components/ui/data-pagination";

export function StorageProductsTable({
	storageId,
}: {
	storageId: string;
}) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [filters, setFilters] = useState<ProductFilters>({ storageId });
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 20,
	});

	const { data: productsData, isLoading } = useProducts({
		pagination: {
			page: pagination.pageIndex + 1,
			limit: pagination.pageSize,
		},
		sort: sorting.map((s) => ({
			field: s.id as "name" | "capacity" | "_id" | "brand" | "cost",
			order: s.desc ? "desc" : "asc",
		})),
		filters,
	});

	const handleFiltersChange = useCallback(
		(newFilters: ProductFilters) => {
			setFilters({ ...newFilters, storageId });
			// Reset to first page when filters change
			setPagination((prev) => ({ ...prev, pageIndex: 0 }));
		},
		[storageId],
	);

	const handlePageChange = useCallback((pageIndex: number) => {
		setPagination((prev) => ({ ...prev, pageIndex: pageIndex - 1 }));
	}, []);

	const columns = useMemo<ColumnDef<ProductType>[]>(
		() => [
			{
				accessorKey: "name",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="p-0 h-auto font-semibold"
						>
							Nombre
							<ArrowUpDown className="ml-2 size-4" />
						</Button>
					);
				},
				cell: ({ row }) => (
					<div className="font-medium">{row.getValue("name")}</div>
				),
				enableSorting: true,
			},
			{
				accessorKey: "brand",
				header: "Marca",
				cell: ({ row }) => (
					<div className="text-sm">{row.getValue("brand")}</div>
				),
			},
			{
				accessorKey: "category",
				header: "Categoría",
				cell: ({ row }) => {
					const category = row.getValue("category") as string;
					return <div className="text-sm">{category || "Sin categoría"}</div>;
				},
			},
			{
				accessorKey: "capacity",
				header: "Capacidad",
				cell: ({ row }) => {
					const product = row.original;
					return (
						<div className="text-sm">
							{product.capacity} {product.capacityUnit}
						</div>
					);
				},
			},
			{
				id: "storageStock",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="p-0 h-auto font-semibold"
						>
							Stock
							<ArrowUpDown className="ml-2 size-4" />
						</Button>
					);
				},
				cell: ({ row }) => {
					const product = row.original;
					const storageStock =
						product.locations?.find((loc) => loc.storageId === storageId)
							?.stock || 0;
					return <div className="text-sm font-mono">{storageStock}</div>;
				},
				enableSorting: true,
			},
			{
				accessorKey: "retailPrice",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="p-0 h-auto font-semibold"
						>
							Precio Retail
							<ArrowUpDown className="ml-2 size-4" />
						</Button>
					);
				},
				cell: ({ row }) => {
					const price = row.getValue("retailPrice") as number;
					return (
						<div className="font-medium">
							{currencyFormat.format(price || 0)}
						</div>
					);
				},
				enableSorting: true,
			},
			{
				accessorKey: "wholesalePrice",
				header: ({ column }) => {
					return (
						<Button
							variant="ghost"
							onClick={() =>
								column.toggleSorting(column.getIsSorted() === "asc")
							}
							className="p-0 h-auto font-semibold"
						>
							Precio Mayorista
							<ArrowUpDown className="ml-2 size-4" />
						</Button>
					);
				},
				cell: ({ row }) => {
					const price = row.getValue("wholesalePrice") as number;
					return (
						<div className="font-medium">
							{currencyFormat.format(price || 0)}
						</div>
					);
				},
				enableSorting: true,
			},
			{
				accessorKey: "minimumStock",
				header: "Stock Mínimo",
				cell: ({ row }) => {
					const minimumStock = row.getValue("minimumStock") as number;
					return <div className="text-sm font-mono">{minimumStock}</div>;
				},
			},
			{
				id: "actions",
				header: "Acciones",
				cell: ({ row }) => {
					const product = row.original;
					return <ProductsActions product={product} />;
				},
			},
		],
		[storageId],
	);

	const data = productsData?.products || [];
	const totalRows = productsData?.total || 0;
	const totalPages = Math.ceil(totalRows / pagination.pageSize);

	return (
		<div className="w-full space-y-4">
			<ProductsFilters
				filters={filters}
				onFiltersChange={handleFiltersChange}
				setPage={(page: number) =>
					setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
				}
			/>

			<DataTable
				columns={columns}
				data={data}
				isLoading={isLoading}
				rowCount={totalRows}
				pagination={pagination}
				onPaginationChange={setPagination}
				sorting={sorting}
				onSortingChange={setSorting}
				enableSorting={true}
			/>

			{totalPages > 1 && (
				<DataPagination
					totalPages={totalPages}
					currentPage={pagination.pageIndex + 1}
					onPageChange={handlePageChange}
				/>
			)}
		</div>
	);
}
