import { Label } from "@/components/ui/label";
import { ProductCapacityUnitSelect } from "../ProductCapacityUnitSelect";
import type { ProductCapacityUnit } from "@/types/models/products";
import { memo } from "react";

interface CapacityUnitFilterProps {
	value: ProductCapacityUnit | undefined;
	onValueChange: (unit: string | undefined) => void;
}

function CapacityUnitFilterComponent({
	value,
	onValueChange,
}: CapacityUnitFilterProps) {
	return (
		<div className="flex flex-col gap-3">
			<Label htmlFor="capacity-unit">Unidad de capacidad</Label>
			<ProductCapacityUnitSelect
				name="capacity-unit"
				className="w-full"
				value={value}
				onValueChange={onValueChange}
			/>
		</div>
	);
}

export const CapacityUnitFilter = memo(CapacityUnitFilterComponent);
