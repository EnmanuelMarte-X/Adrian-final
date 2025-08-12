import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { paymentMethods } from "@/contexts/paymentHistory/payment-method";
import type { SelectProps } from "@radix-ui/react-select";

export interface OrderPaymentMethodFilterProps
	extends Omit<SelectProps, "children"> {}

export function OrderPaymentMethodFilter({
	value = "",
	...props
}: OrderPaymentMethodFilterProps) {
	return (
		<Select value={value} {...props}>
			<SelectTrigger>
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
