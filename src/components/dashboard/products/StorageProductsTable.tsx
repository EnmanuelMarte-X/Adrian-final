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
import { motion, AnimatePresence } from "motion/react";
import { useSidebar } from "@/components/ui/sidebar";
import { ProductCard } from "./ProductCard";
import { useWindowWidth } from "@/hooks/use-window-width";
import { cn } from "@/lib/utils";

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

	const { isMobile, state } = useSidebar();
	const windowWidth = useWindowWidth();

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
			setFilters((prevFilters) => {
				const newFiltersWithStorage = { ...newFilters, storageId };
				if (
					JSON.stringify(prevFilters) !== JSON.stringify(newFiltersWithStorage)
				) {
					setPagination((prev) => ({ ...prev, pageIndex: 0 }));
					return newFiltersWithStorage;
				}
				return prevFilters;
			});
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
					<motion.div
						className="font-medium"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.2 }}
					>
						{row.getValue("name")}
					</motion.div>
				),
				enableSorting: true,
			},
			{
				accessorKey: "brand",
				header: "Marca",
				cell: ({ row }) => (
					<motion.div
						className="text-sm"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.2 }}
					>
						{row.getValue("brand")}
					</motion.div>
				),
			},
			{
				accessorKey: "category",
				header: "Categoría",
				cell: ({ row }) => {
					const category = row.getValue("category") as string;
					return (
						<motion.div
							className="text-sm"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.2 }}
						>
							{category || "Sin categoría"}
						</motion.div>
					);
				},
			},
			{
				accessorKey: "capacity",
				header: "Capacidad",
				cell: ({ row }) => {
					const product = row.original;
					return (
						<motion.div
							className="text-sm"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.2 }}
						>
							{product.capacity} {product.capacityUnit}
						</motion.div>
					);
				},
			},
			{
				id: "storageStock",
				header: "Stock*",
				cell: ({ row }) => {
					const product = row.original;
					const storageStock =
						product.locations?.find((loc) => loc.storageId === storageId)
							?.stock || 0;
					return (
						<motion.div
							className="text-sm font-mono"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.2 }}
						>
							{storageStock}
						</motion.div>
					);
				},
			},
			{
				accessorKey: "retailPrice",
				header: "Precio Minorista",
				cell: ({ row }) => {
					const price = row.getValue("retailPrice") as number;
					return (
						<motion.div
							className="font-medium"
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.2 }}
						>
							{currencyFormat.format(price || 0)}
						</motion.div>
					);
				},
				enableSorting: true,
			},
			{
				accessorKey: "wholesalePrice",
				header: "Precio Mayorista",
				cell: ({ row }) => {
					const price = row.getValue("wholesalePrice") as number;
					return (
						<motion.div
							className="font-medium"
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.2 }}
						>
							{currencyFormat.format(price || 0)}
						</motion.div>
					);
				},
				enableSorting: true,
			},
			{
				accessorKey: "minimumStock",
				header: "Stock Mínimo",
				cell: ({ row }) => {
					const minimumStock = row.getValue("minimumStock") as number;
					return (
						<motion.div
							className="text-sm font-mono"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.2 }}
						>
							{minimumStock}
						</motion.div>
					);
				},
			},
			{
				id: "actions",
				header: "Acciones",
				cell: ({ row }) => {
					const product = row.original;
					return (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.2, delay: 0.1 }}
						>
							<ProductsActions product={product} />
						</motion.div>
					);
				},
			},
		],
		[storageId],
	);

	const isMinInnerWidth =
		isMobile ||
		(state === "expanded" && windowWidth < 1380) ||
		(state === "collapsed" && windowWidth < 1170);

	const data = productsData?.products || [];
	const totalRows = productsData?.total || 0;
	const totalPages = Math.ceil(totalRows / pagination.pageSize);

	return (
		<motion.div
			className="w-full space-y-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.1 }}
			>
				<ProductsFilters
					filters={filters}
					onFiltersChange={handleFiltersChange}
					setPage={(page: number) =>
						setPagination((prev) => ({ ...prev, pageIndex: page - 1 }))
					}
				/>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3, delay: 0.2 }}
				className={cn("rounded-lg w-full", {
					"border shadow-sm": !isMinInnerWidth,
					"flex flex-col space-y-4": isMinInnerWidth,
				})}
			>
				{isMinInnerWidth ? (
					<>
						{data && data.length > 0 ? (
							data.map((product) => (
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
						data={data}
						rowCount={totalRows}
						pagination={pagination}
						onPaginationChange={setPagination}
						sorting={sorting}
						onSortingChange={setSorting}
						enableSorting
						isLoading={isLoading}
					/>
				)}

				<AnimatePresence>
					<div
						className={cn("flex justify-between", {
							"px-4 bg-secondary h-12": !isMinInnerWidth,
						})}
					>
						<motion.div
							className="flex items-center justify-center text-xs text-muted-foreground"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.3 }}
						>
							Mostrando {productsData?.products?.length || 0} de {totalRows}{" "}
							productos en total.
						</motion.div>

						{totalPages > 1 && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.3, delay: 0.3 }}
							>
								<DataPagination
									totalPages={totalPages}
									currentPage={pagination.pageIndex + 1}
									onPageChange={handlePageChange}
								/>
							</motion.div>
						)}
					</div>
				</AnimatePresence>
			</motion.div>
		</motion.div>
	);
}
