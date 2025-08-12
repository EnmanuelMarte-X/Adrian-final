import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { memo } from "react";

interface CapacityFilterProps {
	value: number | undefined;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function CapacityFilterComponent({ value, onChange }: CapacityFilterProps) {
	return (
		<div className="flex flex-col gap-3">
			<Label htmlFor="capacity">Capacidad</Label>
			<Input
				id="capacity"
				placeholder="100"
				type="number"
				value={value || ""}
				onChange={onChange}
			/>
		</div>
	);
}

export const CapacityFilter = memo(CapacityFilterComponent);
