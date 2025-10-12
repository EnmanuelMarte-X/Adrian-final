"use client";

import { usePaymentHistoryByOrderId } from "@/contexts/paymentHistory/queries";
import type { OrderType } from "@/types/models/orders";
import { getInvoicePaymentStatus } from "@/lib/invoice-utils";
import { currencyFormat } from "@/config/formats";
import { BanknoteIcon, CoinsIcon } from "lucide-react";

interface InvoiceTotalCellProps {
	order: OrderType;
	total: number;
}

export function InvoiceTotalCell({ order, total }: InvoiceTotalCellProps) {
	const { data: payments = [] } = usePaymentHistoryByOrderId(order._id || "");
	const paymentStatus = getInvoicePaymentStatus(order, payments);
	
	// Determinar el color del indicador basado en el estado de pago
	const getStatusColor = () => {
		if (!order.isCredit) return "text-success-foreground"; // Contado siempre verde
		
		switch (paymentStatus) {
			case "paid":
				return "text-success-foreground";
			case "partial":
				return "text-yellow-600";
			case "unpaid":
				return "text-destructive-foreground";
			default:
				return "text-muted-foreground";
		}
	};
	
	return (
		<div className="cursor-help inline-flex items-center">
			{order.isCredit ? (
				<CoinsIcon className={`size-4 inline mr-1 ${getStatusColor()}`} />
			) : (
				<BanknoteIcon className={`size-4 inline mr-1 ${getStatusColor()}`} />
			)}
			{currencyFormat.format(total)}
		</div>
	);
}