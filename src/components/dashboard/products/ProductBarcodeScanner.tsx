"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ScanIcon,
	SearchIcon,
	XIcon,
	Trash2Icon,
	AlertCircleIcon,
	PackageSearchIcon,
} from "lucide-react";
import type { ProductType } from "@/types/models/products";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { useProduct } from "@/contexts/products/queries";
import { currencyFormat } from "@/config/formats";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import type { ProductFilters } from "@/contexts/products/types";

interface ProductBarcodeScanner {
	children?: React.ReactNode;
	filters?: ProductFilters;
	onProductFound?: (product: ProductType) => void;
}

export function ProductBarcodeScanner({
	children,
	filters = {},
	onProductFound,
}: ProductBarcodeScanner) {
	const [isOpen, setIsOpen] = useState(false);
	const [barcodeInput, setBarcodeInput] = useState("");

	const {
		data: product,
		isLoading,
		error,
		refetch,
	} = useProduct(barcodeInput, { enabled: !!barcodeInput }, filters);

	const handleSearch = () => {
		if (!barcodeInput.trim()) {
			toast.error("Ingresa un código de barras para buscar");
			return;
		}
		refetch();
	};

	const handleProductSelect = (foundProduct: ProductType) => {
		onProductFound?.(foundProduct);
		toast.success(`Producto seleccionado: ${foundProduct.name}`);
		setIsOpen(false);
	};

	const clearSearch = () => {
		setBarcodeInput("");
	};

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			setBarcodeInput("");
		}
	};

	const stock =
		product?.locations.reduce((sum, loc) => sum + (loc.stock || 0), 0) ?? 0;

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{children || (
					<Button variant="outline" className="gap-2">
						<ScanIcon className="size-4" />
						Buscar por código de barras
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className="max-w-md mx-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<ScanIcon className="h-5 w-5" />
						Buscar producto por código de barras
					</DialogTitle>
					<DialogDescription>
						Escanea el código de barras con tu dispositivo handheld para buscar
						el producto
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-3">
						<Label htmlFor="barcode-input">Código de barras</Label>
						<div className="flex gap-2">
							<Input
								id="barcode-input"
								placeholder="Escanea o ingresa el código de barras..."
								value={barcodeInput}
								onChange={(e) => setBarcodeInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleSearch();
									}
								}}
								autoFocus
							/>
							<Button
								onClick={handleSearch}
								disabled={isLoading || !barcodeInput.trim()}
								size="icon"
								variant="outline"
							>
								<SearchIcon className="size-4" />
							</Button>
							{barcodeInput && (
								<Button onClick={clearSearch} size="icon" variant="outline">
									<XIcon className="size-4" />
								</Button>
							)}
						</div>
					</div>

					<AnimatePresence mode="wait">
						{isLoading && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="flex flex-col items-center justify-center gap-y-2 py-4 text-center"
							>
								<Spinner className="size-8" />
								<p className="text-sm text-muted-foreground mt-2">
									Buscando producto
								</p>
							</motion.div>
						)}

						{error && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="flex flex-col items-center justify-center gap-y-2 py-4 text-center"
							>
								<AlertCircleIcon className="size-6" />
								<p className="text-sm text-destructive">
									Error al buscar producto.
								</p>
							</motion.div>
						)}

						{!isLoading && !error && barcodeInput && !product && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className="text-center py-4"
							>
								<PackageSearchIcon className="size-8 mx-auto text-muted-foreground mb-2" />
								<p className="text-sm text-muted-foreground">
									No se encontró ningún producto con el código: {barcodeInput}
								</p>
							</motion.div>
						)}

						{product && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
							>
								<Card
									className="cursor-pointer hover:shadow-md transition-shadow"
									onClick={() => handleProductSelect(product)}
								>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<CardTitle className="text-base leading-tight">
													{product.name}
												</CardTitle>
												<p className="text-sm text-muted-foreground">
													ID: {product._id}
												</p>
											</div>
											<Badge variant={stock > 0 ? "default" : "destructive"}>
												{stock > 0 ? "En stock" : "Sin stock"}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">Stock:</span>
												<span className="font-medium">
													{product.stock} unidades
												</span>
											</div>
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">Precio:</span>
												<span className="font-medium">
													{currencyFormat.format(product.retailPrice)}
												</span>
											</div>
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">
													Precio por mayor:
												</span>
												<span className="font-medium">
													{currencyFormat.format(product.wholesalePrice)}
												</span>
											</div>
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">Marca:</span>
												<span className="font-medium">{product.brand}</span>
											</div>
										</div>
									</CardContent>
									<CardFooter className="flex flex-wrap gap-2 items-center">
										{!handleProductSelect && (
											<Button size="sm" asChild>
												<Link href={`/dashboard/products/${product._id}`}>
													Ver mas detalles
												</Link>
											</Button>
										)}
										<Button
											variant={"outline"}
											size="sm"
											onClick={() => setBarcodeInput("")}
										>
											<Trash2Icon className="h-4 w-4" />
											Limpiar búsqueda
										</Button>
									</CardFooter>
								</Card>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</DialogContent>
		</Dialog>
	);
}
