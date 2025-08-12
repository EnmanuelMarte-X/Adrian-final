import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PackageCheckIcon, PackageMinusIcon } from "lucide-react";
import { memo } from "react";

interface StockFilterProps {
	value: number | undefined;
	onChange: (values: string[]) => void;
}

function StockFilterComponent({ value, onChange }: StockFilterProps) {
	return (
		<div className="flex flex-col gap-3">
			<Label htmlFor="stock-filter">Disponibilidad de stock</Label>
			<ToggleGroup
				id="stock-filter"
				value={
					value === undefined ? [] : value === 1 ? ["stock"] : ["no-stock"]
				}
				onValueChange={onChange}
				type="multiple"
				className="w-full border border-muted bg-sidebar"
			>
				<ToggleGroupItem
					className="hover:text-foreground"
					value="no-stock"
					aria-label="Toggle show no stock"
				>
					<PackageMinusIcon className="ml-1 size-4" /> No disponible
				</ToggleGroupItem>
				<ToggleGroupItem
					className="border-l hover:text-foreground"
					value="stock"
					aria-label="Toggle show stock"
				>
					<PackageCheckIcon className="ml-1 size-4" /> Disponible
				</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}

export const StockFilter = memo(StockFilterComponent);
