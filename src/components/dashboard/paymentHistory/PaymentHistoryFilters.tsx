import { useEffect } from "react";
import type { PaymentHistoryFilters as PaymentHistoryFiltersType } from "@/contexts/paymentHistory/types";
import type { PaymentMethod } from "@/types/models/paymentHistory";
import {
	useQueryState,
	parseAsString,
	type UseQueryStateReturn,
	parseAsArrayOf,
	parseAsIsoDate,
	parseAsInteger,
} from "nuqs";
import { DateRangeFilter } from "../DateRangeFilter";
import { isObjectEmpty } from "@/lib/utils";
import { PaymentMethodFilter } from "./filters/PaymentMethodFilter";
import { PaymentHistoryFilterBadges } from "./filters/PaymentHistoryFilterBadges";
import type { DateRange } from "react-day-picker";
import { AdvancedPaymentHistoryFilters } from "./AdvancedPaymentHistoryFilters";
import { paymentAmountFilterConfig } from "@/config/filters";

interface PaymentHistoryFiltersProps {
	filters: PaymentHistoryFiltersType;
	onFiltersChange: (filters: PaymentHistoryFiltersType) => void;
	setPage?: (page: number) => void;
}

export function PaymentHistoryFilters({
	filters,
	onFiltersChange,
}: PaymentHistoryFiltersProps) {
	const [orderIdParam, setOrderIdParam] = useQueryState(
		"orderId",
		parseAsString,
	);
	const [clientIdParam, setClientIdParam] = useQueryState(
		"clientId",
		parseAsString,
	);
	const [amountParam, setAmountParam] = useQueryState(
		"amount",
		parseAsArrayOf(parseAsInteger).withDefault([
			paymentAmountFilterConfig.min,
			paymentAmountFilterConfig.max,
		]),
	);
	const [methodParam, setMethodParam] = useQueryState("method", parseAsString);
	const [dateParam, setDateParam] = useQueryState(
		"date",
		parseAsArrayOf(parseAsIsoDate),
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect should only run when the filters change.
	useEffect(() => {
		const newFilters: PaymentHistoryFiltersType = {};

		if (orderIdParam) newFilters.orderId = orderIdParam;
		if (clientIdParam) newFilters.clientId = clientIdParam;
		if (methodParam) newFilters.method = methodParam as PaymentMethod;
		if (amountParam) {
			const [min, max] = amountParam;
			if (
				min !== paymentAmountFilterConfig.min ||
				max !== paymentAmountFilterConfig.max
			) {
				newFilters.amount = [min, max];
			}
		}
		if (dateParam) {
			if (dateParam.length === 1) {
				newFilters.date = dateParam[0];
			} else if (dateParam.length === 2) {
				newFilters.date = { from: dateParam[0], to: dateParam[1] };
			}
		}

		if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
			onFiltersChange(newFilters);
		}
	}, [amountParam, orderIdParam, clientIdParam, methodParam, dateParam]);

	const updateFilter = async <T, K>(
		value: T | undefined,
		urlSetter: UseQueryStateReturn<T, K>[1],
	): Promise<void> => {
		await urlSetter(value == null || value === "" ? null : value);
	};

	const handleMethodChange = (method?: string | null) => {
		updateFilter(method ?? undefined, setMethodParam);
	};

	const handleAmountRangeChange = (range: [number, number]) => {
		const isDefault =
			range[0] === paymentAmountFilterConfig.min &&
			range[1] === paymentAmountFilterConfig.max;
		updateFilter(isDefault ? undefined : range, setAmountParam);
	};

	const clearFilters = async () => {
		await Promise.all([
			setOrderIdParam(null),
			setClientIdParam(null),
			setMethodParam(null),
			setDateParam(null),
			setAmountParam([
				paymentAmountFilterConfig.min,
				paymentAmountFilterConfig.max,
			]),
		]);
		onFiltersChange({});
	};

	const handleRemoveFilter = async (key: keyof PaymentHistoryFiltersType) => {
		switch (key) {
			case "orderId":
				await setOrderIdParam(null);
				break;
			case "clientId":
				await setClientIdParam(null);
				break;
			case "method":
				await setMethodParam(null);
				break;
			case "date":
				await setDateParam(null);
				break;
			case "amount":
				await setAmountParam([
					paymentAmountFilterConfig.min,
					paymentAmountFilterConfig.max,
				]); // Reset to default range
				break;
		}
		onFiltersChange({ ...filters, [key]: undefined });
	};

	const handleDateChange = (date: DateRange | undefined) => {
		if (!date) {
			return updateFilter(undefined, setDateParam);
		}

		if (date.from && !date.to) {
			return updateFilter([date.from], setDateParam);
		}

		if (date.from && date.to) {
			if (date.from > date.to) {
				return updateFilter([date.to, date.from], setDateParam);
			}
			return updateFilter([date.from, date.to], setDateParam);
		}

		return updateFilter(undefined, setDateParam);
	};

	const amountRange: [number, number] =
		amountParam && amountParam.length === 2
			? [amountParam[0], amountParam[1]]
			: [paymentAmountFilterConfig.min, paymentAmountFilterConfig.max];

	return (
		<div className="flex flex-col w-full gap-3">
			<div className="flex flex-wrap gap-3 items-end">
				<PaymentMethodFilter
					value={methodParam}
					onValueChange={handleMethodChange}
				/>
				<DateRangeFilter
					value={filters.date as DateRange | Date}
					onValueChange={handleDateChange}
				/>

				<AdvancedPaymentHistoryFilters
					filters={filters}
					buyerId={clientIdParam}
					orderId={orderIdParam}
					amountRange={amountRange}
					buyerIdUrlSetter={setClientIdParam}
					orderIdUrlSetter={setOrderIdParam}
					onAmountRangeChange={handleAmountRangeChange}
					onClearFilters={clearFilters}
				/>
			</div>

			{!isObjectEmpty(filters) && (
				<PaymentHistoryFilterBadges
					onRemoveFilter={handleRemoveFilter}
					filters={filters}
				/>
			)}
		</div>
	);
}
