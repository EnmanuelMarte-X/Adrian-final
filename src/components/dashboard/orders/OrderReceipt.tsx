import { dateFormat, currencyFormat, nameFormat } from "@/config/formats";
import { TAX_PERCENTAGE } from "@/config/shop";
import Barcode from "react-barcode";
import type { OrderTypeWithProducts } from "@/types/models/orders";
import { Spinner } from "@/components/ui/spinner";
import { formatNationalId, getUnsetValue, isValidObjectId } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { documentTypeLabels } from "@/contexts/clients/document-types";
import { siteConfig } from "@/config";

interface OrderReceiptProps {
	order: OrderTypeWithProducts | undefined;
	subtotal: number;
	total: number;
	isLoading?: boolean;
}

export function OrderReceipt({
	order,
	subtotal,
	total,
	isLoading,
}: OrderReceiptProps) {
	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "200px",
					gap: "10px",
					color: "#000",
				}}
			>
				<Spinner style={{ fontSize: "20px" }} />
				<span style={{ fontSize: "12px", fontWeight: "600" }}>Cargando...</span>
			</div>
		);
	}

	if (!order) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: "200px",
					fontSize: "12px",
					color: "#666",
				}}
			>
				Factura no encontrada
			</div>
		);
	}

	return (
		<div
			id="order-receipt"
			style={{
				backgroundColor: "white",
				color: "black",
				fontFamily: "Arial, sans-serif",
				fontSize: "11px",
				lineHeight: "1.3",
				maxWidth: "450px",
				margin: "20px auto",
				padding: "20px",
			}}
		>
			<div style={{ textAlign: "center", marginBottom: "16px" }}>
				<Logo width={128} height={128} className="mx-auto mb-2 size-10" />
				<div
					style={{
						fontSize: "14px",
						fontWeight: "bold",
						textTransform: "uppercase",
					}}
				>
					JHENSON SUPPLY
				</div>
				<div style={{ fontSize: "11px", fontWeight: "bold", marginTop: "6px" }}>
					FACTURA #{order.orderId}
				</div>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "1fr 1fr",
					gap: "12px",
					marginBottom: "16px",
				}}
			>
				<div style={{ textAlign: "start" }}>
					<div
						style={{
							fontSize: "11px",
							fontWeight: "bold",
							textTransform: "uppercase",
							marginBottom: "3px",
						}}
					>
						CLIENTE:
					</div>
					<div style={{ fontSize: "10px" }}>
						{(() => {
							if (typeof order.buyerId === "string") {
								return order.buyerId;
							}
							if (!order.buyerId) {
								return "No disponible";
							}
							return (
								<>
									<div>{nameFormat(order.buyerId.name)}</div>
									<div>
										{documentTypeLabels[order.buyerId.documentType]}:{" "}
										{formatNationalId(order.buyerId.documentNumber)}
									</div>
								</>
							);
						})()}
					</div>
				</div>

				<div style={{ textAlign: "end" }}>
					<div
						style={{
							fontSize: "11px",
							fontWeight: "bold",
							textTransform: "uppercase",
							marginBottom: "3px",
						}}
					>
						EMPLEADO:
					</div>
					<div style={{ fontSize: "10px" }}>
						{(() => {
							if (typeof order.sellerId === "string") {
								return order.sellerId;
							}
							if (!order.sellerId) {
								return "No disponible";
							}
							return getUnsetValue(
								`${order.sellerId.firstName} ${order.sellerId.lastName}`,
								"Nombre no disponible",
							);
						})()}
					</div>
				</div>

				<div style={{ textAlign: "start" }}>
					<div
						style={{
							fontSize: "11px",
							fontWeight: "bold",
							textTransform: "uppercase",
							marginBottom: "3px",
						}}
					>
						FECHA:
					</div>
					<div style={{ fontSize: "10px" }}>
						{dateFormat(new Date(order.date), "dd/MM/yyyy")}
					</div>
				</div>

				<div style={{ textAlign: "end" }}>
					{order.cfSequence && (
						<>
							<div
								style={{
									fontSize: "10px",
									fontWeight: "bold",
									textTransform: "uppercase",
									marginBottom: "3px",
								}}
							>
								NUM. CONSUMIDOR FINAL:
							</div>
							<div style={{ fontSize: "10px" }}>
								{siteConfig.invoicing.cfPrefix}
								{String(order.cfSequence).padStart(8, "0")}
							</div>
						</>
					)}
					{order.ncfSequence && (
						<>
							<div
								style={{
									fontSize: "10px",
									fontWeight: "bold",
									textTransform: "uppercase",
									marginBottom: "3px",
								}}
							>
								NUM. DE COMPROBANTE FISCAL:
							</div>
							<div style={{ fontSize: "10px" }}>
								{siteConfig.invoicing.ncfPrefix}
								{String(order.ncfSequence).padStart(8, "0")}
							</div>
						</>
					)}
				</div>
			</div>

			<div style={{ marginBottom: "16px" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						fontSize: "12px",
						marginBottom: "4px",
					}}
				>
					<span style={{ fontWeight: "600" }}>PRODUCTOS</span>
				</div>
				<table
					style={{
						width: "100%",
						borderCollapse: "collapse",
						borderBottom: "1px solid #333",
					}}
				>
					<thead>
						<tr>
							<th
								style={{
									borderBottom: "1px solid #333",
									fontSize: "10px",
									fontWeight: "bold",
									textAlign: "left",
								}}
							>
								PRODUCTO
							</th>
							<th
								style={{
									borderBottom: "1px solid #333",
									padding: "4px",
									fontSize: "10px",
									fontWeight: "bold",
									textAlign: "center",
								}}
							>
								CANT.
							</th>
							<th
								style={{
									borderBottom: "1px solid #333",
									padding: "4px",
									fontSize: "10px",
									fontWeight: "bold",
									textAlign: "right",
								}}
							>
								PRECIO
							</th>
							<th
								style={{
									borderBottom: "1px solid #333",
									padding: "4px",
									fontSize: "10px",
									fontWeight: "bold",
									textAlign: "right",
								}}
							>
								DESC.
							</th>
							<th
								style={{
									borderBottom: "1px solid #333",
									padding: "4px",
									fontSize: "10px",
									fontWeight: "bold",
									textAlign: "right",
								}}
							>
								TOTAL
							</th>
						</tr>
					</thead>
					<tbody>
						{order.products?.map((product, index) => {
							const isLastProduct = index === (order.products?.length || 0) - 1;
							return (
								<tr key={product.productId}>
									<td
										style={{
											borderBottom: isLastProduct
												? "none"
												: "1px solid #e0e0e0",
											padding: "4px",
											fontSize: "10px",
										}}
									>
										{product.name || product.productId}
									</td>
									<td
										style={{
											borderBottom: isLastProduct
												? "none"
												: "1px solid #e0e0e0",
											padding: "4px",
											fontSize: "10px",
											textAlign: "center",
										}}
									>
										{product.quantity}
									</td>
									<td
										style={{
											borderBottom: isLastProduct
												? "none"
												: "1px solid #e0e0e0",
											padding: "4px",
											fontSize: "10px",
											textAlign: "right",
										}}
									>
										{currencyFormat.format(product.retailPrice)}
									</td>
									<td
										style={{
											borderBottom: isLastProduct
												? "none"
												: "1px solid #e0e0e0",
											padding: "4px",
											fontSize: "10px",
											textAlign: "right",
										}}
									>
										{currencyFormat.format(product.discount || 0)}
									</td>
									<td
										style={{
											borderBottom: isLastProduct
												? "none"
												: "1px solid #e0e0e0",
											padding: "4px",
											fontSize: "10px",
											textAlign: "right",
											fontWeight: "600",
										}}
									>
										{currencyFormat.format(
											product.retailPrice * product.quantity -
												(product.discount || 0),
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<div style={{ marginBottom: "16px" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						fontSize: "11px",
						marginBottom: "4px",
					}}
				>
					<span style={{ fontWeight: "600" }}>SUBTOTAL:</span>
					<span style={{ fontWeight: "600" }}>
						{currencyFormat.format(subtotal)}
					</span>
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						fontSize: "12px",
						marginBottom: "4px",
					}}
				>
					<span style={{ fontWeight: "600" }}>
						ITBIS ({(TAX_PERCENTAGE * 100).toFixed(0)}%):
					</span>
					<span style={{ fontWeight: "600" }}>
						{currencyFormat.format(subtotal * TAX_PERCENTAGE)}
					</span>
				</div>

				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						fontSize: "13px",
						fontWeight: "bold",
						paddingTop: "6px",
						borderTop: "1px solid #333",
					}}
				>
					<span>TOTAL:</span>
					<span>{currencyFormat.format(total)}</span>
				</div>
			</div>

			{isValidObjectId(order._id) && (
				<div
					style={{
						textAlign: "center",
						marginBottom: "16px",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<div
						style={{
							fontSize: "11px",
							fontWeight: "bold",
							marginBottom: "8px",
							textTransform: "uppercase",
						}}
					>
						CÓDIGO DE IDENTIFICACIÓN
					</div>
					<div style={{ display: "flex", justifyContent: "center" }}>
						<Barcode
							value={String(order._id)}
							format="CODE128B"
							width={1.4}
							height={80}
							fontSize={12}
							margin={5}
						/>
					</div>
				</div>
			)}

			<div
				style={{
					textAlign: "center",
					fontSize: "12px",
					color: "#666",
				}}
			>
				<div
					style={{
						textTransform: "uppercase",
						marginBottom: "6px",
					}}
				>
					GRACIAS POR SU COMPRA
				</div>

				<div style={{ lineHeight: "1.2" }}>
					<div style={{ fontWeight: "bold", marginBottom: "2px" }}>
						RNC: 132145399
					</div>
					<div style={{ marginBottom: "2px" }}>
						Email: info@jhensonsupply.com
					</div>
					<div style={{ marginBottom: "2px" }}>Tel: (849) 863-6444</div>
					<div>Ubicación: Av. Principal #123, Santo Domingo, R.D.</div>
				</div>
			</div>
		</div>
	);
}
