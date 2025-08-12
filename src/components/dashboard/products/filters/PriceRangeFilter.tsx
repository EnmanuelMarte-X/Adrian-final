import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { priceFilterConfig } from "@/config/filters";
import { memo, useEffect, useState } from "react";

interface PriceRangeFilterProps {
	label?: string;
	initialRange: [number, number];
	onRangeChange: (range: [number, number]) => void;
}

function PriceRangeFilterComponent({
	label = "Rango de precio",
	initialRange,
	onRangeChange,
}: PriceRangeFilterProps) {
	const [localRange, setLocalRange] = useState<[number, number]>(initialRange);

	const handleValueChange = (value: number[]) => {
		setLocalRange(value as [number, number]);
	};

	const handleValueCommit = (value: number[]) => {
		onRangeChange(value as [number, number]);
	};

	useEffect(() => {
		setLocalRange(initialRange);
	}, [initialRange]);

	return (
		<div className="flex flex-col gap-3">
			<Label htmlFor="cost-range">{label}</Label>
			<div className="flex flex-col gap-y-2 max-w-md">
				<Slider
					id="cost-range"
					value={localRange}
					defaultValue={[priceFilterConfig.min, priceFilterConfig.max]}
					onValueChange={handleValueChange}
					onValueCommit={handleValueCommit}
					max={priceFilterConfig.max}
					min={priceFilterConfig.min}
					step={priceFilterConfig.step}
				/>
				<div className="inline-flex w-full justify-between text-muted-foreground text-sm px-2">
					<span>${localRange[0]}</span>
					<span>${localRange[1]}</span>
				</div>
			</div>
		</div>
	);
}

export const PriceRangeFilter = memo(PriceRangeFilterComponent);
