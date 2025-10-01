"use client";

import { use } from "react";
import { useProduct } from "@/contexts/products/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import {
	ArrowLeftIcon,
	PackageIcon,
	TagIcon,
	ShoppingCartIcon,
	TruckIcon,
	ShieldCheckIcon,
	InfoIcon,
} from "lucide-react";
import { currencyFormat } from "@/config/formats";
import type { ProductType } from "@/types/models/products";
import Link from "next/link";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductPageProps {
	params: Promise<{ id: string }>;
}

const ProductImageGallery = ({ product }: { product: ProductType }) => {
	const images =
		product.images && product.images.length > 0
			? product.images
			: [{ url: "/placeholder-product.svg", alt: product.name }];

	if (images.length === 1) {
		return (
			<div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
				<img
					src={images[0].url}
					alt={images[0].alt}
					className="w-full h-full object-cover"
					onError={(e) => {
						(e.target as HTMLImageElement).src = "/placeholder-product.svg";
					}}
				/>
			</div>
		);
	}

	return (
		<Carousel className="w-full">
			<CarouselContent>
				{images.map((image, index) => (
					<CarouselItem key={`image-${image.url}-${index}`}>
						<div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
							<img
								src={image.url}
								alt={image.alt}
								className="w-full h-full object-cover"
								onError={(e) => {
									(e.target as HTMLImageElement).src =
										"/placeholder-product.svg";
								}}
							/>
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			{images.length > 1 && (
				<>
					<CarouselPrevious className="left-4" />
					<CarouselNext className="right-4" />
				</>
			)}
		</Carousel>
	);
};

const ProductSkeleton = () => (
	<div className="min-h-screen bg-background">
		<div className="container mx-auto max-w-7xl px-4 py-8">
			<Skeleton className="h-10 w-32 mb-8" />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
				<Skeleton className="aspect-square rounded-xl" />
				<div className="space-y-6">
					<Skeleton className="h-8 w-3/4" />
					<Skeleton className="h-6 w-1/2" />
					<Skeleton className="h-20 w-full" />
					<div className="space-y-4">
						<Skeleton className="h-12 w-32" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>
			</div>
		</div>
	</div>
);

export default function ProductPage({ params }: ProductPageProps) {
	const { id } = use(params);
	const { data: product, isLoading, error } = useProduct(id);

	if (isLoading) {
		return <ProductSkeleton />;
	}

	if (error || !product) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-destructive mb-4">
						Producto no encontrado
					</h1>
					<p className="text-muted-foreground mb-8">
						El producto que buscas no existe o ha sido eliminado.
					</p>
					<Button asChild>
						<Link href="/products">
							<ArrowLeftIcon className="h-4 w-4 mr-2" />
							Volver al catálogo
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	const stock = product.locations.reduce(
		(sum, loc) => (loc.showInStore ? sum + (loc.stock || 0) : sum),
		0,
	);
	const isLowStock = stock <= product.minimumStock;
	const isOutOfStock = stock === 0;

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto max-w-7xl px-4 py-8">
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					className="mb-8"
				>
					<Button variant="ghost" asChild>
						<Link href="/products">
							<ArrowLeftIcon className="h-4 w-4 mr-2" />
							Volver al catálogo
						</Link>
					</Button>
				</motion.div>

				{/* Product Details */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Product Images */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
					>
						<ProductImageGallery product={product} />
					</motion.div>

					{/* Product Info */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="space-y-8"
					>
						{/* Header */}
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<Badge variant="outline">{product.category}</Badge>
								<Badge
									variant={
										isOutOfStock
											? "destructive"
											: isLowStock
												? "destructive"
												: "secondary"
									}
								>
									{isOutOfStock ? "Agotado" : `${stock} en stock`}
								</Badge>
							</div>

							<h1 className="text-4xl font-bold leading-tight">
								{product.name}
							</h1>

							<p className="text-xl text-muted-foreground uppercase tracking-wide font-medium">
								{product.brand}
							</p>

							<p className="text-lg text-muted-foreground leading-relaxed">
								{product.description}
							</p>
						</div>

						{/* Specifications */}
						<Card>
							<CardContent className="p-6">
								<h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
									<InfoIcon className="h-5 w-5" />
									Especificaciones
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex items-center gap-3">
										<PackageIcon className="h-5 w-5 text-primary" />
										<div>
											<p className="text-sm text-muted-foreground">Capacidad</p>
											<p className="font-medium">
												{product.capacity}{" "}
												{product.capacityUnit !== "count"
													? product.capacityUnit
													: "unidades"}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<TagIcon className="h-5 w-5 text-primary" />
										<div>
											<p className="text-sm text-muted-foreground">Categoría</p>
											<p className="font-medium">{product.category}</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Pricing */}
						<Card>
							<CardContent className="p-6">
								<div className="space-y-4">
									<div>
										<p className="text-sm text-muted-foreground mb-1">
											Precio al detalle
										</p>
										<p className="text-4xl font-bold text-primary">
											{currencyFormat.format(product.retailPrice)}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground mb-1">
											Precio al por mayor
										</p>
										<p className="text-2xl font-semibold">
											{currencyFormat.format(product.wholesalePrice)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Actions */}
						<div className="space-y-4">
						<Button
							size="lg"
							className="w-full text-lg py-6"
							disabled={isOutOfStock}
							asChild={!isOutOfStock}
						>
							{isOutOfStock ? (
								<>
									<ShoppingCartIcon className="h-5 w-5 mr-2" />
									Producto agotado
								</>
							) : (
								<Link href="/supply">
									<ShoppingCartIcon className="h-5 w-5 mr-2" />
									Solicitar cotización
								</Link>
							)}
						</Button>						<div className="grid grid-cols-1 gap-4">
							<Button 
								variant="outline" 
								size="lg"
								asChild
							>
								<a href="tel:+18498636444">
									<TruckIcon className="h-4 w-4 mr-2" />
									Consultar envío: +1 (849) 863-6444
								</a>
							</Button>
						</div>
						</div>

						{/* Guarantees */}
						<Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
							<CardContent className="p-6">
								<div className="flex items-start gap-4">
									<ShieldCheckIcon className="h-6 w-6 text-green-600 mt-1" />
									<div>
										<h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">
											Garantía de calidad
										</h4>
										<ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
											<li>• Productos 100% originales</li>
											<li>• Garantía de satisfacción</li>
											<li>• Envío rápido y seguro</li>
											<li>• Soporte al cliente 24/7</li>
										</ul>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
