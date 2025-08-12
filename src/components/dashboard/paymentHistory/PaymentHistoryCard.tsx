import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { currencyFormat, dateFormat } from "@/config/formats";
import {
	paymentMethodIcons,
	unknownPaymentMethod,
	unknownPaymentMethodIcon,
} from "@/config/orders";
import { paymentMethods } from "@/contexts/paymentHistory/payment-method";
import { cn, getInitials } from "@/lib/utils";
import type { PaymentMethod } from "@/types/models/paymentHistory";
import type { PaymentHistoryType } from "@/types/models/paymentHistory";
import { Building2, CreditCard, DollarSign } from "lucide-react";
import Link from "next/link";

export const getPaymentMethodColor = (method: string) => {
	const colors = {
		credit_card: "bg-blue-600 text-white border-blue-600",
		bank_transfer: "bg-yellow-600 text-white border-yellow-600",
		cash: "bg-success/90 text-success-foreground",
	};
	return (
		colors[method as keyof typeof colors] ||
		"bg-muted/60 text-muted-foreground border-muted"
	);
};

export const getPaymentMethodIcon = (method: string) => {
	const icons = {
		credit_card: <CreditCard className="size-4" />,
		bank_transfer: <Building2 className="size-4" />,
		cash: <DollarSign className="size-4" />,
	};
	return (
		icons[method as keyof typeof icons] || <CreditCard className="size-4" />
	);
};

export function PaymentHistoryCard({
	payment,
}: { payment: PaymentHistoryType }) {
	const client = payment.clientId;
	const clientName = typeof client === "string" ? "Cliente" : client?.name;
	const clientId = typeof client === "string" ? client : client?._id;

	const order = payment.orderId;
	const orderId = typeof order === "string" ? order : order?.orderId;
	const orderObjectId = typeof order === "string" ? order : order?._id;

	return (
		<div className="rounded-lg border bg-card p-4 space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
						<AvatarFallback className="text-xs">
							{getInitials(clientName || "Cliente")}
						</AvatarFallback>
					</Avatar>
					<div>
						<Link
							href={`/dashboard/clients/${clientId}`}
							className="font-medium text-foreground hover:text-primary hover:underline"
						>
							{clientName || "Cliente desconocido"}
						</Link>
					</div>
				</div>
				<div className="text-right">
					<div className="font-semibold text-lg">
						{currencyFormat.format(payment.amount)}
					</div>
					<div className="text-xs text-muted-foreground">
						{dateFormat(payment.date)}
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<Link
					href={`/dashboard/orders/${orderObjectId || orderId}`}
					className="text-sm text-primary hover:underline"
				>
					Orden #{orderId || orderObjectId}
				</Link>

				<Badge
					variant="outline"
					className={cn(
						"flex items-center gap-1",
						getPaymentMethodColor(payment.method),
					)}
				>
					{paymentMethodIcons[payment.method as PaymentMethod] ||
						unknownPaymentMethodIcon}
					<span>
						{paymentMethods.find((m) => m.id === payment.method)?.name ||
							unknownPaymentMethod}
					</span>
				</Badge>
			</div>
		</div>
	);
}
