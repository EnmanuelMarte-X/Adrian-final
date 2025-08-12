"use client";

import { Spinner } from "@/components/ui/spinner";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import type { SelectProps } from "@radix-ui/react-select";
import { useEffect } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export interface ProductCategorySelectProps
	extends Omit<SelectProps, "children"> {
	className?: string;
}

const fetchCategories: () => Promise<{
	categories: { id: string; name: string }[];
}> = async () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				categories: [
					{ id: "Category A", name: "Categoría A" },
					{ id: "Category B", name: "Categoría B" },
					{ id: "Category C", name: "Categoría C" },
				],
			});
		}, 1000);
	});
};

export function ProductCategorySelect({
	className,
	...props
}: ProductCategorySelectProps) {
	const {
		data: { categories },
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories,
		initialData: {
			categories: [],
		},
	});

	useEffect(() => {
		if (isError) {
			toast.error(
				"Error al cargar la categorías de los productos. Por favor, inténtelo de nuevo.",
			);
		}
	}, [isError]);

	return (
		<Select {...props}>
			<SelectTrigger className={cn(className)} disabled={isLoading}>
				{isLoading && <Spinner className="size-4 text-muted-foreground" />}
				<SelectValue placeholder="Seleccionar categoría" />
			</SelectTrigger>
			<SelectContent>
				{categories?.map((category) => (
					<SelectItem key={category.id} value={category.id}>
						{category.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
