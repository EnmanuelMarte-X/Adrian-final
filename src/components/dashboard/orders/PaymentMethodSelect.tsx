import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { paymentMethods } from "@/contexts/paymentHistory/payment-method";
import type { SelectProps } from "@radix-ui/react-select";

export interface PaymentMethodSelectProps
	extends Omit<SelectProps, "children"> {
	className?: string;
}

export function PaymentMethodSelect({
	className,
	...props
}: PaymentMethodSelectProps) {
	return (
		<Select {...props}>
			<SelectTrigger className={className}>
				<SelectValue placeholder="Seleccionar método de pago" />
			</SelectTrigger>
			<SelectContent>
				{paymentMethods.map((method) => (
					<SelectItem key={method.id} value={method.id}>
						{method.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
