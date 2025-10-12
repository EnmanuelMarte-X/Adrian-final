"use client";

import { usePaymentHistoryByOrderId } from "@/contexts/paymentHistory/queries";
import type { OrderType } from "@/types/models/orders";
import { calculateInvoiceOwing, calculateInvoiceTotal, calculateTotalPaid, getInvoicePaymentStatus } from "@/lib/invoice-utils";
import { currencyFormat } from "@/config/formats";
import { BanknoteIcon, CoinsIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InvoiceDebtTooltipContent } from "./InvoiceDebtTooltip";
import { cn } from "@/lib/utils";

interface InvoiceTotalWithTooltipProps {
	order: OrderType;
	total: number;
}

export function InvoiceTotalWithTooltip({ order, total }: InvoiceTotalWithTooltipProps) {
	const { data: payments = [] } = usePaymentHistoryByOrderId(order._id || "");
	const paymentStatus = getInvoicePaymentStatus(order, payments);
	
	// Determinar el color del icono basado en el estado de pago
	const getIconColor = () => {
		switch (paymentStatus) {
			case "paid":
				return "text-green-600"; // Verde cuando está completamente pagado (cash y credit)
			case "partial":
				return "text-yellow-600"; // Amarillo cuando tiene pagos parciales (solo credit)
			case "unpaid":
				return "text-red-600"; // Rojo cuando no se ha pagado nada (solo credit)
			default:
				return "text-gray-600";
		}
	};
	
	const iconColor = getIconColor();
	
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button 
					className={cn(
						"cursor-help inline-flex items-center hover:bg-muted/50 px-2 py-1 rounded",
						"active:bg-muted/70 transition-colors", // Para móvil
						"focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
					)}
					type="button"
				>
					{order.isCredit ? (
						<CoinsIcon className={cn("size-4 inline mr-1", iconColor)} />
					) : (
						<BanknoteIcon className={cn("size-4 inline mr-1", iconColor)} />
					)}
					{currencyFormat.format(total)}
				</button>
			</TooltipTrigger>
			<TooltipContent 
				side="left" 
				className="p-0 border-0 bg-transparent shadow-none"
				sideOffset={5}
			>
				<div className="bg-green-400 border border-green-500 rounded-md shadow-md p-3 w-[180px]">
					<InvoiceDebtTooltipContent order={order} />
				</div>
			</TooltipContent>
		</Tooltip>
	);
}