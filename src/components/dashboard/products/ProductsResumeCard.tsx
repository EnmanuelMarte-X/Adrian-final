"use client";

import { ResumeCard } from "@/components/dashboard/resume/ResumeCard";
import { useProductsCount } from "@/contexts/products/queries";

export function ProductsResumeCard() {
	const { data: productsCount, isLoading, isError } = useProductsCount();

	return (
		<ResumeCard
			title="Total Productos"
			description="Productos registrados en la tienda."
			value={productsCount}
			valueType="unit"
			isLoading={isLoading}
			isError={isError}
			hideComparison
			errorMessage="Error al cargar las estadísticas de stock. Por favor intenta de nuevo."
		/>
	);
}
