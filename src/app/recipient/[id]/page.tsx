"use client";

import { CreditOrderReceipt } from "@/components/dashboard/orders/CreditOrderReceipt";
import { OrderReceipt } from "@/components/dashboard/orders/OrderReceipt";
import { TAX_PERCENTAGE } from "@/config/shop";
import { useOrderById } from "@/contexts/orders/queries";
import { use, useEffect } from "react";
import { toast } from "sonner";

export default function OrderSlugRecipientPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: orderId } = use(params);
	const { data: order, isError, isLoading } = useOrderById(orderId);

	useEffect(() => {
		if (order && !isLoading && !isError) {
			const timer = setTimeout(() => {
				toast.info(
					"Para una impresión limpia, desactive 'Headers y footers' en las opciones de impresión del navegador.",
					{
						duration: 4000,
					},
				);
				window.print();
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [order, isLoading, isError]);

	if (isError || !order) {
		return null;
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
		<>
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

			<style jsx global>{`
				@media print {
					@page {
						margin: 0.4in;
						size: letter portrait;
						/* Ocultar headers y footers del navegador */
						margin-top: 0;
						margin-bottom: 0;
					}
					
					/* Ocultar headers y footers automáticos del navegador */
					@page :first {
						margin-top: 0;
					}
					
					@page :left {
						margin-left: 0.4in;
						margin-right: 0.4in;
					}
					
					@page :right {
						margin-left: 0.4in;
						margin-right: 0.4in;
					}
					
					body {
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
						margin: 0 !important;
						padding: 0 !important;
					}
					
					* {
						visibility: hidden;
					}
					
					#order-receipt,
					#order-receipt * {
						visibility: visible;
					}
					
					#order-receipt {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						background: white !important;
						box-shadow: none !important;
						margin: 0 !important;
						padding: 0 !important;
					}
				}
				
				@media screen {
					body {
						margin: 0;
						padding: 0;
						background: white;
					}
				}
			`}</style>
		</>
	);
}
