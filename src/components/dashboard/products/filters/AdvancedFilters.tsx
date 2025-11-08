import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { ProductFilters } from "@/contexts/products/types";
import { FilterIcon, XIcon } from "lucide-react";
import { memo } from "react";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { StockFilter } from "./StockFilter";
import { ShowInStoreFilter } from "./ShowInStoreFilter";
import { CapacityFilter } from "./CapacityFilter";
import { CapacityUnitFilter } from "./CapacityUnitFilter";
import type { ProductCapacityUnit } from "@/types/models/products";
import type { UseQueryStateReturn } from "nuqs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AdvancedFiltersProps {
	filters: ProductFilters;
	onClearFilters: () => void;
	updateFilter: <T, K>(
		value: T | undefined,
		urlSetter: UseQueryStateReturn<T, K>[1],
	) => Promise<void>;
	onStockChange: (values: string[]) => void;
	onInStoreChange?: (values: string[]) => void;
	onCostRangeChange: (range: [number, number]) => void;
	onCapacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onCapacityUnitChange: (unit: string | undefined) => void;
	costRange: [number, number];
}

function AdvancedFiltersComponent({
	filters,
	onClearFilters,
	onStockChange,
	onInStoreChange,
	onCostRangeChange,
	onCapacityChange,
	onCapacityUnitChange,
	costRange,
}: AdvancedFiltersProps) {
	const hasActiveFilters = Object.values(filters).some(
		(val) => val !== undefined,
	);

	const advancedFilterCount = Object.keys(filters).filter(
		(k) =>
			filters[k as keyof ProductFilters] !== undefined &&
			!["name", "brand", "category"].includes(k),
	).length;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="size-9 min-h-9 min-w-9 relative" variant="outline">
					<FilterIcon />
					{hasActiveFilters && advancedFilterCount > 0 && (
						<Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
							{advancedFilterCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<header className="flex flex-col gap-y-2 mb-5">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-bold">Filtros avanzados</h2>
						{hasActiveFilters && (
							<Button
								variant="ghost"
								size="sm"
								onClick={onClearFilters}
								className="h-8 px-2 max-w-[15ch]"
							>
								<XIcon className="size-4" /> Limpiar
							</Button>
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						Filtra por rango o valor para encontrar los productos.
					</p>
				</header>
				<div className="flex flex-col gap-y-4 w-full">
					<StockFilter value={filters.stock} onChange={onStockChange} />

					<PriceRangeFilter
						initialRange={costRange}
						onRangeChange={onCostRangeChange}
					/>

					<CapacityFilter
						value={filters.capacity}
						onChange={onCapacityChange}
					/>

					<CapacityUnitFilter
						value={filters.capacityUnit as ProductCapacityUnit | undefined}
						onValueChange={onCapacityUnitChange}
					/>

					<ShowInStoreFilter
						value={filters.inStore}
						onChange={(values) => onInStoreChange?.(values)}
					/>

					{filters.storageId && (
						<div className="flex flex-col gap-y-2 opacity-50">
							<Label htmlFor="storageId">Id del Almacén:</Label>
							<Input
								readOnly
								name="storageId"
								type="text"
								value={filters.storageId}
							/>
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

export const AdvancedFilters = memo(AdvancedFiltersComponent);
