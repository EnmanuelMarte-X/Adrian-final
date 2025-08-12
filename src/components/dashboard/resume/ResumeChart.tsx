"use client";

import { useMemo } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
} from "@/components/ui/chart";
import { XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import { Spinner } from "@/components/ui/spinner";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export interface ChartDataItem {
	month: string;
	[key: string]: string | number;
}

export interface SummaryCard {
	title: string;
	value: string | number;
	className?: string;
}

export interface ResumeChartProps {
	className?: string;
	title: string;
	description: string;
	isLoading: boolean;
	chartData: ChartDataItem[];
	chartConfig: Record<string, { label: string; color: string }>;
	primaryDataKey: string;
	secondaryDataKeys?: string[];
	trend?: number;
	badge?: {
		text: React.ReactNode;
		variant?: "default" | "secondary" | "destructive" | "outline";
		className?: string;
	};
	summaryCards?: SummaryCard[];
	additionalSummaryCards?: SummaryCard[];
	emptyStateTitle?: string;
	emptyStateDescription?: string;
	dateRangeFilter?: React.ReactNode;
	yAxisFormatter?: (value: number) => string;
	tooltipLabelFormatter?: (value: string) => string;
	customYAxisConfig?: {
		domain: [number, number];
		ticks: number[];
	};
}

export function ResumeChart({
	className,
	title,
	description,
	isLoading,
	chartData,
	chartConfig,
	primaryDataKey,
	secondaryDataKeys = [],
	trend,
	badge,
	summaryCards,
	additionalSummaryCards,
	emptyStateTitle = "No hay datos disponibles",
	emptyStateDescription = "No se encontraron datos para mostrar en el período seleccionado.",
	dateRangeFilter,
	yAxisFormatter = (value) => Math.floor(value).toString(),
	tooltipLabelFormatter = (value) => `Mes: ${value}`,
	customYAxisConfig,
}: ResumeChartProps) {
	const yAxisConfig = useMemo(() => {
		if (customYAxisConfig) return customYAxisConfig;

		if (!chartData || chartData.length === 0) {
			return { domain: [0, 5] as [number, number], ticks: [0, 1, 2, 3, 4, 5] };
		}

		const allDataKeys = [primaryDataKey, ...secondaryDataKeys];
		const allValues = chartData.flatMap((item) =>
			allDataKeys.map((key) => {
				const value = item[key];
				return typeof value === "number" ? Math.abs(value) : 0;
			}),
		);
		const maxValue = Math.max(...allValues);

		if (maxValue < 5) {
			return {
				domain: [0, 5] as [number, number],
				ticks: [0, 1, 2, 3, 4, 5],
			};
		}

		const tickCount = Math.max(5, Math.min(8, Math.ceil(maxValue / 10)));
		const step = Math.ceil(maxValue / (tickCount - 1));
		const adjustedMax = step * (tickCount - 1);

		const ticks = Array.from({ length: tickCount }, (_, i) => i * step);

		return {
			domain: [0, adjustedMax] as [number, number],
			ticks,
		};
	}, [chartData, primaryDataKey, secondaryDataKeys, customYAxisConfig]);

	const hasData = chartData && chartData.length > 0;

	return (
		<Card className={className}>
			<CardHeader className="pb-4">
				<div className="flex flex-col space-y-4">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
						<div>
							{isLoading ? (
								<>
									<Skeleton className="h-6 w-48 mb-2" />
									<Skeleton className="h-4 w-64" />
								</>
							) : (
								<>
									<CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
									<CardDescription className="text-xs sm:text-sm">
										{description}
									</CardDescription>
								</>
							)}
						</div>
						<div className="flex items-center gap-2">
							{isLoading ? (
								<Skeleton className="h-6 w-20" />
							) : (
								<>
									{badge && (
										<Badge
											variant={badge.variant || "secondary"}
											className={badge.className}
										>
											{badge.text}
										</Badge>
									)}
									{typeof trend === "number" && hasData && (
										<span
											className={`text-sm font-normal ${trend >= 0 ? "text-primary" : "text-destructive-foreground"}`}
										>
											{trend >= 0 ? "↗" : "↘"} {Math.abs(trend).toFixed(1)}%
										</span>
									)}
								</>
							)}
						</div>
					</div>

					{isLoading ? (
						<Skeleton className="h-8 w-full max-w-md" />
					) : (
						dateRangeFilter && dateRangeFilter
					)}
				</div>
			</CardHeader>
			<CardContent>
				<div className="h-[250px] sm:h-[300px] lg:h-[350px] w-full">
					{isLoading ? (
						<div className="h-full w-full flex items-center justify-center">
							<div className="text-center space-y-3">
								<Spinner className="h-8 w-24 sm:h-10 sm:w-32 mx-auto" />
								<p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto px-4">
									Cargando datos, por favor espere...
								</p>
							</div>
						</div>
					) : !hasData ? (
						<div className="h-full w-full flex items-center justify-center">
							<div className="text-center space-y-4">
								<TrendingUp className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto" />
								<div className="space-y-2">
									<h3 className="text-base sm:text-lg font-semibold">
										{emptyStateTitle}
									</h3>
									<p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto px-4">
										{emptyStateDescription}
									</p>
								</div>
							</div>
						</div>
					) : (
						<ChartContainer config={chartConfig} className="h-full w-full">
							<AreaChart data={chartData}>
								<defs>
									<linearGradient
										id={`fill${primaryDataKey}`}
										x1="0"
										y1="0"
										x2="0"
										y2="1"
									>
										<stop
											offset="5%"
											stopColor={`var(--color-${primaryDataKey})`}
											stopOpacity={0.8}
										/>
										<stop
											offset="95%"
											stopColor={`var(--color-${primaryDataKey})`}
											stopOpacity={0.1}
										/>
									</linearGradient>
									{secondaryDataKeys.map((key) => (
										<linearGradient
											key={key}
											id={`fill${key}`}
											x1="0"
											y1="0"
											x2="0"
											y2="1"
										>
											<stop
												offset="5%"
												stopColor={`var(--color-${key})`}
												stopOpacity={0.6}
											/>
											<stop
												offset="95%"
												stopColor={`var(--color-${key})`}
												stopOpacity={0.1}
											/>
										</linearGradient>
									))}
								</defs>
								<CartesianGrid vertical={false} />
								<XAxis
									dataKey="month"
									tickLine={false}
									axisLine={false}
									tickMargin={8}
									fontSize={10}
									className="text-xs"
								/>
								<YAxis
									stroke="var(--muted-foreground)"
									fontSize={10}
									tickLine={false}
									axisLine={false}
									domain={yAxisConfig.domain}
									ticks={yAxisConfig.ticks}
									tickFormatter={yAxisFormatter}
									className="text-xs"
								/>
								<ChartTooltip
									cursor={true}
									content={
										<ChartTooltipContent
											labelFormatter={tooltipLabelFormatter}
											indicator="dot"
										/>
									}
								/>

								<Area
									dataKey={primaryDataKey}
									type="natural"
									fill={`url(#fill${primaryDataKey})`}
									stroke={`var(--color-${primaryDataKey})`}
									strokeWidth={2}
								/>

								{secondaryDataKeys.map((key) => (
									<Area
										key={key}
										dataKey={key}
										type="natural"
										fill={`url(#fill${key})`}
										stroke={`var(--color-${key})`}
										strokeWidth={1.5}
									/>
								))}
								<ChartLegend content={<ChartLegendContent />} />
							</AreaChart>
						</ChartContainer>
					)}
				</div>

				{isLoading ? (
					<div className="mt-4 p-3 rounded-lg border bg-muted/50">
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
							<Skeleton className="h-12 w-full" />
						</div>
					</div>
				) : (
					summaryCards &&
					summaryCards.length > 0 && (
						<div className="mt-4 p-3 rounded-lg border bg-muted/50">
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
								{summaryCards.map((card, index) => (
									<div
										key={`summary-${card.title}-${index}`}
										className="text-center"
									>
										<div
											className={`font-semibold ${card.className || "text-foreground"}`}
										>
											{card.value}
										</div>
										<div className="text-xs text-muted-foreground">
											{card.title}
										</div>
									</div>
								))}
							</div>
						</div>
					)
				)}

				{!isLoading &&
					additionalSummaryCards &&
					additionalSummaryCards.length > 0 && (
						<div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
							{additionalSummaryCards.map((card, index) => (
								<div
									key={`additional-${card.title}-${index}`}
									className="text-center p-3 rounded-lg bg-muted/30"
								>
									<div
										className={`font-semibold ${card.className || "text-foreground"}`}
									>
										{card.value}
									</div>
									<div className="text-xs text-muted-foreground">
										{card.title}
									</div>
								</div>
							))}
						</div>
					)}
			</CardContent>
		</Card>
	);
}
