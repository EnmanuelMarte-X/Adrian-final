"use client";

import { memo } from "react";
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter";
import type { DateRange } from "react-day-picker";

interface DateRangeSelectorProps {
	value: DateRange | undefined;
	onValueChange: (range: DateRange | undefined) => void;
	className?: string;
}

export const DateRangeSelector = memo(function DateRangeSelector({
	value,
	onValueChange,
	className = "w-full sm:w-auto",
}: DateRangeSelectorProps) {
	return (
		<DateRangeFilter
			value={value}
			onValueChange={onValueChange}
			className={className}
		/>
	);
});
