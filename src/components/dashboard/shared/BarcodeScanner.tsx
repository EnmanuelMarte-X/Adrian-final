"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	ScanIcon,
	SearchIcon,
	XIcon,
	Trash2Icon,
	AlertCircleIcon,
	PackageSearchIcon,
	FileTextIcon,
	PackageIcon,
	CreditCardIcon,
} from "lucide-react";
import type { ProductType } from "@/types/models/products";
import type { OrderTypeWithProducts } from "@/types/models/orders";
import type { PaymentHistoryType } from "@/types/models/paymentHistory";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { useProduct } from "@/contexts/products/queries";
import { usePaymentHistoryById } from "@/contexts/paymentHistory/queries";
import { currencyFormat } from "@/config/formats";
import { TAX_PERCENTAGE } from "@/config/shop";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import type { ProductFilters } from "@/contexts/products/types";

type SearchType = "product" | "order" | "payment";

// Custom hook for order with enabled option
function useOrderByIdWithOptions(id: string, options: { enabled: boolean }) {
	return useQuery({
		queryKey: ["order", id],
		enabled: options.enabled && !!id,
		queryFn: async () => {
			const response = await fetch(`/api/orders/${id}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch order: ${response.status}`);
			}

			return (await response.json()) as OrderTypeWithProducts;
		},
	});
}

interface BarcodeScannerProps {
	children?: React.ReactNode;
	filters?: ProductFilters;
	onProductFound?: (product: ProductType) => void;
	onOrderFound?: (order: OrderTypeWithProducts) => void;
	onPaymentFound?: (payment: PaymentHistoryType) => void;
	searchType?: SearchType;
}

