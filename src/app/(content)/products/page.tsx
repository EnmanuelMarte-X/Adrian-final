"use client";

import { useState } from "react";
import { useProducts } from "@/contexts/products/queries";
import { usePaginationState } from "@/hooks/use-pagination-state";
import { getPaginationRequestFromState, getTotalPages } from "@/lib/utils";
import { DataPagination } from "@/components/ui/data-pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { motion } from "motion/react";
import {
	PackageIcon,
	SearchIcon,
	FilterIcon,
	GridIcon,
	BuildingIcon,
} from "lucide-react";
import { currencyFormat } from "@/config/formats";
import type { ProductType } from "@/types/models/products";
import type { ProductFilters } from "@/contexts/products/types";
import Link from "next/link";
import { PriceRangeFilter } from "@/components/dashboard/products/filters/PriceRangeFilter";
import { capacityUnitLabels } from "@/config/products";

const ProductCard = ({ product }: { product: ProductType }) => {
	const totalStock =
		product.locations?.reduce((acc, loc) => acc + (loc.stock || 0), 0) ?? 0;
	const isLowStock = totalStock <= product.minimumStock;
	const primaryImage = product.images?.[0]?.url || "/placeholder-product.svg";

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			whileHover={{ y: -8, scale: 1.02 }}
			className="group cursor-pointer"
		>
			<Link href={`/products/${product._id}`}>
				<Card className="h-full hover:shadow-2xl pt-0 transition-all duration-500 shadow-lg group-hover:shadow-2xl overflow-hidden bg-gradient-to-br from-background to-muted/30 rounded-md border">
					<div className="relative h-48 overflow-hidden bg-gradient-to-br from-muted/50 to-muted">
						<img
							src={primaryImage}
							alt={product.name}
							className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
							onError={(e) => {
								(e.target as HTMLImageElement).src = "/placeholder-product.svg";
							}}
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

						<div className="absolute top-3 right-3">
							<Badge
								variant={isLowStock ? "destructive" : "secondary"}
								className="shadow-md backdrop-blur-sm"
							>
								{product.locations.reduce(
									(acc, loc) => (loc.showInStore ? acc + loc.stock : acc),
									0,
								)}{" "}
								en stock
							</Badge>
						</div>

						<div className="absolute top-3 left-3">
							<Badge
								variant="outline"
								className="bg-background/80 backdrop-blur-sm"
							>
								{product.category}
							</Badge>
						</div>
					</div>

					<CardContent className="px-6">
						<div className="flex flex-col gap-4">
							<div className="space-y-1">
								<h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
									{product.name}
								</h3>
								<p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
									{product.brand}
								</p>
								<p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
									{product.description}
								</p>
							</div>

							<div className="flex items-center gap-2 text-sm">
								<PackageIcon className="size-4 text-primary" />
								<span className="font-medium">
									{product.capacity} {capacityUnitLabels[product.capacityUnit]}
								</span>
							</div>

							<div className="grid grid-cols-2 gap-6">
								<div className="space-y-1">
									<p className="text-xl font-bold text-primary">
										{currencyFormat.format(product.retailPrice)}
									</p>
									<p className="inline-flex gap-x-1 items-center text-sm text-muted-foreground">
										<BuildingIcon className="size-3 text-muted-foreground" />
										{currencyFormat.format(product.wholesalePrice)}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</Link>
		</motion.div>
	);
};

