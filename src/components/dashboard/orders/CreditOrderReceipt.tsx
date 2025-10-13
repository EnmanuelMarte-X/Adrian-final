import { dateFormat, currencyFormat, nameFormat } from "@/config/formats";
import { TAX_PERCENTAGE } from "@/config/shop";
import Barcode from "react-barcode";
import type { OrderTypeWithProducts } from "@/types/models/orders";
import { Spinner } from "@/components/ui/spinner";
import { formatNationalId, getUnsetValue, isValidObjectId } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { documentTypeLabels } from "@/contexts/clients/document-types";
import { usePaymentHistoryByOrderId } from "@/contexts/paymentHistory/queries";

interface CreditOrderReceiptProps {
	order: OrderTypeWithProducts | undefined;
	subtotal: number;
	total: number;
	isLoading?: boolean;
}

export function CreditOrderReceipt({
	order,
	subtotal,
	total,
	isLoading,
}: CreditOrderReceiptProps) {
	const { data: payments = [] } = usePaymentHistoryByOrderId(order?._id || "");

	const totalPaid = payments.reduce((acc, payment) => acc + payment.amount, 0);

	const remainingBalance = Math.max(0, total - totalPaid);
	if (isLoading) {
		return (
			<div
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: "20px",
					color: "#000",
					zIndex: 9999,
					background: "rgba(255,255,255,0.85)",
				}}
			>
				<Spinner
					style={{ fontSize: "40px", animation: "spin 1s linear infinite" }}
				/>
				<span style={{ fontSize: "14px", opacity: 0.85, fontWeight: "600" }}>
					Cargando previsualización....
				</span>
			</div>
		);
	}

	if (!order) {
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
					Factura no encontrada
				</span>
			</div>
		);
	}

	return (
		<div
			id="order-receipt"
			style={{
				backgroundColor: "white",
				color: "black",
				boxShadow: "none",
				padding: "0",
				margin: "0",
				overflow: "visible",
				width: "100%",
				paddingLeft: "20px",
				paddingRight: "20px",
			}}
		>
			<div
				style={{
					margin: "0 auto",
					color: "#000",
					minWidth: "320px",
					maxWidth: "900px",
					paddingTop: "24px",
					paddingBottom: "24px",
					paddingLeft: "8px",
					paddingRight: "8px",
				}}
			>
				<div id="receipt-content">
					<header
						style={{
							display: "flex",
							flexDirection: "row",
							alignItems: "flex-start",
							justifyContent: "space-between",
							gap: "32px",
							marginBottom: "32px",
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "start",
								gap: "16px",
							}}
						>
							<Logo width={256} height={256} className="size-14" />
							<div>
								<h1
									style={{
										fontSize: "20px",
										fontWeight: "600",
										margin: "0",
									}}
								>
									Jhenson Supply
								</h1>
								<div
									style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}
								>
									<div>RNC 132145399</div>
									<div>+1 (849) 863-6444</div>
									<div>facturas@jhensonsupply.com</div>
									<div>Calle Santa Lucía No. 15, Val. del Este, SDE</div>
								</div>
							</div>
						</div>
						<div style={{ textAlign: "right" }}>
							<h2
								style={{
									fontSize: "24px",
									fontWeight: "400",
									margin: "0 0 16px 0",
									color: "#1f2937",
								}}
							>
								Factura #{order.orderId}
							</h2>
							<div style={{ fontSize: "12px", lineHeight: "1.6" }}>
								<div>
									<strong>Fecha:</strong>{" "}
									<span style={{ marginLeft: "4px" }}>
										{dateFormat(new Date(order.date), "PP")}
									</span>
								</div>
								{order.ncfSequence && (
									<div>
										<strong>Num. Comprobante fiscal:</strong>{" "}
										<span style={{ marginLeft: "4px" }}>
											B01{String(order.ncfSequence).padStart(8, "0")}
										</span>
									</div>
								)}
								{order.cfSequence && (
									<div>
										<strong>Num. Consumidor final:</strong>{" "}
										<span style={{ marginLeft: "4px" }}>
											B02{String(order.cfSequence).padStart(8, "0")}
										</span>
									</div>
								)}
								{isValidObjectId(order._id) && (
									<div
										style={{
											paddingBlock: "2px",
										}}
									>
										<Barcode
											value={String(order._id)}
											format="CODE128"
											width={1.3}
											height={40}
											fontSize={12}
											displayValue={false}
										/>
									</div>
								)}
							</div>
						</div>
					</header>

					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "32px",
							marginBottom: "32px",
						}}
					>
						<div>
							<h3
								style={{
									fontSize: "14px",
									fontWeight: "600",
									margin: "0 0 8px 0",
									color: "#374151",
								}}
							>
								Empleado
							</h3>
							<div style={{ fontSize: "12px", lineHeight: "1.6" }}>
								{(() => {
									if (typeof order.sellerId === "string") {
										return (
											<div style={{ fontWeight: "600" }}>{order.sellerId}</div>
										);
									}

									if (!order.sellerId) {
										return (
											<div style={{ fontWeight: "600" }}>No disponible</div>
										);
									}

									return (
										<>
											<div style={{ fontWeight: "600" }}>
												{getUnsetValue(
													`${order.sellerId.firstName} ${order.sellerId.lastName}`,
													"Nombre no disponible",
												)}
											</div>
											<div>
												{getUnsetValue(
													`${order.sellerId.username && `@${order.sellerId.username}`}`,
													"Nombre de usuario no disponible",
												)}
											</div>
											<div>
												{getUnsetValue(
													order.sellerId.email,
													"Email no disponible",
												)}
											</div>
										</>
									);
								})()}
							</div>
						</div>
						<div>
							<h3
								style={{
									fontSize: "14px",
									fontWeight: "600",
									margin: "0 0 8px 0",
									color: "#374151",
								}}
							>
								Cliente
							</h3>
							<div style={{ fontSize: "12px", lineHeight: "1.6" }}>
								{(() => {
									if (typeof order.buyerId === "string") {
										return (
											<div style={{ fontWeight: "600" }}>{order.buyerId}</div>
										);
									}

									if (!order.buyerId) {
										return (
											<div style={{ fontWeight: "600" }}>No disponible</div>
										);
									}

									return (
										<>
											<div style={{ fontWeight: "600", marginBottom: "4px" }}>
												{nameFormat(order.buyerId.name)}
											</div>
											<div>
												{getUnsetValue(
													order.buyerId.email,
													"Email no disponible",
												)}
											</div>
											<div>
												Deuda: {currencyFormat.format(order.buyerId.debt || 0)}
											</div>
											<div>
												{documentTypeLabels[order.buyerId.documentType]}:{" "}
												{formatNationalId(order.buyerId.documentNumber)}
											</div>
											<div>
												Tipo:{" "}
												{order.buyerId.type === "individual"
													? "Individual"
													: "Empresa"}
											</div>
										</>
									);
								})()}
							</div>
						</div>
					</div>

					<div
						style={{
							border: "1px solid #d1d5db",
							borderRadius: "8px",
							overflow: "hidden",
							backgroundColor: "#ffffff",
							marginTop: "40px",
						}}
					>
						<table
							style={{
								width: "100%",
								borderCollapse: "collapse",
								fontSize: "12px",
							}}
						>
							<thead>
								<tr
									style={{
										backgroundColor: "#f0fdf4",
										color: "black",
									}}
								>
									<th
										style={{
											padding: "4px 3px",
											textAlign: "left",
											fontWeight: "600",
											fontSize: "9px",
											textTransform: "uppercase",
											borderBottom: "1px solid #e5e7eb",
										}}
									>
										Descripción
									</th>
									<th
										style={{
											padding: "4px 3px",
											textAlign: "center",
											fontWeight: "600",
											fontSize: "9px",
											textTransform: "uppercase",
											borderBottom: "1px solid #e5e7eb",
										}}
									>
										Precio
									</th>
									<th
										style={{
											padding: "4px 3px",
											textAlign: "center",
											fontWeight: "600",
											fontSize: "9px",
											textTransform: "uppercase",
											borderBottom: "1px solid #e5e7eb",
										}}
									>
										Cant.
									</th>
									<th
										style={{
											padding: "4px 3px",
											textAlign: "center",
											fontWeight: "600",
											fontSize: "9px",
											textTransform: "uppercase",
											borderBottom: "1px solid #e5e7eb",
										}}
									>
										Dec.
									</th>
									<th
										style={{
											padding: "4px 3px",
											textAlign: "right",
											fontWeight: "600",
											fontSize: "9px",
											textTransform: "uppercase",
											borderBottom: "1px solid #e5e7eb",
										}}
									>
										Total
									</th>
								</tr>
							</thead>
							<tbody>
								{order.products?.map((product, index) => (
									<tr
										key={product.productId}
										style={{
											backgroundColor: "#fffff",
										}}
									>
										<td
											style={{
												padding: "3px 3px",
												maxWidth: "220px",
												wordBreak: "break-word",
												borderBottom:
													index === (order.products?.length || 0) - 1
														? "none"
														: "1px solid #f1f5f9",
											}}
										>
											<div style={{ fontSize: "10px", fontWeight: "600" }}>
												{product.name || product.productId}
											</div>
											<div
												style={{
													fontSize: "8px",
													color: "#64748b",
													fontStyle: "italic",
													marginTop: "1px",
												}}
											>
												{product.name ? "Producto estándar" : "ID de producto"}
											</div>
										</td>
										<td
											style={{
												padding: "3px 3px",
												textAlign: "center",
												fontSize: "10px",
												borderBottom:
													index === (order.products?.length || 0) - 1
														? "none"
														: "1px solid #f1f5f9",
											}}
										>
											{currencyFormat.format(product.retailPrice)}
										</td>
										<td
											style={{
												padding: "12px 4px",
												textAlign: "center",
												fontSize: "11px",
												borderBottom:
													index === (order.products?.length || 0) - 1
														? "none"
														: "1px solid #f1f5f9",
											}}
										>
											{product.quantity}
										</td>
										<td
											style={{
												padding: "3px 3px",
												textAlign: "center",
												fontSize: "10px",
												borderBottom:
													index === (order.products?.length || 0) - 1
														? "none"
														: "1px solid #f1f5f9",
											}}
										>
											{(product.discount || 0) > 0
												? `${(((product.discount || 0) / (product.retailPrice * product.quantity)) * 100).toFixed(1)}%`
												: "0%"}
										</td>
										<td
											style={{
												padding: "3px 3px",
												textAlign: "right",
												fontSize: "10px",
												fontWeight: "600",
												borderBottom:
													index === (order.products?.length || 0) - 1
														? "none"
														: "1px solid #f1f5f9",
											}}
										>
											{currencyFormat.format(
												product.retailPrice * product.quantity -
													(product.discount || 0),
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							marginTop: "8px",
							width: "100%",
						}}
					>
						<div
							style={{
								minWidth: "0",
								width: "70%",
								backgroundColor: "white",
								padding: "8px",
								borderRadius: "4px",
								border: "1px solid #e9ecef",
								fontSize: "9px",
								marginTop: "2px",
								marginBottom: "2px",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									padding: "2px 0", // aún menos alto
									fontSize: "11px",
									fontWeight: 600,
								}}
							>
								<span>Subtotal:</span>
								<span>{currencyFormat.format(subtotal)}</span>
							</div>
							{(() => {
								const totalDiscount =
									order.products?.reduce(
										(acc, product) => acc + (product.discount || 0),
										0,
									) || 0;

								if (totalDiscount > 0) {
									return (
										<div
											style={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												padding: "0.5px 0",
												fontSize: "9px",
												color: "#059669",
												fontWeight: 600,
											}}
										>
											<span>Descuento:</span>
											<span>-{currencyFormat.format(totalDiscount)}</span>
										</div>
									);
								}
								return null;
							})()}
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									padding: "0.5px 0",
									fontSize: "9px",
									fontWeight: 600,
								}}
							>
								<span>ITBIS ({(TAX_PERCENTAGE * 100).toFixed(0)}%):</span>
								<span>{currencyFormat.format(subtotal * TAX_PERCENTAGE)}</span>
							</div>
							<div
								style={{
									borderTop: "2px solid #000",
									marginTop: "2px",
									paddingTop: "2px",
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										fontSize: "12px",
										fontWeight: "700",
									}}
								>
									<span>Total a Pagar:</span>
									<span>{currencyFormat.format(total)}</span>
								</div>
							</div>
							<div
								style={{
									marginTop: "4px",
									paddingTop: "4px",
									borderTop: "1px solid #dee2e6",
								}}
							>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										padding: "0.5px 0",
										fontSize: "9px",
										color: "#6c757d",
									}}
								>
									<span>Monto Pagado:</span>
									<span>{currencyFormat.format(totalPaid)}</span>
								</div>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										padding: "0.5px 0",
										fontSize: "10px",
										fontWeight: "700",
										color: remainingBalance > 0 ? "#dc3545" : "#059669",
									}}
								>
									<span>Saldo Pendiente:</span>
									<span>{currencyFormat.format(remainingBalance)}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
