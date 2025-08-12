"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { dateFormat } from "@/config/formats";
import { cn } from "@/lib/utils";

export interface DatePickerProps
	extends Omit<CalendarProps, "selected" | "onSelect" | "classNames"> {
	placeholder?: string;
	format?: string;
	value?: Date;
	onValueChange?: (value?: Date) => void;
	classNames?: {
		trigger?: string;
		content?: string;
	};
}

export function DatePicker({
	placeholder,
	value,
	onValueChange,
	format = "PP",
	classNames,
	...calendarProps
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					id="date"
					className={cn("font-normal justify-between", classNames?.trigger)}
				>
					{value
						? dateFormat(value, format)
						: placeholder || "Seleccionar fecha"}
					<CalendarIcon className="size-3.5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className={cn("w-auto overflow-hidden p-0", classNames?.content)}
				align="start"
			>
				<Calendar
					mode="single"
					selected={value}
					captionLayout="dropdown"
					// @ts-ignore
					onSelect={
						onValueChange
							? (selectedDate: Date | undefined) => {
									onValueChange(selectedDate);
									setOpen(false);
								}
							: undefined
					}
					{...calendarProps}
				/>
			</PopoverContent>
		</Popover>
	);
}
