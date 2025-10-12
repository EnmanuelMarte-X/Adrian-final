"use client";

import { OrderValue } from "@/components/dashboard/orders/OrderValue";
import { Button } from "@/components/ui/button";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { dateFormat, currencyFormat } from "@/config/formats";
import { useOrderById } from "@/contexts/orders/queries";
import {
	AlertCircle,
	ArrowLeftIcon,
	ReceiptIcon,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { TAX_PERCENTAGE } from "@/config/shop";
import { Spinner } from "@/components/ui/spinner";
import { ProductDialog } from "@/components/dashboard/products/ProductDialog";
import { getUnsetValue, isArrayEmpty, truncateText } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserDetailsDialog } from "@/components/dashboard/users/UserDetailsDialog";
import { useWindowWidth } from "@/hooks/use-window-width";
import { motion } from "motion/react";
import { ClientDetailsDialog } from "@/components/dashboard/clients/ClientDetailsDialog";
import { CreditOrderReceipt } from "@/components/dashboard/orders/CreditOrderReceipt";
import { OrderReceipt } from "@/components/dashboard/orders/OrderReceipt";

export default function OrderSlugPage({
	params,
}: { params: Promise<{ id: string }> }) {
	const { id: orderId } = use(params);
	const { data: order, isError, isLoading } = useOrderById(orderId);
	const windowWidth = useWindowWidth();
	const isLargeScreen = windowWidth >= 1200;

	const handleViewReceipt = () => {
		const receiptUrl = `/recipient/${orderId}`;
		window.open(receiptUrl, "_blank");
	};

	if (isError) {
		return (
			<motion.div
				className="flex items-center justify-center h-full p-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="flex flex-col items-center gap-4 text-center max-w-md">
					<AlertCircle className="size-12 text-destructive" />
					<div className="space-y-2">
						<h2 className="text-lg font-semibold">
							Error al cargar la factura
						</h2>
						<p className="text-muted-foreground">
							No se pudo cargar la información de la factura. Esto puede deberse
							a que la factura no existe o hay un problema de conexión.
						</p>
					</div>
					<Link href="/dashboard/orders">
						<Button variant="outline" size="sm">
							<ArrowLeftIcon className="size-4" />
							<span className="hidden sm:inline ml-2">Volver a órdenes</span>
						</Button>
					</Link>
				</div>
			</motion.div>
		);
	}

	const subtotal =
		order?.products?.reduce((total, product) => {
			return total + product.retailPrice * product.quantity;
		}, 0) ?? 0;
	const totalDiscount =
		order?.products?.reduce((totalDiscount, product) => {
			return totalDiscount + (product.discount || 0);
		}, 0) ?? 0;
	const tax = subtotal * TAX_PERCENTAGE;
	const total = subtotal - totalDiscount + tax;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4 }}
			className="min-h-screen h-full"
		>
			{!isLargeScreen ? (
				<motion.main
					className="w-full mx-auto p-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<motion.div
						className="inline-flex items-center justify-between pb-8 w-full"
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Link href={"/dashboard/orders"}>
							<Button variant="ghost" size="sm">
								<ArrowLeftIcon className="size-4" />
								<span className="hidden sm:inline ml-1">Ver todas las ordenes</span>
							</Button>
						</Link>
						<Button size="sm" variant="outline" onClick={handleViewReceipt}>
							<ReceiptIcon className="size-3" />
							<span className="hidden sm:inline ml-1">Ver factura</span>
						</Button>
					</motion.div>
					<motion.div
						className="grid grid-cols-4 gap-x-3 gap-y-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<OrderValue
							label="Id de factura"
							isLoading={isLoading}
							classNames={{ container: "col-span-2" }}
						>
							{Number(order?.orderId)}
						</OrderValue>

						<OrderValue
							label="Total"
							isLoading={isLoading}
							classNames={{ container: "col-span-2 text-right" }}
						>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className="inline-flex gap-x-1 items-start cursor-pointer">
										{currencyFormat.format(getUnsetValue(total, 0))}
									</span>
								</TooltipTrigger>
								<TooltipContent>
									<div className="flex flex-col gap-y-2">
										<div className="flex justify-between gap-x-1">
											<span className="text-sm font-bold">Subtotal:</span>
											<span className="text-sm">
												{currencyFormat.format(getUnsetValue(subtotal, 0))}
											</span>
										</div>
										<div className="flex justify-between gap-x-1">
											<span className="text-sm font-bold">Impuestos:</span>
											<span className="text-sm">
												{currencyFormat.format(getUnsetValue(tax, 0))}
											</span>
										</div>
										<div className="flex justify-between gap-x-1">
											<span className="text-sm font-bold">Descuentos:</span>
											<span className="text-sm">
												{currencyFormat.format(getUnsetValue(totalDiscount, 0))}
											</span>
										</div>
									</div>
								</TooltipContent>
							</Tooltip>
						</OrderValue>

						<OrderValue
							label="Fecha"
							isLoading={isLoading}
							classNames={{ container: "col-span-2 w-full text-left" }}
						>
							{order?.date
								? dateFormat(new Date(order?.date ?? ""), "PP h:mm a")
								: "No disponible"}
						</OrderValue>
					</motion.div>
					<motion.div
						className="grid grid-cols-2 w-full mt-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
					>
						<OrderValue
							label="Cliente"
							isLoading={isLoading}
							align="left"
							classNames={{ container: "grid-cols-2" }}
						>
							{isLoading ? (
								"Cargando..."
							) : (
								<div className="flex items-center justify-start gap-2">
									{typeof order?.buyerId === "object" && order?.buyerId?._id ? (
										<ClientDetailsDialog
											clientId={order.buyerId._id}
											clientInfo={order.buyerId}
											title="Detalles del Cliente"
										>
											<Button
												variant="link"
												className="p-0 h-auto text-right font-normal"
											>
												{order.buyerId.name}
											</Button>
										</ClientDetailsDialog>
									) : (
										<span className="text-muted-foreground flex items-center gap-1">
											<AlertCircle className="size-3" />
											{typeof order?.sellerId === "string"
												? order.sellerId
												: "Vendedor no encontrado"}
										</span>
									)}
								</div>
							)}
						</OrderValue>

						<OrderValue
							label="Empleado"
							isLoading={isLoading}
							align="right"
							classNames={{ container: "grid-cols-2" }}
						>
							{isLoading ? (
								"Cargando..."
							) : (
								<div className="flex items-center justify-end gap-2">
									{typeof order?.sellerId === "object" &&
									order?.sellerId?._id ? (
										<UserDetailsDialog
											userId={order.sellerId._id}
											userInfo={order.sellerId}
											title="Detalles del Vendedor"
										>
											<Button
												variant="link"
												className="p-0 h-auto text-right font-normal"
											>
												{order.sellerId.firstName} {order.sellerId.lastName}
											</Button>
										</UserDetailsDialog>
									) : (
										<span className="text-muted-foreground flex items-center gap-1">
											<AlertCircle className="size-3" />
											{typeof order?.sellerId === "string"
												? order.sellerId
												: "Vendedor no encontrado"}
										</span>
									)}
								</div>
							)}
						</OrderValue>
					</motion.div>
					<motion.div
						className="flex flex-col gap-y-3 mt-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.5 }}
					>
						<div className="inline-flex gap-x-2 items-center">
							<h2 className="font-bold">Productos</h2>
							{isLoading ? (
								<Spinner className="size-4" />
							) : (
								<span className="text-muted-foreground text-xs">
									{order?.products?.length ?? 0}
								</span>
							)}
						</div>
						<hr />
						{!isLoading && isArrayEmpty(order?.products) && (
							<div className="flex flex-col gap-y-3 items-center justify-center w-full p-4 bg-destructive/30 rounded-2xl">
								<AlertCircle className="text-destructive-foreground/80 size-7 min-h-7" />
								<p className="text-sm text-destructive-foreground max-w-[45ch] text-center">
									<strong>Esta factura no contiene productos.</strong> Por
									favor, verifique la información o contacte al soporte.
								</p>
							</div>
						)}
						{!isLoading && (
							<div className="flex flex-col gap-y-1">
								{order?.products?.map((product) => (
									<ProductDialog
										key={product.productId}
										productId={product.productId}
									>
										<button
											key={product.productId}
											type="button"
											disabled={isLoading}
											className="hover:bg-accent/60 py-3 pr-3 pl-2 transition-colors rounded-sm cursor-pointer w-full text-left"
										>
											<div className="flex items-center justify-between w-full">
												<h3 className="max-w-[32ch] truncate text-sm">
													{product.name || product.productId}
													<span className="text-muted-foreground ml-1 text-xs">
														x{product.quantity}
													</span>
												</h3>
												<span className="text-muted-foreground text-sm">
													{currencyFormat.format(product.retailPrice)}
												</span>
											</div>
										</button>
									</ProductDialog>
								))}
							</div>
						)}
					</motion.div>
				</motion.main>
			) : (
				<ResizablePanelGroup direction="horizontal" className="min-h-screen">
					<ResizablePanel
						defaultSize={55}
						minSize={30}
						className="overflow-auto min-h-screen"
					>
						<motion.main
							className="max-w-xl w-full mx-auto p-6"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
						>
							<motion.div
								className="inline-flex items-center justify-between pb-8 w-full"
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
							>
								<Link href={"/dashboard/orders"}>
									<Button variant="ghost" size="sm">
										<ArrowLeftIcon className="size-4" />
										<span className="hidden sm:inline ml-1">Ver todas las ordenes</span>
									</Button>
								</Link>
								<Button size="sm" variant="ghost" onClick={handleViewReceipt}>
									<ReceiptIcon className="size-3" />
									<span className="hidden sm:inline ml-1">Ver factura</span>
								</Button>
							</motion.div>
							<motion.div
								className="grid grid-cols-4 gap-x-3 gap-y-12"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
							>
								<OrderValue
									label="Id de factura"
									isLoading={isLoading}
									classNames={{ container: "col-span-2" }}
								>
									{Number(order?.orderId)}
								</OrderValue>

								<OrderValue
									label="Total"
									isLoading={isLoading}
									classNames={{ container: "col-span-2 text-right" }}
								>
									<Tooltip>
										<TooltipTrigger asChild>
											<span className="inline-flex gap-x-1 items-start cursor-pointer">
												{currencyFormat.format(getUnsetValue(total, 0))}
											</span>
										</TooltipTrigger>
										<TooltipContent>
											<div className="flex flex-col gap-y-2">
												<div className="flex justify-between gap-x-1">
													<span className="text-sm font-bold">Subtotal:</span>
													<span className="text-sm">
														{currencyFormat.format(getUnsetValue(subtotal, 0))}
													</span>
												</div>
												<div className="flex justify-between gap-x-1">
													<span className="text-sm font-bold">Impuestos:</span>
													<span className="text-sm">
														{currencyFormat.format(getUnsetValue(tax, 0))}
													</span>
												</div>
												<div className="flex justify-between gap-x-1">
													<span className="text-sm font-bold">Descuentos:</span>
													<span className="text-sm">
														{currencyFormat.format(
															getUnsetValue(totalDiscount, 0),
														)}
													</span>
												</div>
											</div>
										</TooltipContent>
									</Tooltip>
								</OrderValue>

								<OrderValue
									label="Fecha"
									isLoading={isLoading}
									classNames={{ container: "col-span-2 w-full text-left" }}
								>
									{order?.date
										? dateFormat(new Date(order?.date ?? ""), "PP h:mm a")
										: "No disponible"}
								</OrderValue>
							</motion.div>
							<motion.div
								className="grid grid-cols-2 w-full mt-12"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.4 }}
							>
								<OrderValue
									label="Cliente"
									isLoading={isLoading}
									align="left"
									classNames={{ container: "grid-cols-2" }}
								>
									{isLoading ? (
										"Cargando..."
									) : (
										<div className="flex items-center justify-start gap-2">
											{typeof order?.buyerId === "object" && order?.buyerId?._id ? (
												<ClientDetailsDialog
													clientId={order.buyerId._id}
													clientInfo={order.buyerId}
													title="Detalles del Cliente"
												>
													<Button
														variant="link"
														className="p-0 h-auto text-right font-normal"
													>
														{order.buyerId.name || truncateText(order.buyerId._id, 10)}
													</Button>
												</ClientDetailsDialog>
											) : (
												<span className="text-muted-foreground flex items-center gap-1">
													<AlertCircle className="size-3" />
													N/A
												</span>
											)}
										</div>
									)}
								</OrderValue>

								<OrderValue
									label="Empleado"
									isLoading={isLoading}
									align="right"
									classNames={{ container: "grid-cols-2" }}
								>
									{isLoading ? (
										"Cargando..."
									) : (
										<div className="flex items-center justify-end gap-2">
											{typeof order?.sellerId === "object" &&
											order?.sellerId?._id ? (
												<UserDetailsDialog
													userId={order.sellerId._id}
													userInfo={order.sellerId}
													title="Detalles del Vendedor"
												>
													<Button
														variant="link"
														className="p-0 h-auto text-right font-normal"
													>
														{order.sellerId.firstName} {order.sellerId.lastName}
													</Button>
												</UserDetailsDialog>
											) : (
												<span className="text-muted-foreground flex items-center gap-1">
													<AlertCircle className="size-3" />
													{typeof order?.sellerId === "string"
														? order.sellerId
														: "Vendedor no encontrado"}
												</span>
											)}
										</div>
									)}
								</OrderValue>
							</motion.div>
							<motion.div
								className="flex flex-col gap-y-3 mt-12"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.5 }}
							>
								<div className="inline-flex gap-x-2 items-center">
									<h2 className="font-bold">Productos</h2>
									{isLoading ? (
										<Spinner className="size-4" />
									) : (
										<span className="text-muted-foreground text-xs">
											{order?.products?.length ?? 0}
										</span>
									)}
								</div>
								<hr />
								{!isLoading && isArrayEmpty(order?.products) && (
									<div className="flex flex-col gap-y-3 items-center justify-center w-full p-4 bg-destructive/30 rounded-2xl">
										<AlertCircle className="text-destructive-foreground/80 size-7 min-h-7" />
										<p className="text-sm text-destructive-foreground max-w-[45ch] text-center">
											<strong>Esta factura no contiene productos.</strong> Por
											favor, verifique la información o contacte al soporte.
										</p>
									</div>
								)}
								{!isLoading && (
									<div className="flex flex-col gap-y-1">
										{order?.products?.map((product) => (
											<ProductDialog
												key={product.productId}
												productId={product.productId}
											>
												<button
													key={product.productId}
													type="button"
													disabled={isLoading}
													className="hover:bg-accent/60 py-3 pr-3 pl-2 transition-colors rounded-sm cursor-pointer w-full text-left"
												>
													<div className="flex items-center justify-between w-full">
														<h3 className="max-w-[32ch] truncate text-sm">
															{product.name || product.productId}
															<span className="text-muted-foreground ml-1 text-xs">
																x{product.quantity}
															</span>
														</h3>
														<span className="text-muted-foreground text-sm">
															{currencyFormat.format(product.retailPrice)}
														</span>
													</div>
												</button>
											</ProductDialog>
										))}
									</div>
								)}
							</motion.div>
						</motion.main>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel className="bg-white" defaultSize={55} minSize={45}>
						{order?.isCredit ? (
							<CreditOrderReceipt
								order={order}
								subtotal={subtotal}
								total={total}
								isLoading={isLoading}
							/>
						) : (
							<OrderReceipt
								order={order}
								subtotal={subtotal}
								total={total}
								isLoading={isLoading}
							/>
						)}
					</ResizablePanel>
				</ResizablePanelGroup>
			)}
		</motion.div>
	);
}