export default function ProductsPage() {
	const [pagination, setPagination] = usePaginationState({ pageSize: 16 });
	const [filters, setFilters] = useState<ProductFilters>({ stock: 1 });
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
	const [showFilters, setShowFilters] = useState(false);

	const { data, isLoading, error } = useProducts({
		pagination: getPaginationRequestFromState(pagination),
		filters: {
			...filters,
			inStore: true,
			cost: priceRange,
		},
		sort: [{ field: "name", order: "asc" }],
	});

	const totalPages = getTotalPages(data?.total, pagination.pageSize);

	const handlePageChange = (pageIndex: number) => {
		setPagination((prev) => ({ ...prev, pageIndex }));
	};

	const handleFilterChange = (
		key: keyof ProductFilters,
		value: string | number | undefined,
	) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	};

	const handlePriceRangeChange = (value: number[]) => {
		setPriceRange([value[0], value[1]] as [number, number]);
	};

	const clearFilters = () => {
		setFilters({ stock: 1 });
		setPriceRange([0, 1000]);
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	};

	return (
		<div className="min-h-screen">
			<section className="relative py-12">
				<div className="absolute inset-0">
					<div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full transform translate-x-20 -translate-y-20" />
					<div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full transform -translate-x-16 translate-y-16" />
					<div className="absolute top-1/3 right-1/4 w-20 h-20 bg-brand/20 transform rotate-45" />
					<div className="absolute bottom-1/3 left-1/4 w-12 h-12 bg-brand/20 transform rotate-12" />
				</div>

				<div className="container mx-auto max-w-7xl px-4 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center text-foreground"
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
							className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 text-primary rounded-full mb-4 backdrop-blur-sm"
						>
							<PackageIcon className="h-8 w-8" />
						</motion.div>

						<h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
							Catálogo de Productos
						</h1>
						<p className="text-base md:text-lg text-foreground/90 max-w-xl mx-auto leading-relaxed">
							Explora nuestra completa selección de productos de belleza premium
						</p>
					</motion.div>
				</div>
			</section>

			<section className="py-8">
				<div className="container mx-auto max-w-7xl px-4">
					<div className="mb-8">
						<div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
							<div className="flex items-center gap-3 flex-1">
								<div className="relative flex-1 max-w-sm">
									<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Buscar productos"
										value={filters.name || ""}
										onChange={(e) =>
											handleFilterChange("name", e.target.value || undefined)
										}
										className="pl-10"
									/>
								</div>

								<div className="relative flex-1 max-w-xs lg:block hidden">
									<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										placeholder="Buscar marca"
										value={filters.brand || ""}
										onChange={(e) =>
											handleFilterChange("brand", e.target.value || undefined)
										}
										className="pl-10"
									/>
								</div>

								<div className="relative flex-1 max-w-xs lg:block hidden">
									<PriceRangeFilter
										initialRange={priceRange}
										label="Rango de precio"
										onRangeChange={handlePriceRangeChange}
									/>
								</div>

								<Button
									variant="outline"
									onClick={() => setShowFilters(!showFilters)}
									className="lg:hidden"
								>
									<FilterIcon className="h-4 w-4 mr-2" />
									Filtros
								</Button>
							</div>

							{data?.total !== undefined && (
								<p className="text-sm text-muted-foreground">
									{data.total} productos encontrados
								</p>
							)}
						</div>

						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{
								opacity: showFilters ? 1 : 0,
								height: showFilters ? "auto" : 0,
							}}
							className={`overflow-hidden ${showFilters ? "lg:block" : "hidden lg:block"}`}
						>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 p-4 bg-muted/30 rounded-lg">
								<div>
									<label
										htmlFor="brand-filter"
										className="text-sm font-medium mb-2 block"
									>
										Marca
									</label>
									<Input
										id="brand-filter"
										placeholder="Filtrar por marca"
										value={filters.brand || ""}
										onChange={(e) =>
											handleFilterChange("brand", e.target.value || undefined)
										}
									/>
								</div>

								<div>
									<label
										htmlFor="category-filter"
										className="text-sm font-medium mb-2 block"
									>
										Categoría
									</label>
									<Input
										id="category-filter"
										placeholder="Filtrar por categoría"
										value={filters.category || ""}
										onChange={(e) =>
											handleFilterChange(
												"category",
												e.target.value || undefined,
											)
										}
									/>
								</div>

								<div>
									<label
										htmlFor="capacity-filter"
										className="text-sm font-medium mb-2 block"
									>
										Capacidad
									</label>
									<Input
										id="capacity-filter"
										type="number"
										placeholder="Capacidad mínima"
										value={filters.capacity || ""}
										onChange={(e) =>
											handleFilterChange(
												"capacity",
												e.target.value ? Number(e.target.value) : undefined,
											)
										}
									/>
								</div>

								<div>
									<div className="text-sm font-medium mb-2 block">
										Rango de precio: {currencyFormat.format(priceRange[0])} -{" "}
										{currencyFormat.format(priceRange[1])}
									</div>
									<Slider
										value={priceRange}
										onValueChange={handlePriceRangeChange}
										max={1000}
										min={0}
										step={10}
										className="mt-2"
									/>
								</div>
							</div>

							<div className="mt-4 flex justify-end">
								<Button variant="ghost" onClick={clearFilters} size="sm">
									Limpiar filtros
								</Button>
							</div>
						</motion.div>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{Array.from({ length: 12 }, (_, index) => (
								<Card key={`skeleton-${Date.now()}-${index}`} className="h-80">
									<div className="animate-pulse">
										<div className="h-48 bg-muted" />
										<div className="p-4 space-y-3">
											<div className="h-4 bg-muted rounded w-3/4" />
											<div className="h-3 bg-muted rounded w-1/2" />
											<div className="h-4 bg-muted rounded w-1/4" />
										</div>
									</div>
								</Card>
							))}
						</div>
					) : error ? (
						<div className="text-center py-16">
							<h3 className="text-xl font-semibold text-destructive mb-2">
								Error al cargar productos
							</h3>
							<p className="text-muted-foreground">
								Intenta recargar la página
							</p>
						</div>
					) : data?.products.length ? (
						<>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
							>
								{data.products.map((product) => (
									<ProductCard key={product._id} product={product} />
								))}
							</motion.div>

							{totalPages > 1 && (
								<div className="flex justify-center">
									<DataPagination
										totalPages={totalPages}
										currentPage={pagination.pageIndex}
										onPageChange={handlePageChange}
									/>
								</div>
							)}
						</>
					) : (
						<div className="text-center py-16">
							<GridIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-xl font-semibold mb-2">
								No se encontraron productos
							</h3>
							<p className="text-muted-foreground">
								Intenta ajustar los filtros de búsqueda
							</p>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
