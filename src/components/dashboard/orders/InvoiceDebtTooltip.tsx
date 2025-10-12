"use client";

import { usePaymentHistoryByOrderId } from "@/contexts/paymentHistory/queries";
import type { OrderType } from "@/types/models/orders";
import { calculateInvoiceOwing, calculateInvoiceTotal, calculateTotalPaid, getInvoicePaymentStatus } from "@/lib/invoice-utils";
import { currencyFormat } from "@/config/formats";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

interface InvoiceDebtTooltipProps {
	order: OrderType;
	children: React.ReactNode;
}

export function InvoiceDebtTooltipContent({ order }: { order: OrderType }) {
	const { data: payments = [], isLoading } = usePaymentHistoryByOrderId(order._id || "");
	
	if (isLoading) {
		return (
			<div className="flex items-center gap-2 text-sm text-black">
				<div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent"></div>
				Cargando...
			</div>
		);
	}
	
	const total = calculateInvoiceTotal(order);
	const totalPaid = calculateTotalPaid(payments);
	const owing = calculateInvoiceOwing(order, payments);
	
	return (
		<div className="space-y-2 text-black">
			{/* Header */}
			<div className="text-center">
				<div className="font-semibold text-sm text-black">Factura #{order.orderId}</div>
			</div>
			
			{/* Amounts */}
			<div className="space-y-1 text-xs">
				<div className="flex justify-between items-center">
					<span className="text-black">Total:</span>
					<span className="font-semibold text-black">{currencyFormat.format(total)}</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="text-black">Pagado:</span>
					<span className="font-semibold text-black">{currencyFormat.format(totalPaid)}</span>
				</div>
				<div className="flex justify-between items-center">
					<span className="font-medium text-black">Pendiente:</span>
					<span className={`font-bold text-sm ${owing > 0 ? 'text-red-600' : 'text-black'}`}>
						{currencyFormat.format(owing)}
					</span>
				</div>
			</div>
			
			{/* Footer */}
			<div className="text-center pt-1">
				<span className="text-xs text-black">
					{payments.length} pago{payments.length !== 1 ? 's' : ''} registrado{payments.length !== 1 ? 's' : ''}
				</span>
			</div>
		</div>
	);
}