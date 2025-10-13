import { currencyFormat, dateFormat } from "@/config/formats";
import {
	paymentMethodIcons,
	unknownPaymentMethod,
	unknownPaymentMethodIcon,
} from "@/config/orders";
import { paymentMethods } from "@/contexts/paymentHistory/payment-method";
import type { PaymentMethod } from "@/types/models/paymentHistory";
import type { PaymentHistoryType } from "@/types/models/paymentHistory";
import { CalendarIcon } from "lucide-react";
import { PaymentHistoryActions } from "./PaymentHistoryActions";
import { getFirstNameAndLastInitial } from "@/lib/utils";

export function PaymentHistoryCard({
	payment,
}: { payment: PaymentHistoryType }) {
	const client = payment.clientId;
	const clientName = typeof client === "string" ? "Cliente" : client?.name;

	const order = payment.orderId;
	const orderId = typeof order === "string" ? order : order?.orderId;

	const paymentMethod = paymentMethods.find((m) => m.id === payment.method);
	const paymentMethodName = paymentMethod?.name || unknownPaymentMethod;
	const paymentMethodIcon =
		paymentMethodIcons[payment.method as PaymentMethod] ||
		unknownPaymentMethodIcon;

	const paymentId = payment._id || "unknown";

	return (
		<PaymentHistoryActions
			paymentHistory={payment}
			trigger={
				<button
					type="button"
					className="flex flex-col p-4 gap-y-4 bg-secondary rounded-lg shadow-md max-w-sm focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-20 transition-transform transform aria-pressed:scale-95"
				>
					<div className="inline-flex justify-between gap-x-2">
						<div className="flex flex-col gap-y-2 items-start">
							<h3 className="font-medium">
								{`${getFirstNameAndLastInitial(clientName) || "Cliente"} - Factura #${orderId}`}
							</h3>
							<span className="text-muted-foreground max-w-[10ch] truncate">
								{paymentId}
							</span>
						</div>
						<div className="flex flex-col items-end gap-y-2">
							<span className="text-md font-semibold text-foreground">
								{currencyFormat.format(payment.amount)}
							</span>
							<div className="inline-flex gap-x-1 items-center text-[.8rem] text-muted-foreground">
								{paymentMethodIcon}
								<span className="text-xs">{paymentMethodName}</span>
							</div>
						</div>
					</div>
					<div className="flex gap-3 mt-3">
						<div className="inline-flex items-center text-muted-foreground gap-x-1">
							<CalendarIcon className="size-3" />
							<p className="text-xs font-medium">{dateFormat(payment.date)}</p>
						</div>
					</div>
				</button>
			}
		/>
	);
}
