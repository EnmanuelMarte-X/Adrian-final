import { useEffect } from "react";
import type { ProductFilters as ProductFiltersType } from "@/contexts/products/types";
import type { ProductCapacityUnit } from "@/types/models/products";
import {
	useQueryState,
	parseAsInteger,
	parseAsString,
	parseAsArrayOf,
	type UseQueryStateReturn,
} from "nuqs";
import { priceFilterConfig } from "@/config/filters";
import { CategoryFilter } from "./filters/CategoryFilter";
import { AdvancedFilters } from "./filters/AdvancedFilters";
import { FilterBadges } from "./filters/FilterBadges";
import { TextFilter } from "../TextFilter";
import { isObjectEmpty } from "@/lib/utils";

interface ProductFiltersProps {
	filters: ProductFiltersType;
	onFiltersChange: (filters: ProductFiltersType) => void;
	setPage?: (page: number) => void;
}
export function ProductsFilters({
	filters,
	onFiltersChange,
	setPage,
}: ProductFiltersProps) {
	const [nameParam, setNameParam] = useQueryState("name", parseAsString);
	const [brandParam, setBrandParam] = useQueryState("brand", parseAsString);
	const [categoryParam, setCategoryParam] = useQueryState(
		"category",
		parseAsString,
	);
	const [capacityParam, setCapacityParam] = useQueryState(
		"capacity",
		parseAsInteger,
	);
	const [capacityUnitParam, setCapacityUnitParam] = useQueryState(
		"capacity-unit",
		parseAsString,
	);
	const [costRangeParam, setCostRangeParam] = useQueryState(
		"costRange",
		parseAsArrayOf(parseAsInteger).withDefault([
			priceFilterConfig.min,
			priceFilterConfig.max,
		]),
	);
	const [stockParam, setStockParam] = useQueryState("stock", parseAsInteger);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect should only run when the filters change.
	useEffect(() => {
		const newFilters: ProductFiltersType = {};

		if (nameParam) newFilters.name = nameParam;
		if (brandParam) newFilters.brand = brandParam;
		if (categoryParam) newFilters.category = categoryParam;
		if (capacityParam) newFilters.capacity = capacityParam;
		if (capacityUnitParam)
			newFilters.capacityUnit = capacityUnitParam as ProductCapacityUnit;
		if (stockParam !== undefined && (stockParam === 0 || stockParam === 1))
			newFilters.stock = stockParam;

		if (costRangeParam && costRangeParam.length === 2) {
			const [min, max] = costRangeParam;
			if (min !== priceFilterConfig.min || max !== priceFilterConfig.max) {
				newFilters.cost = [min, max];
			}
		}

		if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
			onFiltersChange(newFilters);
		}
	}, [
		nameParam,
		brandParam,
		categoryParam,
		capacityParam,
		capacityUnitParam,
		costRangeParam,
		stockParam,
	]);

	const updateFilter = async <T, K>(
		value: T | undefined,
		urlSetter: UseQueryStateReturn<T, K>[1],
	): Promise<void> => {
		await urlSetter(value == null || value === "" ? null : value);
	};

	const handleCategoryChange = (category: string | undefined) => {
		updateFilter(category, setCategoryParam);
	};

	const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value ? Number(e.target.value) : undefined;
		updateFilter(value, setCapacityParam);
	};

	const handleCapacityUnitChange = (unit: string | undefined) => {
		updateFilter(unit, setCapacityUnitParam);
	};

	const handleCostRangeChange = (range: [number, number]) => {
		const isDefault =
			range[0] === priceFilterConfig.min && range[1] === priceFilterConfig.max;
		updateFilter(isDefault ? undefined : range, setCostRangeParam);
	};

	const handleStockChange = (values: string[]) => {
		let stockValue: number | undefined;

		if (values.length === 0 || values.length === 2) {
			stockValue = undefined;
		} else {
			stockValue = values.includes("stock") ? 1 : 0;
		}

		updateFilter(stockValue, setStockParam);
	};

	const clearFilters = async () => {
		await Promise.all([
			setNameParam(null),
			setBrandParam(null),
			setCategoryParam(null),
			setCapacityParam(null),
			setCapacityUnitParam(null),
			setStockParam(null),
			setCostRangeParam([priceFilterConfig.min, priceFilterConfig.max]),
			setPage?.(1),
		]);
	};

	const removeFilter = async (key: keyof ProductFiltersType) => {
		switch (key) {
			case "name":
				await setNameParam(null);
				break;
			case "brand":
				await setBrandParam(null);
				break;
			case "category":
				await setCategoryParam(null);
				break;
			case "capacity":
				await setCapacityParam(null);
				break;
			case "capacityUnit":
				await setCapacityUnitParam(null);
				break;
			case "stock":
				await setStockParam(null);
				break;
			case "cost":
				await setCostRangeParam([priceFilterConfig.min, priceFilterConfig.max]);
				break;
		}
	};

	const costRange: [number, number] =
		costRangeParam && costRangeParam.length === 2
			? [costRangeParam[0], costRangeParam[1]]
			: [priceFilterConfig.min, priceFilterConfig.max];

	return (
		<div className="flex flex-col w-full gap-3">
			<div className="flex flex-wrap gap-3 items-end">
				<TextFilter
					id="search"
					label="Nombre"
					placeholder="Mi producto"
					initialValue={nameParam}
					urlSetter={setNameParam}
				/>

				<TextFilter
					id="brand"
					label="Marca"
					placeholder="Filtra por marca"
					initialValue={brandParam}
					urlSetter={setBrandParam}
				/>

				<CategoryFilter
					value={filters.category ?? undefined}
					onValueChange={handleCategoryChange}
				/>

				<AdvancedFilters
					filters={filters}
					onClearFilters={clearFilters}
					updateFilter={updateFilter}
					onStockChange={handleStockChange}
					onCostRangeChange={handleCostRangeChange}
					onCapacityChange={handleCapacityChange}
					onCapacityUnitChange={handleCapacityUnitChange}
					costRange={costRange}
				/>
			</div>

			{!isObjectEmpty(filters) && (
				<FilterBadges
					filters={filters}
					onRemoveFilter={removeFilter}
					fixedKeys={["storageId"]}
				/>
			)}
		</div>
	);
}
