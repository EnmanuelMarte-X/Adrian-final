import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	CalendarIcon,
	CreditCardIcon,
	DollarSignIcon,
	FileTextIcon,
	UserIcon,
	XIcon,
} from "lucide-react";
import { memo } from "react";
import type { PaymentHistoryFilters } from "@/contexts/paymentHistory/types";
import { getPaymentMethodName } from "@/contexts/paymentHistory/payment-method";

interface PaymentHistoryFilterBadgesProps {
	filters: PaymentHistoryFilters;
	onRemoveFilter: (key: keyof PaymentHistoryFilters) => void;
	fixedKeys?: (keyof PaymentHistoryFilters)[];
}

function PaymentHistoryFilterBadgesComponent({
	filters,
	onRemoveFilter,
	fixedKeys = [],
}: PaymentHistoryFilterBadgesProps) {
	const hasActiveFilters = Object.values(filters).some(
		(val) => val !== undefined,
	);

	if (!hasActiveFilters) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{Object.entries(filters).map(([key, value]) => {
				if (
					value === undefined ||
					fixedKeys.includes(key as keyof PaymentHistoryFilters)
				)
					return null;

				if (key === "date") {
					if (value instanceof Date) {
						return (
							<Badge key={key} variant="secondary" className="text-xs h-6">
								Fecha: {value.toLocaleDateString()}
								<Button
									variant="ghost"
									size="sm"
									className="size-4 p-0 ml-1"
									onClick={() =>
										onRemoveFilter(key as keyof PaymentHistoryFilters)
									}
								>
									<XIcon className="h-2 w-2" />
								</Button>
							</Badge>
						);
					}

					if (typeof value === "object" && "from" in value && "to" in value) {
						const fromDate = value.from
							? new Date(value.from).toLocaleDateString()
							: "";
						const toDate = value.to
							? new Date(value.to).toLocaleDateString()
							: "";

						return (
							<Badge key={key} variant="secondary" className="text-xs h-6">
								<CalendarIcon className="size-4" />
								Fecha:{" "}
								{fromDate && toDate
									? `${fromDate}-${toDate}`
									: fromDate || toDate}
								<Button
									variant="ghost"
									size="sm"
									className="size-4 p-0 ml-1"
									onClick={() =>
										onRemoveFilter(key as keyof PaymentHistoryFilters)
									}
								>
									<XIcon className="h-2 w-2" />
								</Button>
							</Badge>
						);
					}
					return null;
				}

				return (
					<Badge key={key} variant="secondary" className="text-xs h-6">
						{key === "orderId" && (
							<span className="inline-flex items-center gap-1 text-xs">
								<FileTextIcon className="size-3" />
								{`Factura: ${value}`}
							</span>
						)}
						{key === "clientId" && (
							<span className="inline-flex items-center gap-1 text-xs">
								<UserIcon className="size-3" />
								{`Cliente: ${value}`}
							</span>
						)}
						{key === "method" && (
							<span className="inline-flex items-center gap-1 text-xs">
								<CreditCardIcon className="size-3" />
								{`Método: ${getPaymentMethodName(value as string)}`}
							</span>
						)}
						{key === "amount" && Array.isArray(value) && (
							<span className="inline-flex items-center gap-1 text-xs">
								<DollarSignIcon className="size-3" />
								{`Monto: $${value[0]} - $${value[1]}`}
							</span>
						)}
						{key === "startDate" && (
							<span className="inline-flex items-center gap-1 text-xs">
								<CalendarIcon className="size-3" />
								{`Desde: ${new Date(value as string).toLocaleDateString()}`}
							</span>
						)}
						{key === "endDate" && (
							<span className="inline-flex items-center gap-1 text-xs">
								<CalendarIcon className="size-3" />
								{`Hasta: ${new Date(value as string).toLocaleDateString()}`}
							</span>
						)}
						{![
							"orderId",
							"clientId",
							"method",
							"amount",
							"startDate",
							"endDate",
						].includes(key) && (
							<span className="inline-flex items-center gap-1 text-xs capitalize">
								<FileTextIcon className="size-3" />
								{`${key}: ${value}`}
							</span>
						)}
						{!fixedKeys.includes(key as keyof PaymentHistoryFilters) && (
							<Button
								variant="ghost"
								size="sm"
								className="size-4 p-0 ml-1"
								onClick={() =>
									onRemoveFilter(key as keyof PaymentHistoryFilters)
								}
							>
								<XIcon className="h-2 w-2" />
							</Button>
						)}
					</Badge>
				);
			})}
		</div>
	);
}

export const PaymentHistoryFilterBadges = memo(
	PaymentHistoryFilterBadgesComponent,
);
