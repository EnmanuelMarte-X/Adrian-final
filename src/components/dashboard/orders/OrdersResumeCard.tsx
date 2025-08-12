"use client";

import { ResumeCard } from "@/components/dashboard/resume/ResumeCard";
import { useOrdersCount } from "@/contexts/orders/queries";

export function OrdersResumeCard() {
	const { data: count, isLoading, isError } = useOrdersCount();

	return (
		<ResumeCard
			title="Ventas"
			description="Cantidad de ventas emitidas en la tienda."
			value={count}
			valueType="unit"
			hideComparison
			lastMonthValue={0}
			isLoading={isLoading}
			isError={isError}
			errorMessage="Error al cargar la cantidad de facturas. Por favor intenta de nuevo."
		/>
	);
}
