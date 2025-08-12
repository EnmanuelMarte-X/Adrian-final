"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { es } from "date-fns/locale";

export interface DateRangeFilterProps
	extends React.HTMLAttributes<HTMLDivElement> {
	value?: DateRange | Date;
	onValueChange: (value?: DateRange) => void;
}

export function DateRangeFilter({
	className,
	value,
	onValueChange,
}: DateRangeFilterProps) {
	const [date, setDate] = React.useState<DateRange | undefined>(() => {
		if (!value) return undefined;
		if (value instanceof Date) {
			return { from: value, to: undefined };
		}
		return value as DateRange;
	});

	const handleDateChange = (newDate: DateRange | undefined) => {
		if (
			newDate?.from &&
			newDate?.to &&
			newDate.from.getTime() === newDate.to.getTime()
		) {
			setDate(undefined);
			onValueChange(undefined);
		} else {
			setDate(newDate);
			onValueChange(newDate);
		}
	};

	React.useEffect(() => {
		if (value === undefined) {
			setDate(undefined);
		}
	}, [value]);

	return (
		<div className={cn("flex flex-col gap-y-2", className)}>
			<Label htmlFor="date">Fecha</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-[300px] justify-start text-left font-normal dark:bg-input/30 bg-transparent border border-input hover:bg-transparent hover:text-muted-foreground",
							!date && "text-muted-foreground",
						)}
					>
						<CalendarIcon className="mr-2 size-4" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y")} -{" "}
									{format(date.to, "LLL dd, y")}
								</>
							) : (
								format(date.from, "LLL dd, y")
							)
						) : (
							<span>Selecciona una fecha</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						locale={es}
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={handleDateChange}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
