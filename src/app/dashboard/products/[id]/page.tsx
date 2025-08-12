"use client";

import { useProduct } from "@/contexts/products/queries";
import { useStorages } from "@/contexts/storages/queries";
import { motion, AnimatePresence } from "motion/react";
import {
	ArrowLeftIcon,
	BoxesIcon,
	BoxIcon,
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
	DollarSignIcon,
	ImageIcon,
	InfoIcon,
	WarehouseIcon,
	AlertTriangleIcon,
	AlertCircleIcon,
	TriangleAlert,
	RefreshCwIcon,
	PackageSearchIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { currencyFormat, dateFormat } from "@/config/formats";
import { getDateFromObjectId, getProductCapacityUnitLabel } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { use, useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ProductStorageType, ProductImage } from "@/types/models/products";
import type { StorageType } from "@/types/models/storages";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductActions } from "@/components/dashboard/products/ProductActions";
import { unknownProductValue } from "@/config/products";

const pageVariants = {
	initial: {
		opacity: 0,
		y: 10,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
			staggerChildren: 0.05,
		},
	},
	exit: {
		opacity: 0,
		y: -10,
		transition: {
			duration: 0.2,
		},
	},
};

const cardVariants = {
	initial: {
		opacity: 0,
		y: 15,
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
		},
	},
};

const alertVariants = {
	initial: {
		opacity: 0,
		x: -20,
		scale: 0.9,
	},
	animate: {
		opacity: 1,
		x: 0,
		scale: 1,
		transition: {
			duration: 0.3,
		},
	},
	exit: {
		opacity: 0,
		x: 20,
		scale: 0.9,
		transition: {
			duration: 0.2,
		},
	},
};

