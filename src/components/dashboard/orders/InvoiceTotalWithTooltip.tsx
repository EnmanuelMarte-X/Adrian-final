"use client";

import { usePaymentHistoryByOrderId } from "@/contexts/paymentHistory/queries";
import type { OrderType } from "@/types/models/orders";
import { getInvoicePaymentStatus } from "@/lib/invoice-utils";
import { currencyFormat } from "@/config/formats";
import { BanknoteIcon, CoinsIcon } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { InvoiceDebtTooltipContent } from "./InvoiceDebtTooltip";
import { cn } from "@/lib/utils";

interface InvoiceTotalWithTooltipProps {
	order: OrderType;
	total: number;
}

export function InvoiceTotalWithTooltip({
	order,
	total,
}: InvoiceTotalWithTooltipProps) {
	const { data: payments = [] } = usePaymentHistoryByOrderId(order._id || "");
	const paymentStatus = getInvoicePaymentStatus(order, payments);

	const getIconColor = () => {
		switch (paymentStatus) {
			case "paid":
				return "text-success";
			case "partial":
				return "text-warning";
			case "unpaid":
				return "text-destructive";
			default:
				return "text-muted";
		}
	};

	const iconColor = getIconColor();

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					className={cn(
						"cursor-help"
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
			<TooltipContent  side="left" sideOffset={5}>
				<InvoiceDebtTooltipContent order={order} />
			</TooltipContent>
		</Tooltip>
	);
}
