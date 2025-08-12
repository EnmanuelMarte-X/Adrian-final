import { dateFormat, currencyFormat } from "@/config/formats";
import { getPaymentMethodName } from "@/contexts/paymentHistory/payment-method";
import { paymentMethodIcons, unknownPaymentMethodIcon } from "@/config/orders";
import { TAX_PERCENTAGE } from "@/config/shop";
import Barcode from "react-barcode";
import type { PaymentHistoryType } from "@/types/models/paymentHistory";
import type { PaymentMethod } from "@/types/models/paymentHistory";
import { Spinner } from "@/components/ui/spinner";
import { isValidObjectId } from "@/lib/utils";
import { Logo } from "@/components/logo";

interface PaymentVoucherProps {
	payment: PaymentHistoryType | undefined;
	isLoading?: boolean;
}

export function PaymentVoucher({ payment, isLoading }: PaymentVoucherProps) {
	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
					gap: "20px",
					color: "#000",
				}}
			>
				<Spinner
					style={{ fontSize: "40px", animation: "spin 1s linear infinite" }}
				/>
				<span style={{ fontSize: "14px", opacity: 0.85, fontWeight: "600" }}>
					Cargando recibo....
				</span>
			</div>
		);
	}

	if (!payment) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
				}}
			>
				<span style={{ fontSize: "14px", opacity: 0.85 }}>
					Recibo no encontrado
				</span>
			</div>
		);
	}

	const orderData =
		typeof payment.orderId === "object" ? payment.orderId : null;
	const subtotal = Array.isArray(orderData?.products)
		? orderData.products.reduce(
				(
					acc: number,
					product: {
						productId: { retailPrice?: number } | string;
						quantity: number;
					},
				) => {
					const productData =
						typeof product.productId === "object" ? product.productId : null;
					const price = productData?.retailPrice || 0;
					const quantity = product.quantity || 0;
					return acc + price * quantity;
				},
				0,
			)
		: 0;
	const totalDiscount = payment.discount || 0;
	const tax = subtotal * TAX_PERCENTAGE;
	const grandTotal = subtotal - totalDiscount + tax;

	return (
		<div
			id="payment-voucher"
			style={{
				backgroundColor: "white",
				color: "black",
				boxShadow: "none",
				padding: "0",
				margin: "0",
				overflow: "visible",
				width: "100%",
				paddingLeft: "80px",
				paddingRight: "80px",
			}}
		>
			<div
				style={{
					margin: "0 auto",
					color: "#000",
					minWidth: "320px",
					maxWidth: "640px",
					paddingTop: "48px",
					paddingBottom: "48px",
					paddingLeft: "20px",
					paddingRight: "20px",
				}}
			>
				<div id="voucher-content">
					<header
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "space-between",
							gap: "16px",
						}}
					>
						<Logo width={128} height={128} className="size-24" />
						<h1
							style={{
								fontSize: "20px",
								fontWeight: "bold",
								textTransform: "uppercase",
							}}
						>
							Jhenson Supply
						</h1>

						<div
							style={{
								width: "100%",
								border: "1px solid #d1d5db",
								borderRadius: "8px",
								overflow: "hidden",
								backgroundColor: "#ffffff",
								marginTop: "16px",
							}}
						>
							<div
								style={{
									padding: "12px 16px",
									borderBottom: "1px solid #e5e7eb",
									backgroundColor: "#f0fdf4",
								}}
							>
								<h3
									style={{
										fontSize: "14px",
										fontWeight: "600",
										margin: "0",
										color: "#111827",
									}}
								>
									Información del Recibo
								</h3>
							</div>
							<div style={{ padding: "16px" }}>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "12px",
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<span
											style={{
												fontSize: "13px",
												color: "#374151",
												fontWeight: "500",
											}}
										>
											ID del Pago
										</span>
										<span
											style={{
												fontSize: "13px",
												fontWeight: "600",
												color: "#111827",
												fontFamily: "monospace",
											}}
										>
											{payment._id || "N/A"}
										</span>
									</div>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<span
											style={{
												fontSize: "13px",
												color: "#374151",
												fontWeight: "500",
											}}
										>
											Fecha y Hora
										</span>
										<span
											style={{
												fontSize: "13px",
												fontWeight: "600",
												color: "#111827",
											}}
										>
											{dateFormat(new Date(payment.date), "MM/dd/yyyy hh:mm a")}
										</span>
									</div>
									{typeof payment.clientId === "object" && payment.clientId && (
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}
										>
											<span
												style={{
													fontSize: "13px",
													color: "#374151",
													fontWeight: "500",
												}}
											>
												Cliente
											</span>
											<span
												style={{
													fontSize: "13px",
													fontWeight: "600",
													color: "#111827",
												}}
											>
												{payment.clientId.name}
											</span>
										</div>
									)}
									{typeof payment.orderId === "object" && payment.orderId && (
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}
										>
											<span
												style={{
													fontSize: "13px",
													color: "#374151",
													fontWeight: "500",
												}}
											>
												Factura
											</span>
											<span
												style={{
													fontSize: "13px",
													fontWeight: "600",
													color: "#111827",
												}}
											>
												#{payment.orderId.orderId}
											</span>
										</div>
									)}
								</div>
							</div>
						</div>
					</header>

					<div
						style={{
							marginTop: "40px",
							marginBottom: "40px",
						}}
					>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(3, 1fr)",
								gap: "24px",
								marginBottom: "32px",
							}}
						>
							<div
								style={{
									padding: "20px",
									backgroundColor: "#f0fdf4",
									border: "1px solid #e5e7eb",
									borderRadius: "8px",
									textAlign: "center",
								}}
							>
								<h3
									style={{
										fontSize: "14px",
										fontWeight: "600",
										marginBottom: "8px",
										opacity: 0.85,
									}}
								>
									Método de Pago
								</h3>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										gap: "8px",
									}}
								>
									<div
										style={{
											width: "20px",
											height: "20px",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										{paymentMethodIcons[payment.method as PaymentMethod] ||
											unknownPaymentMethodIcon}
									</div>
									<span
										style={{
											fontSize: "16px",
											fontWeight: "500",
										}}
									>
										{getPaymentMethodName(payment.method)}
									</span>
								</div>
							</div>

							<div
								style={{
									padding: "20px",
									backgroundColor: "#f0fdf4",
									border: "1px solid #e5e7eb",
									borderRadius: "8px",
									textAlign: "center",
								}}
							>
								<h3
									style={{
										fontSize: "14px",
										fontWeight: "600",
										marginBottom: "8px",
										opacity: 0.85,
									}}
								>
									Monto Pagado
								</h3>
								<span
									style={{
										fontSize: "20px",
										fontWeight: "600",
										color: "#059669",
									}}
								>
									{currencyFormat.format(payment.amount)}
								</span>
							</div>

							<div
								style={{
									padding: "20px",
									backgroundColor: "#f0fdf4",
									border: "1px solid #e5e7eb",
									borderRadius: "8px",
									textAlign: "center",
								}}
							>
								<h3
									style={{
										fontSize: "14px",
										fontWeight: "600",
										marginBottom: "8px",
										opacity: 0.85,
									}}
								>
									Saldo Pendiente
								</h3>
								<span
									style={{
										fontSize: "20px",
										fontWeight: "600",
										color: grandTotal > payment.amount ? "#dc2626" : "#059669",
									}}
								>
									{currencyFormat.format(
										Math.max(0, grandTotal - payment.amount),
									)}
								</span>
							</div>
						</div>

						<div
							style={{
								textAlign: "center",
								padding: "24px",
								backgroundColor: "#f0fdf4",
								border: "1px solid #e5e7eb",
								borderRadius: "8px",
								marginBottom: "24px",
							}}
						>
							<h3
								style={{
									fontSize: "16px",
									fontWeight: "600",
									marginBottom: "8px",
								}}
							>
								Resumen del Pago
							</h3>
							<p style={{ fontSize: "14px", opacity: 0.85, lineHeight: "1.5" }}>
								Se ha procesado exitosamente un pago por{" "}
								<strong>{currencyFormat.format(payment.amount)}</strong>{" "}
								mediante <strong>{getPaymentMethodName(payment.method)}</strong>{" "}
								el día{" "}
								<strong>
									{dateFormat(new Date(payment.date), "dd/MM/yyyy")}
								</strong>
								.
							</p>
						</div>

						<div
							style={{
								border: "1px solid #d1d5db",
								borderRadius: "8px",
								overflow: "hidden",
								backgroundColor: "#ffffff",
							}}
						>
							<div
								style={{
									padding: "16px 20px",
									borderBottom: "1px solid #e5e7eb",
									backgroundColor: "#f0fdf4",
								}}
							>
								<h3
									style={{
										fontSize: "16px",
										fontWeight: "600",
										margin: "0",
										color: "#111827",
									}}
								>
									Desglose de la Factura
								</h3>
							</div>
							<div style={{ padding: "20px" }}>
								<div
									style={{
										display: "flex",
										flexDirection: "column",
										gap: "16px",
									}}
								>
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											padding: "8px 0",
										}}
									>
										<span
											style={{
												fontSize: "14px",
												color: "#374151",
												fontWeight: "500",
											}}
										>
											Subtotal
										</span>
										<span
											style={{
												fontSize: "14px",
												fontWeight: "600",
												color: "#111827",
											}}
										>
											{currencyFormat.format(subtotal)}
										</span>
									</div>
									{totalDiscount > 0 && (
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												padding: "8px 0",
											}}
										>
											<span
												style={{
													fontSize: "14px",
													color: "#374151",
													fontWeight: "500",
												}}
											>
												Descuento
											</span>
											<span
												style={{
													fontSize: "14px",
													fontWeight: "600",
													color: "#059669",
												}}
											>
												-{currencyFormat.format(totalDiscount)}
											</span>
										</div>
									)}
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											padding: "8px 0",
										}}
									>
										<span
											style={{
												fontSize: "14px",
												color: "#374151",
												fontWeight: "500",
											}}
										>
											Impuestos (ITEBIS)
										</span>
										<span
											style={{
												fontSize: "14px",
												fontWeight: "600",
												color: "#111827",
											}}
										>
											{currencyFormat.format(tax)}
										</span>
									</div>
								</div>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										padding: "12px 0",
										backgroundColor: "#f0fdf4",
										margin: "0 -20px",
										paddingLeft: "20px",
										paddingRight: "20px",
									}}
								>
									<span
										style={{
											fontSize: "16px",
											fontWeight: "700",
											color: "#111827",
										}}
									>
										Total de la Factura
									</span>
									<span
										style={{
											fontSize: "18px",
											fontWeight: "700",
											color: "#111827",
										}}
									>
										{currencyFormat.format(grandTotal)}
									</span>
								</div>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										padding: "8px 0",
									}}
								>
									<span
										style={{
											fontSize: "14px",
											color: "#374151",
											fontWeight: "500",
										}}
									>
										Monto Pagado
									</span>
									<span
										style={{
											fontSize: "14px",
											fontWeight: "600",
											color: "#059669",
										}}
									>
										{currencyFormat.format(payment.amount)}
									</span>
								</div>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										padding: "8px 0",
									}}
								>
									<span
										style={{
											fontSize: "14px",
											color: "#374151",
											fontWeight: "500",
										}}
									>
										Saldo Pendiente
									</span>
									<span
										style={{
											fontSize: "14px",
											fontWeight: "600",
											color:
												Math.max(0, grandTotal - payment.amount) > 0
													? "#dc2626"
													: "#059669",
										}}
									>
										{currencyFormat.format(
											Math.max(0, grandTotal - payment.amount),
										)}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className="h-[5px] print:block hidden" />

					{isValidObjectId(payment._id) && (
						<div
							style={{
								width: "100%",
								border: "1px solid #d1d5db",
								borderRadius: "8px",
								overflow: "hidden",
								backgroundColor: "#ffffff",
							}}
						>
							<div
								style={{
									padding: "12px 16px",
									borderBottom: "1px solid #e5e7eb",
									backgroundColor: "#f0fdf4",
								}}
							>
								<h3
									style={{
										fontSize: "14px",
										fontWeight: "600",
										margin: "0",
										color: "#111827",
										textAlign: "center",
									}}
								>
									Código de Identificación
								</h3>
							</div>
							<div
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									padding: "20px",
								}}
							>
								<Barcode value={String(payment._id)} format="CODE128" />
							</div>
						</div>
					)}

					<footer
						style={{
							marginTop: "24px",
						}}
					>
						<div
							style={{
								padding: "12px",
								border: "1px solid #e5e7eb",
								borderRadius: "6px",
								backgroundColor: "#f0fdf4",
								textAlign: "center",
							}}
						>
							<div
								style={{ fontSize: "12px", opacity: 0.75, lineHeight: "1.3" }}
							>
								<div style={{ fontWeight: "600", marginBottom: "4px" }}>
									Jhenson Supply
								</div>
								<div>
									RNC 132145399 • +1 (849) 863-6444 • facturas@jhensonsupply.com
								</div>
								<div>Calle Santa Lucía No. 15, Val. del Este, SDE</div>
							</div>
						</div>
					</footer>
				</div>
			</div>
		</div>
	);
}
