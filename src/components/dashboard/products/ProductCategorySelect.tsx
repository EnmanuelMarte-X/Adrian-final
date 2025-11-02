"use client";

import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	SelectValue,
} from "@/components/ui/select";
import type { SelectProps } from "@radix-ui/react-select";
import { useEffect, useMemo, useState } from "react";
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
					{ id: "Shampoo", name: "Shampoo" },
					{ id: "Macarilla", name: "Macarilla" },
					{ id: "Acondicionador", name: "Acondicionador" },
					{ id: "Tratamiento", name: "Tratamiento" },
					{ id: "Oleo", name: "Oleo" },
					{ id: "Tonico", name: "Tonico" },
					{ id: "Caja de Ampollas", name: "Caja de Ampollas" },
					{ id: "Kit", name: "Kit" },
					{ id: "Goteros", name: "Goteros" },
					{ id: "Gotas", name: "Gotas" },
					{ id: "Leaven", name: "Leaven" },
					{ id: "Fluido", name: "Fluido" },
				],
			});
		}, 0);
	});
};

export function ProductCategorySelect({
	className,
	onValueChange,
	value,
	defaultValue,
	...props
}: ProductCategorySelectProps & {
	onValueChange?: (value: string) => void;
	value?: string;
	defaultValue?: string;
}) {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["categories"],
		queryFn: fetchCategories,
		initialData: { categories: [] },
	});

	const categories = data?.categories ?? [];

	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return categories;
		return categories.filter((c) => c.name.toLowerCase().includes(q));
	}, [categories, query]);

	useEffect(() => {
		if (isError) {
			toast.error(
				"Error al cargar las categorías de productos. Por favor, inténtelo de nuevo.",
			);
		}
	}, [isError]);

	// Helper: convert an external value (which may be a name or an id)
	// into the internal Select value (we keep SelectItem values as the category id).
	const mapExternalToId = (val?: string) => {
		if (!val) return undefined;
		const foundByName = categories.find((c) => c.name === val);
		if (foundByName) return foundByName.id;
		// otherwise assume it's already an id
		return val;
	};

	const internalValue = mapExternalToId(value);
	const internalDefault = mapExternalToId(defaultValue);

	const handleValueChange = (selectedId: string) => {
		// Find name for selected id and call external callback with the name (preferred)
		const found = categories.find((c) => c.id === selectedId);
		const out = found ? found.name : selectedId;
		onValueChange?.(out);
	};

	return (
		<Select
			{...props}
			value={internalValue}
			defaultValue={internalDefault}
			onValueChange={handleValueChange}
		>
			<SelectTrigger className={cn(className)} disabled={isLoading}>
				{isLoading && <Spinner className="size-4 text-muted-foreground mr-2" />}
				<SelectValue placeholder="Seleccionar categoría" />
			</SelectTrigger>

			{/* Force popper positioning and small offset to improve placement inside sheets/forms */}
			<SelectContent position="popper" sideOffset={6} align="start">
				<div className="px-3 py-2">
					<Input
						placeholder="Buscar categoría..."
						value={query}
						onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
						className="w-full"
					/>
				</div>

				<div className="max-h-56 overflow-auto">
					{filtered.length === 0 ? (
						<div className="px-3 py-2 text-sm text-muted-foreground">No hay resultados</div>
					) : (
						filtered.map((category) => (
							<SelectItem key={category.id} value={category.id}>
								{category.name}
							</SelectItem>
						))
					)}
				</div>
			</SelectContent>
		</Select>
	);
}