export default function ProductDetailPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id } = use(params);
	const productId = Array.isArray(id) ? id[0] : id;
	const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	if (!productId) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-muted-foreground">Producto no encontrado</p>
			</div>
		);
	}

	const {
		data: product,
		isLoading: isProductLoading,
		isError: isProductError,
	} = useProduct(productId);

	const createdAt = product?._id ? getDateFromObjectId(product._id) : null;
	const capacityUnit = product?.capacityUnit
		? getProductCapacityUnitLabel(product.capacityUnit, product.capacity)
		: "";

	const totalStock = useMemo(() => {
		if (!product || isProductLoading) return 0;
		return product.locations?.reduce(
			(sum: number, location: ProductStorageType) =>
				sum + (location.stock || 0),
			0,
		);
	}, [product, isProductLoading]);

	const productAlerts = useMemo(() => {
		if (!product || isProductLoading) return [];

		const alerts = [];

		if (totalStock < (product.minimumStock || 0)) {
			alerts.push({
				id: "low-stock",
				level: "critical",
				message: `Stock bajo: ${totalStock} unidades disponibles (mínimo: ${product.minimumStock || 0}).`,
			});
		}

		return alerts;
	}, [product, isProductLoading, totalStock]);

	const hasLocations = useMemo(() => {
		return product?.locations && product.locations.length > 0;
	}, [product]);

	const storageIds = useMemo(() => {
		return hasLocations
			? product?.locations.map(
					(location: ProductStorageType) => location.storageId,
				)
			: [];
	}, [product, hasLocations]);

	const { data: locations, isLoading: isLocationDataLoading } = useStorages({
		ids: storageIds,
		enabled: hasLocations,
	});

	const hasImages = useMemo(() => {
		return product?.images && product.images.length > 0;
	}, [product]);

	if (isProductLoading) {
		return (
			<div className="flex flex-col w-full min-h-screen py-6 px-6 space-y-6 overflow-y-scroll">
				<header className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<Link href="/dashboard/products" className="mr-4">
							<Button variant="outline" size="icon">
								<ArrowLeftIcon className="size-4" />
							</Button>
						</Link>
						<Skeleton className="w-48 h-8" />
					</div>
				</header>

				<div className="grid md:grid-cols-3 gap-6">
					<Card className="md:col-span-1">
						<CardHeader>
							<CardTitle>Información del producto</CardTitle>
							<CardDescription>Detalles y especificaciones</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<Skeleton className="h-40 w-full" />
								<Skeleton className="h-20 w-full" />
							</div>
						</CardContent>
					</Card>

					<div className="md:col-span-2 space-y-4">
						<Card>
							<CardHeader>
								<CardTitle>Detalles adicionales</CardTitle>
								<CardDescription>
									Descripción, ubicaciones y más
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Skeleton className="h-10 w-full mb-4" />
								<div className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Acciones rápidas</CardTitle>
								<CardDescription>
									Gestionar el inventario de este producto
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<Skeleton className="h-16 w-full" />
									<Skeleton className="h-16 w-full" />
									<Skeleton className="h-16 w-full" />
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		);
	}

	if (isProductError) {
		return (
			<div className="flex flex-col w-full min-h-screen py-6 px-6 space-y-6">
				<header className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<Link href="/dashboard/products" className="mr-4">
							<Button variant="outline" size="icon">
								<ArrowLeftIcon className="size-4" />
							</Button>
						</Link>
						<h1 className="text-2xl font-bold">Detalles del producto</h1>
					</div>
				</header>

				<div className="flex flex-col items-center justify-center min-h-[200px] text-destructive-foreground/70">
					<TriangleAlert className="size-12" />
					<p className="text-sm text-muted-foreground/70 text-center mt-2 max-w-[45ch] font-medium">
						Error al cargar el producto. Por favor, verifica tu conexión a
						internet o intenta nuevamente más tarde.
					</p>
					<div className="flex flex-wrap gap-2 mt-4">
						<Button variant="outline" onClick={() => window.location.reload()}>
							<RefreshCwIcon className="mr-2 size-4" />
							Reintentar
						</Button>
						<Link href="/dashboard/products">
							<Button>
								<ArrowLeftIcon className="mr-2 size-4" />
								Volver a productos
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if ((!product || product === null) && !isProductLoading && !isProductError) {
		return (
			<div className="flex flex-col w-full min-h-screen py-6 px-6 space-y-6">
				<header className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<Link href="/dashboard/products" className="mr-4">
							<Button variant="outline" size="icon">
								<ArrowLeftIcon className="size-4" />
							</Button>
						</Link>
						<h1 className="text-2xl font-bold">Detalles del producto</h1>
					</div>
				</header>

				<div className="flex flex-col items-center space-y-2 justify-center h-full max-w-[45ch] mx-auto text-center">
					<PackageSearchIcon className="mr-2 size-8" />
					<h1 className="text-lg font-medium">Producto no encontrado.</h1>
					<p className="text-sm text-muted-foreground">
						No se pudo encontrar información sobre el producto. Por favor,
						verifica el ID del producto o intenta nuevamente más tarde.
					</p>
					<Link href="/dashboard/products">
						<Button className="mt-2">
							<ArrowLeftIcon className="mr-2 size-4" />
							Volver a Productos
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<motion.div
			className="flex flex-col w-full min-h-screen py-6 px-6"
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<motion.header
				className="flex flex-wrap items-center justify-between gap-4"
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<div className="flex items-center gap-2">
					<Link href="/dashboard/products" className="mr-2">
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button variant="outline" size="icon">
								<ArrowLeftIcon className="size-4" />
							</Button>
						</motion.div>
					</Link>
					<h1 className="text-2xl font-bold">Detalles del producto</h1>
				</div>
			</motion.header>

			{productAlerts.length > 0 && (
				<motion.div
					className="w-full my-2"
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3, delay: 0.1 }}
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={currentAlertIndex}
							variants={alertVariants}
							initial="initial"
							animate="animate"
							exit="exit"
						>
							<Alert
								variant={
									productAlerts[currentAlertIndex].level === "critical"
										? "destructive"
										: "default"
								}
								className="relative"
							>
								{productAlerts[currentAlertIndex].level === "critical" ? (
									<AlertCircleIcon className="size-4" />
								) : (
									<AlertTriangleIcon className="size-4" />
								)}
								<AlertDescription className="flex-grow">
									{productAlerts[currentAlertIndex].message}
								</AlertDescription>

								{productAlerts.length > 1 && (
									<div className="flex items-center gap-1 ml-auto">
										<Button
											variant="ghost"
											size="icon"
											className="size-6"
											onClick={() =>
												setCurrentAlertIndex((prev) =>
													prev === 0 ? productAlerts.length - 1 : prev - 1,
												)
											}
										>
											<ChevronLeftIcon className="size-3" />
										</Button>
										<span className="text-xs">
											{currentAlertIndex + 1}/{productAlerts.length}
										</span>
										<Button
											variant="ghost"
											size="icon"
											className="size-6"
											onClick={() =>
												setCurrentAlertIndex((prev) =>
													prev === productAlerts.length - 1 ? 0 : prev + 1,
												)
											}
										>
											<ChevronRightIcon className="size-3" />
										</Button>
									</div>
								)}
							</Alert>
						</motion.div>
					</AnimatePresence>
				</motion.div>
			)}

			<motion.div
				className="grid lg:grid-cols-3 gap-6 mt-4"
				initial={{ opacity: 0, y: 15 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.2, staggerChildren: 0.05 }}
			>
				<motion.div
					variants={cardVariants}
					initial="initial"
					animate="animate"
					className="md:col-span-1"
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<span>{product?.name || unknownProductValue}</span>
								<Badge variant="secondary">
									{product?.category || unknownProductValue}
								</Badge>
							</CardTitle>
							<CardDescription>Detalles y especificaciones</CardDescription>
						</CardHeader>
						<CardContent>
							{isProductLoading ? (
								<div className="space-y-4">
									<Skeleton className="h-40 w-full" />
									<Skeleton className="h-20 w-full" />
								</div>
							) : product ? (
								<motion.div
									className="space-y-6"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								>
									<motion.div
										className="aspect-square relative bg-secondary rounded-lg flex items-center justify-center overflow-hidden group"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
										whileHover={{ scale: 1.02 }}
									>
										{hasImages ? (
											<>
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ duration: 0.3 }}
													className="w-full h-full relative"
												>
													<Avatar className="w-full h-full rounded-none">
														<AvatarImage
															src={product.images[selectedImageIndex]?.url}
															alt={product.images[selectedImageIndex]?.alt}
														/>
														<AvatarFallback className="rounded-none">
															<ImageIcon className="size-16 text-muted-foreground" />
														</AvatarFallback>
													</Avatar>
												</motion.div>

												{product.images.length > 1 && (
													<>
														<button
															type="button"
															className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
															onClick={() =>
																setSelectedImageIndex((prev) =>
																	prev === 0
																		? product.images.length - 1
																		: prev - 1,
																)
															}
														>
															<ChevronLeftIcon className="size-4" />
														</button>
														<button
															type="button"
															className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
															onClick={() =>
																setSelectedImageIndex((prev) =>
																	prev === product.images.length - 1
																		? 0
																		: prev + 1,
																)
															}
														>
															<ChevronRightIcon className="size-4" />
														</button>

														<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
															{product.images.map((image, index) => (
																<button
																	key={`dot-${image.url}-${index}`}
																	type="button"
																	className={`w-2 h-2 rounded-full transition-colors ${
																		selectedImageIndex === index
																			? "bg-white"
																			: "bg-white/50 hover:bg-white/70"
																	}`}
																	onClick={() => setSelectedImageIndex(index)}
																/>
															))}
														</div>
													</>
												)}
											</>
										) : (
											<div className="flex flex-col items-center justify-center text-muted-foreground">
												<ImageIcon className="size-16 mb-2" />
												<p className="text-sm">Sin imagen</p>
											</div>
										)}
									</motion.div>

									<motion.div
										className="grid grid-cols-2 gap-4 mt-6"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
									>
										<motion.div
											className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
											whileHover={{ scale: 1.05 }}
										>
											<DollarSignIcon className="size-8 mb-2 text-primary" />
											<p className="text-sm text-muted-foreground">
												Precio Venta
											</p>
											<p className="text-xl font-bold">
												{currencyFormat.format(product.retailPrice)}
											</p>
										</motion.div>
										<motion.div
											className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3 }}
											whileHover={{ scale: 1.05 }}
										>
											<BoxesIcon className="size-8 mb-2 text-primary" />
											<p className="text-sm text-muted-foreground">Por Mayor</p>
											<p className="text-xl font-bold">
												{currencyFormat.format(product.wholesalePrice)}
											</p>
										</motion.div>
									</motion.div>

									<motion.div
										className="space-y-3"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.3 }}
									>
										<div className="flex justify-between py-2 border-b">
											<span className="text-muted-foreground">Marca</span>
											<span className="font-medium">{product.brand}</span>
										</div>
										<div className="flex justify-between py-2 border-b">
											<span className="text-muted-foreground">Capacidad</span>
											<span className="font-medium">
												{product.capacity} {capacityUnit}
											</span>
										</div>
										<div className="flex justify-between py-2 border-b">
											<span className="text-muted-foreground">Costo</span>
											<span className="font-medium">
												{currencyFormat.format(product.cost)}
											</span>
										</div>
										<div className="flex justify-between py-2 border-b">
											<span className="text-muted-foreground">Stock Total</span>
											<span className="font-medium">{totalStock}</span>
										</div>
										<div className="flex justify-between py-2 border-b">
											<span className="text-muted-foreground">
												Stock Mínimo
											</span>
											<span className="font-medium">
												{product.minimumStock}
											</span>
										</div>
										{createdAt && (
											<div className="flex justify-between py-2">
												<span className="text-muted-foreground">Creado</span>
												<span className="font-medium">
													{dateFormat(createdAt)}
												</span>
											</div>
										)}
									</motion.div>
								</motion.div>
							) : (
								<div className="p-8 text-center">
									<p className="text-muted-foreground">
										No se encontró información del producto
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					variants={cardVariants}
					initial="initial"
					animate="animate"
					className="lg:col-span-2 space-y-4"
				>
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<Card>
							<CardHeader>
								<CardTitle>Detalles adicionales</CardTitle>
								<CardDescription>
									Descripción, ubicaciones y más
								</CardDescription>
							</CardHeader>

							<CardContent>
								<Tabs defaultValue="description" className="w-full">
									<TabsList className="mb-4">
										<TabsTrigger value="description">Descripción</TabsTrigger>
										<TabsTrigger value="locations">Ubicaciones</TabsTrigger>
										<TabsTrigger value="images">Imágenes</TabsTrigger>
									</TabsList>

									<TabsContent value="description" className="space-y-4">
										{isProductLoading ? (
											<div className="space-y-2">
												<Skeleton className="h-4 w-full" />
												<Skeleton className="h-4 w-full" />
												<Skeleton className="h-4 w-3/4" />
											</div>
										) : product ? (
											<div className="prose dark:prose-invert max-w-none">
												<p>
													{product.description ||
														"No hay descripción disponible para este producto."}
												</p>
											</div>
										) : (
											<div className="py-8 text-center">
												<InfoIcon className="mx-auto size-12 text-muted-foreground mb-4" />
												<h3 className="text-lg font-medium mb-2">
													Sin descripción
												</h3>
												<p className="text-muted-foreground max-w-md mx-auto">
													Este producto no tiene una descripción disponible.
												</p>
											</div>
										)}
									</TabsContent>

									<TabsContent value="locations">
										{isLocationDataLoading ? (
											<div className="space-y-2">
												<Skeleton className="h-12 w-full" />
												<Skeleton className="h-12 w-full" />
											</div>
										) : product ? (
											<div className="space-y-4">
												<h3 className="text-muted-foreground text-sm mb-2">
													Ubicaciones de almacenamiento
												</h3>{" "}
												{hasLocations ? (
													<div className="space-y-3">
														{product.locations.map((location) => {
															const storageItem = locations?.storages.find(
																(loc: StorageType) =>
																	loc._id === location.storageId,
															);
															return (
																<div
																	key={location.storageId}
																	className="flex items-center justify-between p-3 bg-secondary/40 rounded-md"
																>
																	<div className="flex items-center gap-3">
																		<div className="bg-primary/10 p-2 rounded-md">
																			<WarehouseIcon className="size-5 text-primary" />
																		</div>{" "}
																		<div>
																			<p className="font-medium">
																				{storageItem?.name ||
																					"Almacén desconocido"}
																			</p>
																			<p className="text-sm text-muted-foreground">
																				ID: {location.storageId}
																			</p>
																		</div>
																	</div>
																	<div className="text-right">
																		<p className="font-medium font-mono text-sm">
																			{location.stock} unidades
																		</p>
																	</div>
																</div>
															);
														})}
													</div>
												) : (
													<div className="py-8 text-center">
														<BoxIcon className="mx-auto size-12 text-muted-foreground mb-4" />
														<h3 className="text-lg font-medium mb-2">
															Sin ubicaciones
														</h3>
														<p className="text-muted-foreground max-w-md mx-auto">
															Este producto no tiene ubicaciones asignadas.
														</p>
													</div>
												)}
											</div>
										) : (
											<div className="py-8 text-center">
												<BoxIcon className="mx-auto size-12 text-muted-foreground mb-4" />
												<h3 className="text-lg font-medium mb-2">
													Sin ubicaciones
												</h3>
												<p className="text-muted-foreground max-w-md mx-auto">
													Este producto no tiene ubicaciones asignadas.
												</p>
											</div>
										)}
									</TabsContent>

									<TabsContent value="images">
										{isProductLoading ? (
											<div className="grid grid-cols-3 w-full gap-2 mt-2">
												<Skeleton className="h-20 w-full" />
												<Skeleton className="h-20 w-full" />
												<Skeleton className="h-20 w-full" />
											</div>
										) : product && hasImages ? (
											<motion.div
												className="space-y-4"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ duration: 0.3 }}
											>
												<motion.div
													className="aspect-video bg-secondary rounded-lg overflow-hidden relative"
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ duration: 0.3 }}
												>
													<Avatar className="w-full h-full rounded-lg">
														<AvatarImage
															src={product.images[selectedImageIndex]?.url}
															alt={
																product.images[selectedImageIndex]?.alt ||
																`Imagen ${selectedImageIndex + 1} de ${product.name}`
															}
															className="object-cover"
														/>
														<AvatarFallback className="rounded-lg">
															<ImageIcon className="size-16 text-muted-foreground" />
														</AvatarFallback>
													</Avatar>

													<div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
														{selectedImageIndex + 1} / {product.images.length}
													</div>
												</motion.div>

												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ duration: 0.3 }}
												>
													<Carousel className="w-full">
														<CarouselContent className="-ml-2 md:-ml-4">
															{product.images.map(
																(image: ProductImage, index: number) => (
																	<CarouselItem
																		key={`thumbnail-${image.url}`}
																		className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5"
																	>
																		<motion.button
																			className={`aspect-square bg-secondary rounded-md overflow-hidden relative border-2 transition-colors ${
																				selectedImageIndex === index
																					? "border-primary"
																					: "border-transparent hover:border-primary/50"
																			}`}
																			onClick={() =>
																				setSelectedImageIndex(index)
																			}
																			whileHover={{ scale: 1.05 }}
																			whileTap={{ scale: 0.95 }}
																			initial={{ opacity: 0 }}
																			animate={{ opacity: 1 }}
																			transition={{
																				duration: 0.3,
																			}}
																		>
																			<Avatar className="w-full h-full rounded-md">
																				<AvatarImage
																					src={image.url}
																					alt={
																						image.alt ||
																						`Miniatura ${index + 1} de ${product.name}`
																					}
																					className="object-cover"
																				/>
																				<AvatarFallback className="rounded-md">
																					<ImageIcon className="size-6 text-muted-foreground" />
																				</AvatarFallback>
																			</Avatar>
																		</motion.button>
																	</CarouselItem>
																),
															)}
														</CarouselContent>
														{product.images.length > 3 && (
															<>
																<CarouselPrevious className="left-0" />
																<CarouselNext className="right-0" />
															</>
														)}
													</Carousel>
												</motion.div>
											</motion.div>
										) : (
											<div className="py-8 text-center">
												<ImageIcon className="mx-auto size-12 text-muted-foreground mb-4" />
												<h3 className="text-lg font-medium mb-2">
													Sin imágenes
												</h3>
												<p className="text-muted-foreground max-w-md mx-auto">
													Este producto no tiene imágenes disponibles.
												</p>
											</div>
										)}
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>
					</motion.div>

					<ProductActions product={product} productId={productId} />
				</motion.div>
			</motion.div>
		</motion.div>
	);
}
