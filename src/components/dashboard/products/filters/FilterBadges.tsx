import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	BoxesIcon,
	DollarSignIcon,
	PackageIcon,
	PackageMinusIcon,
	PackagePlusIcon,
	TextCursorInputIcon,
	XIcon,
} from "lucide-react";
import { memo } from "react";
import type { ProductFilters } from "@/contexts/products/types";

interface FilterBadgesProps {
	filters: ProductFilters;
	onRemoveFilter: (key: keyof ProductFilters) => void;
	fixedKeys?: (keyof ProductFilters)[];
}

function FilterBadgesComponent({
	filters,
	onRemoveFilter,
	fixedKeys = [],
}: FilterBadgesProps) {
	const hasActiveFilters = Object.values(filters).some(
		(val) => val !== undefined,
	);

	if (!hasActiveFilters) return null;

	return (
		<div className="flex flex-wrap gap-2">
			{Object.entries(filters).map(([key, value]) => {
				if (
					value === undefined ||
					fixedKeys.includes(key as keyof ProductFilters)
				)
					return null;
				return (
					<Badge key={key} variant="secondary" className="text-xs h-6">
						{key === "name" && (
							<span className="inline-flex items-center gap-1 text-xs">
								<TextCursorInputIcon className="size-3" />
								{`Nombre: ${value}`}
							</span>
						)}
						{key === "brand" && (
							<span className="inline-flex items-center gap-1 text-xs">
								<TextCursorInputIcon className="size-3" />
								{`Marca: ${value}`}
							</span>
						)}
						{key === "category" && (
							<span className="inline-flex items-center gap-1 text-xs">
								<TextCursorInputIcon className="size-3" />
								{`Categoría: ${value}`}
							</span>
						)}
						{key === "capacity" && (
							<span className="inline-flex items-center gap-1 text-xs">
								<BoxesIcon className="size-3" />
								{`Capacidad: ${value}`}
							</span>
						)}
						{key === "capacityUnit" && (
							<span className="inline-flex items-center gap-1 text-xs capitalize">
								<PackageIcon className="size-3" />
								{`Unidad: ${value}`}
							</span>
						)}
						{key === "stock" && (
							<span className="inline-flex items-center gap-1 text-xs">
								{value === 1 ? (
									<PackagePlusIcon className="size-3" />
								) : (
									<PackageMinusIcon className="size-3" />
								)}
								{`Disponibilidad: ${value === 1 ? "En stock" : "Fuera de stock"}`}
							</span>
						)}
						{key === "cost" && (
							<span className="inline-flex items-center gap-1 text-xs">
								<DollarSignIcon className="size-3" />
								{`Costo: $${value[0]} - $${value[1]}`}
							</span>
						)}
						{/* Caso para keys no definidas */}
						{![
							"name",
							"brand",
							"category",
							"capacity",
							"capacityUnit",
							"stock",
							"cost",
						].includes(key) && (
							<span className="inline-flex items-center gap-1 text-xs capitalize">
								<PackageIcon className="size-3" />
								{`${key}: ${value}`}
							</span>
						)}
						{!fixedKeys.includes(key as keyof ProductFilters) && (
							<Button
								variant="ghost"
								size="sm"
								className="size-4 p-0 ml-1"
								onClick={() => onRemoveFilter(key as keyof ProductFilters)}
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

export const FilterBadges = memo(FilterBadgesComponent);
