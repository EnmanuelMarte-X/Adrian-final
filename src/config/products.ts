import type { ProductCapacityUnit } from "@/types/models/products";

export const capacityUnitLabels: Record<ProductCapacityUnit, string> = {
	count: "Cantidad",
	gal: "Galón",
	l: "Litro",
	ml: "Mililitro",
	oz: "Onza",
	lb: "Libra",
	kg: "Kilogramo",
};

export const capacityUnitLabelsPlural: Record<ProductCapacityUnit, string> = {
	count: "Cantidades",
	gal: "Galones",
	l: "Litros",
	ml: "Mililitros",
	oz: "Onzas",
	lb: "Libras",
	kg: "Kilogramos",
};

export const unknownProductValue = "Desconocido";
export const unknownProductValuePlural = "Desconocidos";

export const maxProductImages = 8;
export const maxProductImagesSize = 8; // In megabytes
