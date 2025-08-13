import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { paymentMethodIcons, unknownPaymentMethodIcon } from "@/config/orders";
import { paymentMethods } from "@/contexts/paymentHistory/payment-method";
import { memo } from "react";

interface PaymentMethodFilterProps {
	value?: string | null;
	onValueChange?: (method?: string | null) => void;
}

function PaymentMethodFilterComponent({
	value,
	onValueChange,
}: PaymentMethodFilterProps) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor="paymentMethod">Método de Pago</Label>
			<Select
				value={value || ""}
				onValueChange={(val) => onValueChange?.(val === "" ? undefined : val)}
			>
				<SelectTrigger className="min-w-[180px] w-full">
					<SelectValue placeholder="Seleccionar método" />
				</SelectTrigger>
				<SelectContent>
					{paymentMethods.map((method) => (
						<SelectItem key={method.id} value={method.id}>
							{paymentMethodIcons[method.id] || unknownPaymentMethodIcon}
							{method.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export const PaymentMethodFilter = memo(PaymentMethodFilterComponent);
