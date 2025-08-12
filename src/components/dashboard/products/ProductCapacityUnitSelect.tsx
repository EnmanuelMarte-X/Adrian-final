import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { productCapacityUnits } from "@/contexts/products/units";
import { cn } from "@/lib/utils";
import type { SelectProps } from "@radix-ui/react-select";

export interface ProductCapacityUnitSelectProps
	extends Omit<SelectProps, "children"> {
	className?: string;
}

export function ProductCapacityUnitSelect({
	className,
	...props
}: ProductCapacityUnitSelectProps) {
	return (
		<Select {...props}>
			<SelectTrigger className={cn("capitalize", className)}>
				<SelectValue placeholder="Selecciona unidad" />
			</SelectTrigger>
			<SelectContent>
				{productCapacityUnits.map((unit) => (
					<SelectItem key={unit} value={unit} className={"capitalize"}>
						{unit === "count" ? "Unidades" : unit}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
