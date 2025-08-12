import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { FilterIcon, XIcon } from "lucide-react";
import { memo } from "react";
import type { UseQueryStateReturn } from "nuqs";
import { TextFilter } from "../../TextFilter";
import type { OrderFilters } from "@/contexts/orders/types";

interface AdvancedOrdersFiltersProps {
	filters: OrderFilters;
	productId?: string;
	buyerId?: string;
	sellerId?: string;
	cfSequence?: number;
	ncfSequence?: number;
	onClearFilters: () => void;
	productIdUrlSetter: UseQueryStateReturn<string | null, string>[1];
	buyerIdUrlSetter: UseQueryStateReturn<string | null, string>[1];
	sellerIdUrlSetter: UseQueryStateReturn<string | null, string>[1];
	cfSequenceUrlSetter: UseQueryStateReturn<string | null, string>[1];
	ncfSequenceUrlSetter: UseQueryStateReturn<string | null, string>[1];
}

function AdvancedOrdersFiltersComponent({
	filters,
	productId,
	buyerId,
	sellerId,
	cfSequence,
	ncfSequence,
	productIdUrlSetter,
	buyerIdUrlSetter,
	sellerIdUrlSetter,
	cfSequenceUrlSetter,
	ncfSequenceUrlSetter,
	onClearFilters,
}: AdvancedOrdersFiltersProps) {
	const hasActiveFilters = Object.values(filters).some(
		(val) => val !== undefined,
	);

	const advancedFilterCount = Object.keys(filters).filter(
		(k) =>
			filters[k as keyof OrderFilters] !== undefined &&
			[
				"productId",
				"buyerId",
				"sellerId",
				"cfSequence",
				"ncfSequence",
			].includes(k),
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
						Filtra por rango o valor para encontrar las facturas.
					</p>
				</header>
				<div className="flex flex-col gap-y-4 w-full">
					<TextFilter
						label="ID de producto"
						initialValue={productId ?? ""}
						placeholder="67cf7de977ed7062..."
						urlSetter={productIdUrlSetter}
						id="productId"
					/>
					<TextFilter
						label="ID de cliente"
						initialValue={buyerId ?? ""}
						placeholder="67cf7de977ed7062..."
						urlSetter={buyerIdUrlSetter}
						id="buyerId"
					/>
					<TextFilter
						label="ID de vendedor"
						initialValue={sellerId ?? ""}
						placeholder="67cf7de977ed7062..."
						urlSetter={sellerIdUrlSetter}
						id="sellerId"
					/>
					<TextFilter
						label="Secuencia CF"
						initialValue={cfSequence?.toString() ?? ""}
						placeholder="1001"
						urlSetter={cfSequenceUrlSetter}
						id="cfSequence"
					/>
					<TextFilter
						label="Secuencia NCF"
						initialValue={ncfSequence?.toString() ?? ""}
						placeholder="2001"
						urlSetter={ncfSequenceUrlSetter}
						id="ncfSequence"
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export const AdvancedOrdersFilters = memo(AdvancedOrdersFiltersComponent);
