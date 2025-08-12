import { Label } from "@/components/ui/label";
import { ProductCategorySelect } from "../ProductCategorySelect";
import { memo } from "react";

interface CategoryFilterProps {
	value: string | undefined;
	onValueChange: (category: string | undefined) => void;
}

function CategoryFilterComponent({
	value,
	onValueChange,
}: CategoryFilterProps) {
	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor="category">Categoría</Label>
			<ProductCategorySelect
				value={value || ""}
				onValueChange={onValueChange}
			/>
		</div>
	);
}

export const CategoryFilter = memo(CategoryFilterComponent);
