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
import { TextFilter } from "../TextFilter";
import type { PaymentHistoryFilters } from "@/contexts/paymentHistory/types";
import { PriceRangeFilter } from "../products/filters/PriceRangeFilter";

interface AdvancedPaymentHistoryFiltersProps {
	filters: PaymentHistoryFilters;
	buyerId?: string | null;
	orderId?: string | null;
	amountRange: [number, number];
	onClearFilters: () => void;
	buyerIdUrlSetter: UseQueryStateReturn<string | null, string>[1];
	orderIdUrlSetter: UseQueryStateReturn<string | null, string>[1];
	onAmountRangeChange: (range: [number, number]) => void;
}

function AdvancedPaymentHistoryFiltersComponent({
	filters,
	buyerId,
	orderId,
	amountRange,
	buyerIdUrlSetter,
	orderIdUrlSetter,
	onAmountRangeChange,
	onClearFilters,
}: AdvancedPaymentHistoryFiltersProps) {
	const hasActiveFilters = Object.values(filters).some(
		(val) => val !== undefined,
	);

	const advancedFilterCount = Object.keys(filters).filter(
		(k) =>
			filters[k as keyof PaymentHistoryFilters] !== undefined &&
			["buyerId", "orderId"].includes(k),
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
								onClick={() => {
									onClearFilters();
								}}
								className="h-8 px-2 max-w-[15ch]"
							>
								<XIcon className="size-4" /> Limpiar
							</Button>
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						Filtra por rango o valor para encontrar los pagos.
					</p>
				</header>
				<div className="flex flex-col gap-y-4 w-full">
					<PriceRangeFilter
						label="Rango de monto"
						initialRange={amountRange}
						onRangeChange={onAmountRangeChange}
					/>
					<TextFilter
						label="ID de cliente"
						initialValue={buyerId ?? ""}
						placeholder="67cf7de977ed7062..."
						urlSetter={buyerIdUrlSetter}
						id="buyerId"
					/>
					<TextFilter
						label="ID de la factura"
						initialValue={orderId ?? ""}
						placeholder="67cf7de977ed7062..."
						urlSetter={orderIdUrlSetter}
						id="orderId"
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export const AdvancedPaymentHistoryFilters = memo(
	AdvancedPaymentHistoryFiltersComponent,
);
