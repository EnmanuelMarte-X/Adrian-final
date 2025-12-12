"use client";

import { useProducts } from "@/contexts/products/queries";
import { usePaginationState } from "@/hooks/use-pagination-state";
import { getPaginationRequestFromState, getTotalPages } from "@/lib/utils";
import { DataPagination } from "@/components/ui/data-pagination";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertCircleIcon, PackageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { currencyFormat } from "@/config/formats";
import type { ProductType } from "@/types/models/products";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ProductFilters } from "@/contexts/products/types";

const ProductCardSkeleton = () => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.3 }}
		className="group"
	>
		<Card className="h-full border-dashed border-2 pt-0 border-muted-foreground/20 bg-muted/20 overflow-hidden">
			<div className="relative h-48 overflow-hidden bg-muted/30 flex items-center justify-center" />

			<CardContent className="px-6">
				<div className="flex flex-col gap-4">
					<div className="space-y-2">
						<div className="h-6 bg-muted/40 rounded animate-pulse" />
						<div className="h-4 bg-muted/30 rounded w-2/3 animate-pulse" />
						<div className="h-4 bg-muted/30 rounded w-full animate-pulse" />
						<div className="h-4 bg-muted/30 rounded w-3/4 animate-pulse" />
					</div>

					<div className="h-4 bg-muted/30 rounded w-1/2 animate-pulse" />

					<div className="grid grid-cols-2 gap-6">
						<div className="space-y-1">
							<div className="h-6 bg-muted/40 rounded w-20 animate-pulse" />
							<div className="h-4 bg-muted/30 rounded w-16 animate-pulse" />
						</div>
						<div className="h-8 bg-muted/40 rounded self-end" />
					</div>
				</div>
			</CardContent>
		</Card>
	</motion.div>
);

const ProductPlaceholder = () => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.3 }}
		className="group"
	>
		<Card className="h-full border-dashed border-2 pt-0 border-muted-foreground/20 bg-muted/20 overflow-hidden">
			<div className="relative h-48 overflow-hidden bg-muted/30 flex items-center justify-center">
				<div className="text-center space-y-2 opacity-60">
					<PackageIcon className="h-12 w-12 mx-auto text-muted-foreground/50" />
					<p className="text-sm text-muted-foreground/70 font-medium">
						Próximamente
					</p>
				</div>
			</div>

			<CardContent className="px-6">
				<div className="flex flex-col gap-4">
					<div className="space-y-2">
						<div className="h-6 bg-muted/40 rounded" />
						<div className="h-4 bg-muted/30 rounded w-2/3" />
						<div className="h-4 bg-muted/30 rounded w-full" />
						<div className="h-4 bg-muted/30 rounded w-3/4" />
					</div>

					<div className="h-4 bg-muted/30 rounded w-1/2" />

					<div className="grid grid-cols-2 gap-6">
						<div className="space-y-1">
							<div className="h-6 bg-muted/40 rounded w-20" />
							<div className="h-4 bg-muted/30 rounded w-16" />
						</div>
						<div className="h-8 bg-muted/40 rounded self-end" />
					</div>
				</div>
			</CardContent>
		</Card>
	</motion.div>
);

const LandingProductCard = ({ product }: { product: ProductType }) => {
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
								{totalStock} en stock
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
							<div className="space-y-2">
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
								<PackageIcon className="h-4 w-4 text-primary" />
								<span className="font-medium">
									{product.capacity}{" "}
									{product.capacityUnit !== "count"
										? product.capacityUnit
										: "unidades"}
								</span>
							</div>

							<div className="grid grid-cols-2 gap-6">
								<div className="space-y-1">
									<p className="text-xl font-bold text-primary">
										{currencyFormat.format(product.retailPrice)}
									</p>
									<p className="text-sm text-muted-foreground">
										{currencyFormat.format(product.wholesalePrice)}
									</p>
								</div>
								<Button
									className="px-6 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 self-end cursor-pointer"
									size="sm"
								>
									Ver Más
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</Link>
		</motion.div>
	);
};

export function ProductsSection() {
	const [pagination, setPagination] = usePaginationState({ pageSize: 12 });

	const filters = { stock: 1 as const, inStore: true } as ProductFilters;

	const { data, isLoading, error } = useProducts({
		pagination: getPaginationRequestFromState(pagination),
		filters,
		sort: [{ field: "name", order: "asc" }],
	});

	const totalPages = getTotalPages(data?.total, pagination.pageSize);

	const handlePageChange = (pageIndex: number) => {
		setPagination((prev) => ({ ...prev, pageIndex }));
	};

	if (error) {
		return (
			<section className="py-16 px-4">
				<div className="relative container mx-auto max-w-7xl">
					<div className="absolute size-full z-20 bg-background/30 flex flex-col items-center justify-center gap-y-4 text-center">
						<AlertCircleIcon className="size-16 text-destructive" />
						<h2 className="text-3xl font-bold text-destructive-foreground">
							Error al cargar productos
						</h2>
						<p className="text-muted-foreground text-lg">
							No se pudo cargar la lista de productos. Por favor, vuelve a
							intentarlo más tarde o contacta al soporte si el problema
							persiste.
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 blur-xs">
						{Array.from({ length: 8 }, (_, index) => (
							<ProductPlaceholder key={`placeholder-${Date.now()}-${index}`} />
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="pt-20 pb-14 px-4">
			<div className="container mx-auto max-w-7xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="text-center mb-16"
				>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
						className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
					>
						<PackageIcon className="h-4 w-4" />
						Catálogo de Productos
					</motion.div>

					<h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
						Productos de Calidad Premium
					</h2>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
						Descubre nuestra exclusiva selección de productos de belleza para el cabello. Calidad garantizada, precios competitivos y disponibilidad inmediata.
					</p>
				</motion.div>

				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
						{Array.from({ length: 12 }, (_, index) => (
							<ProductCardSkeleton
								key={`product-skeleton-${Date.now()}-${index}`}
							/>
						))}
					</div>
				) : data?.products?.length ? (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2, staggerChildren: 0.1 }}
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
						>
							{data.products.map((product) => (
								<LandingProductCard key={product._id} product={product} />
							))}

							{data.products.length < 12 &&
								Array.from(
									{ length: 12 - data.products.length },
									(_, index) => (
										<ProductPlaceholder
											key={`placeholder-${Date.now()}-${index}`}
										/>
									),
								)}
						</motion.div>

						{totalPages > 1 && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 }}
								className="flex justify-center"
							>
								<DataPagination
									totalPages={totalPages}
									currentPage={pagination.pageIndex}
									onPageChange={handlePageChange}
								/>
							</motion.div>
						)}
					</>
				) : (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="text-center py-16"
					>
						<PackageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
						<h3 className="text-2xl font-semibold mb-2">
							No hay productos disponibles
						</h3>
						<p className="text-muted-foreground">
							Actualmente no tenemos productos en stock. ¡Vuelve pronto para ver
							nuevas ofertas!
						</p>
					</motion.div>
				)}
			</div>
		</section>
	);
}
