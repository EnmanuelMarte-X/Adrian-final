import { useEffect } from "react";
import {
	useQueryState,
	parseAsString,
	parseAsArrayOf,
	type UseQueryStateReturn,
	parseAsIsoDate,
} from "nuqs";
import type {
	OrderFilters,
	OrderFilters as OrderFiltersType,
} from "@/contexts/orders/types";
import { OrderFilterBadges } from "./filters/OrdersFilterBadges";
import { TextFilter } from "../TextFilter";
import { AdvancedOrdersFilters } from "./filters/AdvancedOrdersFilters";
import type { DateRange } from "react-day-picker";
import { DateRangeFilter } from "../DateRangeFilter";
import { useDebouncedCallback } from "@/hooks/use-debounce";

interface OrderFiltersProps {
	filters: OrderFiltersType;
	onFiltersChange: (filters: OrderFiltersType) => void;
	currentPage?: number;
	setPage?: (page: number) => void;
}

export function OrdersFilters({ filters, onFiltersChange }: OrderFiltersProps) {
	const [productIdParam, setProductIdParam] = useQueryState(
		"productId",
		parseAsString,
	);
	const [buyerIdParam, setBuyerIdParam] = useQueryState(
		"buyerId",
		parseAsString,
	);
	const [sellerIdParam, setSellerIdParam] = useQueryState(
		"sellerId",
		parseAsString,
	);
	const [orderIdParam, setOrderIdParam] = useQueryState(
		"orderId",
		parseAsString,
	);
	const [cfSequenceParam, setCfSequenceParam] = useQueryState(
		"cfSequence",
		parseAsString,
	);
	const [ncfSequenceParam, setNcfSequenceParam] = useQueryState(
		"ncfSequence",
		parseAsString,
	);
	const [dateParam, setDateParam] = useQueryState(
		"date",
		parseAsArrayOf(parseAsIsoDate),
	);

	const debouncedOnFiltersChange = useDebouncedCallback(onFiltersChange, 500);

	useEffect(() => {
		const newFilters: OrderFilters = {};

		if (productIdParam) newFilters.productId = productIdParam;
		if (buyerIdParam) newFilters.buyerId = buyerIdParam;
		if (sellerIdParam) newFilters.sellerId = sellerIdParam;
		if (orderIdParam) newFilters.orderId = Number(orderIdParam);
		if (cfSequenceParam) newFilters.cfSequence = Number(cfSequenceParam);
		if (ncfSequenceParam) newFilters.ncfSequence = Number(ncfSequenceParam);
		if (dateParam) {
			if (dateParam.length === 1) {
				newFilters.date = dateParam[0];
			} else if (dateParam.length === 2) {
				newFilters.date = { from: dateParam[0], to: dateParam[1] };
			}
		}

		if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
			debouncedOnFiltersChange(newFilters);
		}
	}, [
		productIdParam,
		buyerIdParam,
		sellerIdParam,
		orderIdParam,
		cfSequenceParam,
		ncfSequenceParam,
		dateParam,
		filters,
		debouncedOnFiltersChange,
	]);

	useEffect(() => {
		if (filters.productId) setProductIdParam(filters.productId);
		if (filters.buyerId) setBuyerIdParam(filters.buyerId);
		if (filters.sellerId) setSellerIdParam(filters.sellerId);
		if (filters.orderId) setOrderIdParam(filters.orderId.toString());
		if (filters.cfSequence) setCfSequenceParam(filters.cfSequence.toString());
		if (filters.ncfSequence)
			setNcfSequenceParam(filters.ncfSequence.toString());
		if (filters.date) {
			if (filters.date instanceof Date) {
				setDateParam([filters.date]);
			} else if (filters.date.from || filters.date.to) {
				setDateParam([filters.date.from, filters.date.to]);
			}
		}
	}, [
		filters,
		setProductIdParam,
		setBuyerIdParam,
		setSellerIdParam,
		setOrderIdParam,
		setCfSequenceParam,
		setNcfSequenceParam,
		setDateParam,
	]);

	const updateFilter = async <T, K>(
		value: T | undefined,
		urlSetter: UseQueryStateReturn<T, K>[1],
	): Promise<void> => {
		await urlSetter(value == null || value === "" ? null : value);
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

	const handleClearFilters = async () => {
		await Promise.all([
			setProductIdParam(null),
			setBuyerIdParam(null),
			setSellerIdParam(null),
			setOrderIdParam(null),
			setCfSequenceParam(null),
			setNcfSequenceParam(null),
			setDateParam(null),
		]);
	};

	const handleRemoveFilter = async (key: keyof OrderFiltersType) => {
		switch (key) {
			case "productId":
				await setProductIdParam(null);
				break;
			case "buyerId":
				await setBuyerIdParam(null);
				break;
			case "sellerId":
				await setSellerIdParam(null);
				break;
			case "orderId":
				await setOrderIdParam(null);
				break;
			case "cfSequence":
				await setCfSequenceParam(null);
				break;
			case "ncfSequence":
				await setNcfSequenceParam(null);
				break;
			case "date":
				await setDateParam(null);
				break;
		}
	};

	return (
		<div className="flex flex-col w-full gap-y-3">
			<div className="flex flex-wrap w-full items-end gap-3">
				<TextFilter
					id="orderId"
					initialValue={filters.orderId?.toString() ?? ""}
					label="ID de factura"
					placeholder="Número de factura"
					urlSetter={setOrderIdParam}
				/>

				<DateRangeFilter
					value={filters.date as DateRange | Date}
					onValueChange={handleDateChange}
				/>

				<AdvancedOrdersFilters
					productId={filters.productId}
					productIdUrlSetter={setProductIdParam}
					buyerId={filters.buyerId}
					buyerIdUrlSetter={setBuyerIdParam}
					sellerId={filters.sellerId}
					sellerIdUrlSetter={setSellerIdParam}
					cfSequence={filters.cfSequence}
					cfSequenceUrlSetter={setCfSequenceParam}
					ncfSequence={filters.ncfSequence}
					ncfSequenceUrlSetter={setNcfSequenceParam}
					filters={filters}
					onClearFilters={handleClearFilters}
				/>
			</div>
			<OrderFilterBadges
				filters={filters}
				onRemoveFilter={handleRemoveFilter}
			/>
		</div>
	);
}
