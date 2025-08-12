import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, XIcon } from "lucide-react";
import { memo } from "react";
import { paymentMethodIcons, unknownPaymentMethod } from "@/config/orders";
import type { PaymentMethod } from "@/types/models/paymentHistory";
import type { OrderFilters } from "@/contexts/orders/types";
import { paymentMethods } from "@/contexts/paymentHistory/payment-method";

interface OrdersFilterBadgesProps {
	filters: OrderFilters;
	onRemoveFilter: (key: keyof OrderFilters) => void;
}

function OrdersFilterBadgesComponent({
	filters,
	onRemoveFilter,
}: OrdersFilterBadgesProps) {
	const hasActiveFilters = Object.values(filters).some(
		(val) => val !== undefined,
	);

	if (!hasActiveFilters) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{Object.entries(filters).map(([key, value]) => {
				if (value === undefined) return null;

				if (key === "date") {
					if (value instanceof Date) {
						return (
							<Badge key={key} variant="secondary" className="text-xs h-6">
								Fecha: {value.toLocaleDateString()}
								<Button
									variant="ghost"
									size="sm"
									className="size-4 p-0 ml-1"
									onClick={() => onRemoveFilter(key as keyof OrderFilters)}
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
									onClick={() => onRemoveFilter(key as keyof OrderFilters)}
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
						{key === "paymentMethod" && (
							<>
								Método de pago: {paymentMethodIcons[value as PaymentMethod]}
								{paymentMethods.find((method) => method.id === value)?.name ||
									unknownPaymentMethod}
							</>
						)}
						{key === "shippingAddress" && `Dirección: ${value}`}
						{key === "productId" &&
							`Producto: ${Array.isArray(value) ? value[0] : value}`}
						{key === "buyerId" && `Cliente: ${value}`}
						{key === "sellerId" && `Vendedor: ${value}`}
						{key === "orderId" && `Orden: ${value}`}
						{key === "cfSequence" && `CF: ${value}`}
						{key === "ncfSequence" && `NCF: ${value}`}
						<Button
							variant="ghost"
							size="sm"
							className="size-4 p-0 ml-1"
							onClick={() => onRemoveFilter(key as keyof OrderFilters)}
						>
							<XIcon className="h-2 w-2" />
						</Button>
					</Badge>
				);
			})}
		</div>
	);
}

export const OrderFilterBadges = memo(OrdersFilterBadgesComponent);
