import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { ProductCapacityUnitSelect } from "./ProductCapacityUnitSelect";
import { ProductCategorySelect } from "./ProductCategorySelect";
import { Textarea } from "@/components/ui/textarea";
import { ProductImageDropzone } from "./ProductImageDropzone";

interface CreateProductFormProps {
	onCategoryChange: (category: string) => void;
	onCapacityUnitChange: (unit: string) => void;
	onImagesChange: (files: File[]) => void;
	productImages: File[];
}

export function CreateProductForm({
	onCategoryChange,
	onCapacityUnitChange,
	onImagesChange,
	productImages,
}: CreateProductFormProps) {
	const {
		register,
		formState: { isSubmitting },
	} = useFormContext();

	return (
		<div className="flex flex-col grow">
			<div className="grid grid-cols-2 gap-4 px-5">
				<div className="flex flex-col gap-y-2">
					<Label required htmlFor="name">
						Nombre
					</Label>
					<Input
						id="name"
						placeholder="Mi producto"
						required
						{...register("name", { required: "Este campo es obligatorio" })}
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<Label required htmlFor="brand">
						Marca
					</Label>
					<Input
						id="brand"
						placeholder="Mi marca"
						required
						{...register("brand")}
					/>
				</div>
				<div className="flex flex-col gap-y-2 col-span-2">
					<Label htmlFor="description">Descripción</Label>
					<Textarea
						id="description"
						placeholder="Descripción asombrosa detallada del producto..."
						{...register("description")}
						rows={4}
					/>
				</div>
				<div className="flex flex-col gap-y-2 w-full">
					<Label required htmlFor="category">
						Categoría
					</Label>
					<ProductCategorySelect
						className="w-full"
						{...register("category")}
						onValueChange={onCategoryChange}
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<Label required htmlFor="cost" className="text-right">
						Costo
					</Label>
					<Input
						id="cost"
						type="number"
						required
						step="0.01"
						pattern="[0-9]*(\.[0-9]{0,2})?"
						min={1}
						{...register("cost", {
							valueAsNumber: true,
							min: { value: 0, message: "El costo debe ser mayor a 0" },
						})}
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<Label required htmlFor="retailPrice">
						Precio Venta
					</Label>
					<Input
						id="retailPrice"
						required
						type="number"
						step="0.01"
						min={1}
						pattern="[0-9]*(\.[0-9]{0,2})?"
						{...register("retailPrice", {
							valueAsNumber: true,
							min: { value: 0, message: "El precio debe ser mayor a 0" },
						})}
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<Label required htmlFor="wholesalePrice">
						Precio Por Mayor
					</Label>
					<Input
						id="wholesalePrice"
						required
						type="number"
						step="0.01"
						min={1}
						pattern="[0-9]*(\.[0-9]{0,2})?"
						{...register("wholesalePrice", {
							valueAsNumber: true,
							min: { value: 0, message: "El precio debe ser mayor a 0" },
						})}
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<Label required htmlFor="capacity" className="text-right">
						Capacidad
					</Label>
					<Input
						id="capacity"
						type="number"
						required
						step="0.01"
						min={1}
						pattern="[0-9]*(\.[0-9]{0,2})?"
						{...register("capacity", {
							valueAsNumber: true,
							min: { value: 0, message: "La capacidad debe ser mayor a 0" },
						})}
					/>
				</div>
				<div className="flex flex-col gap-y-2 w-full">
					<Label required htmlFor="capacityUnit" className="text-right">
						Unidad
					</Label>
					<div>
						<ProductCapacityUnitSelect
							className="w-full"
							{...register("capacityUnit")}
							onValueChange={onCapacityUnitChange}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-y-2 col-span-2">
					<Label required htmlFor="minimumStock" className="text-right">
						Stock Mínimo
					</Label>
					<Input
						id="minimumStock"
						type="number"
						required
						step="1"
						min={1}
						pattern="[0-9]*"
						{...register("minimumStock", {
							valueAsNumber: true,
							min: {
								value: 0,
								message: "El stock mínimo no puede ser negativo",
							},
						})}
					/>
				</div>
				<div className="flex flex-col gap-y-2 col-span-2">
					<Label htmlFor="location">Ubicación</Label>
					<Input
						id="location"
						placeholder="Ubicación se actualizará automáticamente"
						disabled
						{...register("location")}
					/>
				</div>
				<div className="col-span-2 mt-4">
					<Label htmlFor="images" className="mb-4">
						Imágenes del Producto
					</Label>
					<ProductImageDropzone
						disabled={isSubmitting}
						images={productImages}
						onImagesChange={onImagesChange}
					/>
				</div>
			</div>
		</div>
	);
}
