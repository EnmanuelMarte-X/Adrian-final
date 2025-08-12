import type { productCapacityUnits } from "@/contexts/products/units";

export type ProductCapacityUnit = (typeof productCapacityUnits)[number];

export type ProductImage = {
	url: string;
	alt: string;
};

export type ProductStorageType = {
	storageId: string;
	productId: string;
	stock: number;
	showInStore: boolean;
};

export type ProductType = {
	_id: string;
	name: string;
	description: string;
	brand: string;
	category: string;
	capacity: number;
	capacityUnit: ProductCapacityUnit;
	retailPrice: number;
	wholesalePrice: number;
	cost: number;
	updatedAt: Date;
	stock: number;
	minimumStock: number;
	locations: ProductStorageType[];
	images: ProductImage[];
};
