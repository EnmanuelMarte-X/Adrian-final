import type { ProductCapacityUnit } from "@/types/models/products";

export interface ProductFilters {
	name?: string;
	brand?: string;
	category?: string;
	capacity?: number;
	capacityUnit?: ProductCapacityUnit;
	cost?: [number, number] | undefined;
	stock?: 0 | 1; // Removed, now calculated from locations
	storageId?: string;
	inStore?: boolean;
}

export interface ProductSort {
	field: "name" | "capacity" | "_id" | "brand" | "cost";
	order: "asc" | "desc";
}
