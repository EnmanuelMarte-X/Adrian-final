"use client";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { useWindowWidth } from "@/hooks/use-window-width";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	currencyFormat,
	numberFormat,
	percentageFormat,
} from "@/config/formats";
import { cn } from "@/lib/utils";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

export interface ResumeCardProps {
	title: React.ReactNode;
	description: React.ReactNode;
	value: number;
	valueType: "percent" | "currency" | "unit";
	lastMonthValue?: number;
	hideComparison?: boolean;
	isLoading?: boolean;
	isError?: boolean;
	errorMessage?: string;
}

export function ResumeCard({
	title,
	description,
	value,
	valueType,
	lastMonthValue,
	isLoading,
	isError,
	errorMessage,
	hideComparison,
}: ResumeCardProps) {
	const { state } = useSidebar();
	const windowWidth = useWindowWidth();

	const valueFormatter =
		valueType === "percent"
			? (value: number) => percentageFormat.format(value)
			: valueType === "currency"
				? (value: number) => currencyFormat.format(value)
				: (value: number) => numberFormat.format(value);

	const getComparisonSign = (
		lastMonth: number,
		current: number,
	): React.ReactNode => {
		if (lastMonth < current)
			return (
				<>
					<TrendingUpIcon className="size-4" />+
				</>
			);
		if (lastMonth > current)
			return (
				<>
					<TrendingDownIcon className="size-4" />-
				</>
			);
		return null;
	};

	const getComparisonColor = (lastMonth: number, current: number) => {
		if (lastMonth < current) return "text-success";
		if (lastMonth > current) return "text-destructive";
		return "text-muted-foreground";
	};

	return (
		<Card
			className={cn(
				"min-w-[260px] w-full max-w-full gap-3 border border-border py-5",
				{
					"sm:max-w-[400px]": state === "collapsed" && windowWidth < 1380,
					"sm:max-w-[240px]": state === "expanded" && windowWidth < 1380,
					"sm:max-w-full": state === "expanded" && windowWidth <= 1000,
				},
				"flex flex-col justify-between",
			)}
		>
			<CardHeader className="flex flex-row justify-between h-5 min-h-6">
				<CardTitle className="text-muted-foreground">{title}</CardTitle>
				{!hideComparison &&
					(isLoading ? (
						<Skeleton className="h-5 w-14" />
					) : isError || lastMonthValue === undefined ? null : (
						<Tooltip>
							<TooltipTrigger>
								<Badge
									variant="outline"
									className={cn(
										"text-sm",
										getComparisonColor(lastMonthValue, value),
									)}
								>
									{getComparisonSign(lastMonthValue, value)}
									{valueFormatter(value - lastMonthValue)}
								</Badge>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									Último mes: {valueFormatter(lastMonthValue)}
									<br />
									Este mes: {valueFormatter(value)}
								</p>
							</TooltipContent>
						</Tooltip>
					))}
			</CardHeader>
			<CardContent className="flex-grow">
				{isLoading ? (
					<>
						<Skeleton className="h-10 w-32" />
					</>
				) : isError ? (
					<div className="text-destructive">
						{errorMessage || "Error al cargar los datos."}
					</div>
				) : (
					<div className="flex items-end gap-3 h-full">
						<span
							data-type={valueType}
							className="data-[type=currency]:text-3xl text-4xl font-bold"
						>
							{valueFormatter(value)}
						</span>
					</div>
				)}
			</CardContent>
			<CardFooter>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardFooter>
		</Card>
	);
}