export function BarcodeScanner({
	children,
	filters = {},
	onProductFound,
	onOrderFound,
	onPaymentFound,
	searchType = "product",
}: BarcodeScannerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [barcodeInput, setBarcodeInput] = useState("");
	const [currentSearchType, setCurrentSearchType] = useState<SearchType>(searchType);

	const {
		data: product,
		isLoading: isLoadingProduct,
		error: productError,
		refetch: refetchProduct,
	} = useProduct(
		barcodeInput, 
		{ enabled: !!barcodeInput && currentSearchType === "product" }, 
		filters
	);

	const {
		data: order,
		isLoading: isLoadingOrder,
		error: orderError,
		refetch: refetchOrder,
	} = useOrderByIdWithOptions(barcodeInput, {
		enabled: !!barcodeInput && currentSearchType === "order"
	});

	const {
		data: payment,
		isLoading: isLoadingPayment,
		error: paymentError,
		refetch: refetchPayment,
	} = usePaymentHistoryById(barcodeInput);

	const isLoading = isLoadingProduct || isLoadingOrder || (currentSearchType === "payment" && isLoadingPayment);
	const error = productError || orderError || (currentSearchType === "payment" && paymentError);

	const handleSearch = () => {
		if (!barcodeInput.trim()) {
			toast.error("Ingresa un código de barras o ID para buscar");
			return;
		}

		if (currentSearchType === "product") {
			refetchProduct();
		} else if (currentSearchType === "order") {
			refetchOrder();
		} else if (currentSearchType === "payment") {
			refetchPayment();
		}
	};

	const handleProductSelect = (foundProduct: ProductType) => {
		onProductFound?.(foundProduct);
		toast.success(`Producto seleccionado: ${foundProduct.name}`);
		setIsOpen(false);
	};

	const handleOrderSelect = (foundOrder: OrderTypeWithProducts) => {
		onOrderFound?.(foundOrder);
		toast.success(`Factura seleccionada: ${foundOrder.orderId}`);
		setIsOpen(false);
	};

	const handlePaymentSelect = (foundPayment: PaymentHistoryType) => {
		onPaymentFound?.(foundPayment);
		toast.success(`Pago seleccionado: ${foundPayment._id}`);
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
		product?.locations?.reduce((sum: number, loc) => sum + (loc.stock || 0), 0) ?? 0;

	// Cálculo correcto del total de la factura con ITBIS y descuentos
	const subtotal = order?.products?.reduce((sum: number, prod) => {
		const price = Number(prod.price) || 0;
		const quantity = Number(prod.quantity) || 0;

		return sum + (price * quantity);
	}, 0) ?? 0;
	
	const totalDiscount = order?.products?.reduce((total: number, prod) => {
		const discount = Number(prod.discount) || 0;
		return total + discount;
	}, 0) ?? 0;
	
	const tax = Number.isFinite(subtotal) ? subtotal * TAX_PERCENTAGE : 0;
	const totalAmount = Number.isFinite(subtotal) && Number.isFinite(totalDiscount) && Number.isFinite(tax) 
		? subtotal - totalDiscount + tax 
		: 0;
	


	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{children || (
					<Button variant="outline" className="gap-2">
						<ScanIcon className="size-4" />
						Buscar por código
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className="max-w-md mx-auto">
			<DialogHeader>
				<DialogTitle className="flex items-center gap-2">
					<ScanIcon className="h-5 w-5" />
					Buscar por código de barras
				</DialogTitle>
				<DialogDescription>
					Busca productos por código de barras, facturas por ID o pagos por ID
				</DialogDescription>
			</DialogHeader>				<div className="space-y-4">
				<Tabs value={currentSearchType} onValueChange={(value) => setCurrentSearchType(value as SearchType)}>
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="product" className="flex items-center gap-2">
							<PackageIcon className="size-4" />
							Productos
						</TabsTrigger>
						<TabsTrigger value="order" className="flex items-center gap-2">
							<FileTextIcon className="size-4" />
							Facturas
						</TabsTrigger>
						<TabsTrigger value="payment" className="flex items-center gap-2">
							<CreditCardIcon className="size-4" />
							Pagos
						</TabsTrigger>
					</TabsList>						<TabsContent value="product" className="space-y-3 mt-4">
							<Label htmlFor="barcode-input">ID del producto</Label>
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
						</TabsContent>

						<TabsContent value="order" className="space-y-3 mt-4">
							<Label htmlFor="order-input">ID de la factura</Label>
							<div className="flex gap-2">
								<Input
									id="order-input"
									placeholder="Ingresa el ID de la factura..."
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
						</TabsContent>

						<TabsContent value="payment" className="space-y-3 mt-4">
							<Label htmlFor="payment-input">ID del pago</Label>
							<div className="flex gap-2">
								<Input
									id="payment-input"
									placeholder="Ingresa el ID del pago..."
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
						</TabsContent>
					</Tabs>

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
								{currentSearchType === "product" ? "Buscando producto" : currentSearchType === "order" ? "Buscando factura" : "Buscando pago"}
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
								{currentSearchType === "product" ? "Error al buscar producto." : currentSearchType === "order" ? "Error al buscar factura." : "Error al buscar pago."}
							</p>
							</motion.div>
						)}

				{!isLoading && !error && barcodeInput && !product && !order && !(currentSearchType === "payment" && payment) && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="text-center py-4"
					>
						<PackageSearchIcon className="size-8 mx-auto text-muted-foreground mb-2" />
						<p className="text-sm text-muted-foreground">
							No se encontró ningún {currentSearchType === "product" ? "producto" : currentSearchType === "order" ? "factura" : "pago"} 
							{currentSearchType === "product" ? " con el código: " : " con el ID: "}{barcodeInput}
						</p>
					</motion.div>
				)}						{/* Resultado de producto */}
						{product && currentSearchType === "product" && (
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
													{product.locations?.reduce((acc, loc) => acc + (loc.stock || 0), 0) || 0} unidades
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
										{!onProductFound && (
											<Button size="sm" asChild>
												<Link href={`/dashboard/products/${product._id}`}>
													Ver mas detalles
												</Link>
											</Button>
										)}
										<Button
											variant={"outline"}
											size="sm"
											onClick={(e) => {
												e.stopPropagation();
												setBarcodeInput("");
											}}
										>
											<Trash2Icon className="h-4 w-4" />
											Limpiar búsqueda
										</Button>
									</CardFooter>
								</Card>
							</motion.div>
						)}

						{/* Resultado de orden/factura */}
						{order && currentSearchType === "order" && (
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
							>
								<Card
									className="cursor-pointer hover:shadow-md transition-shadow"
									onClick={() => handleOrderSelect(order)}
								>
									<CardHeader>
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<CardTitle className="text-base leading-tight">
													Factura #{order.orderId}
												</CardTitle>
												<p className="text-sm text-muted-foreground">
													ID: {order._id}
												</p>
											</div>
											<Badge variant={order.isCredit ? "secondary" : "default"}>
												{order.isCredit ? "Crédito" : "Contado"}
											</Badge>
										</div>
									</CardHeader>
									<CardContent>
										<div className="space-y-2">
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">Fecha:</span>
												<span className="font-medium">
													{new Date(order.date).toLocaleDateString()}
												</span>
											</div>
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">Subtotal:</span>
												<span className="font-medium">
													{currencyFormat.format(subtotal)}
												</span>
											</div>
											{totalDiscount > 0 && (
												<div className="flex items-center justify-between text-sm">
													<span className="text-muted-foreground">Descuento:</span>
													<span className="font-medium text-green-600">
														-{currencyFormat.format(totalDiscount)}
													</span>
												</div>
											)}
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">ITBIS ({(TAX_PERCENTAGE * 100).toFixed(0)}%):</span>
												<span className="font-medium">
													{currencyFormat.format(tax)}
												</span>
											</div>
											<div className="flex items-center justify-between text-sm border-t pt-2">
												<span className="text-muted-foreground font-semibold">Total:</span>
												<span className="font-bold text-lg">
													{currencyFormat.format(totalAmount)}
												</span>
											</div>
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">Productos:</span>
												<span className="font-medium">
													{order.products?.length || 0} item{(order.products?.length || 0) !== 1 ? 's' : ''}
												</span>
											</div>
											<div className="flex items-center justify-between text-sm">
												<span className="text-muted-foreground">Cliente:</span>
												<span className="font-medium">
													{typeof order.buyerId === 'object' ? order.buyerId.name : order.buyerId}
												</span>
											</div>
										</div>
									</CardContent>
									<CardFooter className="flex flex-wrap gap-2 items-center">
										{!onOrderFound && (
											<Button size="sm" asChild>
												<Link href={`/dashboard/orders/${order._id}`}>
													Ver detalles
												</Link>
											</Button>
										)}
										<Button
											variant={"outline"}
											size="sm"
											onClick={(e) => {
												e.stopPropagation();
												setBarcodeInput("");
											}}
										>
											<Trash2Icon className="h-4 w-4" />
											Limpiar búsqueda
										</Button>
									</CardFooter>
										</Card>
									</motion.div>
								)}

								{/* Resultado de pago */}
								{payment && currentSearchType === "payment" && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
									>
										<Card
											className="cursor-pointer hover:shadow-md transition-shadow"
											onClick={() => handlePaymentSelect(payment)}
										>
											<CardHeader>
												<div className="flex items-start justify-between">
													<div className="space-y-1">
														<CardTitle className="text-base leading-tight">
															Pago #{payment._id?.slice(-8)}
														</CardTitle>
														<p className="text-sm text-muted-foreground">
															ID: {payment._id}
														</p>
													</div>
													<Badge variant="default">
														{payment.method}
													</Badge>
												</div>
											</CardHeader>
											<CardContent>
												<div className="space-y-2">
													<div className="flex items-center justify-between text-sm">
														<span className="text-muted-foreground">Fecha:</span>
														<span className="font-medium">
															{new Date(payment.date).toLocaleDateString()}
														</span>
													</div>
													<div className="flex items-center justify-between text-sm border-t pt-2">
														<span className="text-muted-foreground font-semibold">Monto:</span>
														<span className="font-bold text-lg text-green-600">
															{currencyFormat.format(payment.amount)}
														</span>
													</div>
													<div className="flex items-center justify-between text-sm">
														<span className="text-muted-foreground">Cliente:</span>
														<span className="font-medium">
															{typeof payment.clientId === 'object' ? payment.clientId.name : payment.clientId}
														</span>
													</div>
													<div className="flex items-center justify-between text-sm">
														<span className="text-muted-foreground">Factura:</span>
														<span className="font-medium">
															{typeof payment.orderId === 'object' ? `#${payment.orderId.orderId}` : payment.orderId}
														</span>
													</div>
												</div>
											</CardContent>
											<CardFooter className="flex flex-wrap gap-2 items-center">
												{!onPaymentFound && (
													<Button size="sm" asChild>
														<Link href={`/dashboard/payments/${payment._id}`}>
															Ver detalles
														</Link>
													</Button>
												)}
												<Button
													variant={"outline"}
													size="sm"
													onClick={(e) => {
														e.stopPropagation();
														setBarcodeInput("");
													}}
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