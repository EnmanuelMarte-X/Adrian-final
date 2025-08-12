import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductCapacityUnitSelect } from "./ProductCapacityUnitSelect";
import { ProductCategorySelect } from "./ProductCategorySelect";
import { toast } from "sonner";
import { useUpdateProductMutation } from "@/contexts/products/queries";
import type {
	ProductType,
	ProductCapacityUnit,
	ProductStorageType,
} from "@/types/models/products";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { productCapacityUnits } from "@/contexts/products/units";
import { Textarea } from "@/components/ui/textarea";
import { ProductStoragesFrom } from "./ProductStoragesFrom";

type ProductStorageWithDisplay = ProductStorageType & {
	displayName: string;
};

export function EditProductFrom({
	product,
	onSuccess,
}: {
	product?: ProductType | null;
	onSuccess: () => void;
}) {
	const [productStorages, setProductStorages] = useState<
		ProductStorageWithDisplay[]
	>(
		product?.locations?.map((location) => ({
			...location,
			displayName: "",
		})) || [],
	);

	const { control, register, handleSubmit, setValue, reset } = useForm({
		defaultValues: {
			name: product?.name,
			description: product?.description,
			brand: product?.brand,
			category: product?.category,
			capacity: product?.capacity,
			capacityUnit: product?.capacityUnit,
			stock: product?.locations?.reduce(
				(acc, loc) => acc + (loc.stock || 0),
				0,
			),
			minimumStock: product?.minimumStock,
			retailPrice: product?.retailPrice,
			wholesalePrice: product?.wholesalePrice,
			cost: product?.cost,
		},
	});

	useEffect(() => {
		if (product) {
			reset({
				name: product.name,
				description: product.description,
				brand: product.brand,
				category: product.category,
				capacity: product.capacity,
				capacityUnit: product.capacityUnit,
				stock: product.stock,
				minimumStock: product.minimumStock,
				retailPrice: product.retailPrice,
				wholesalePrice: product.wholesalePrice,
				cost: product.cost,
			});
			setProductStorages(
				product.locations?.map((location) => ({
					...location,
					displayName: "",
				})) || [],
			);
		}
	}, [product, reset]);

	const { mutateAsync: updateProduct } = useUpdateProductMutation(
		product?._id,
		{
			onSuccess,
		},
	);

	const onSubmit = async (data: Partial<ProductType>) => {
		if ((data.retailPrice ?? 0) < (data.cost ?? 0)) {
			toast.error("El precio de venta no puede ser menor al costo.");
			return;
		}

		if ((data.wholesalePrice ?? 0) < (data.cost ?? 0)) {
			toast.error("El precio por mayor no puede ser menor al costo.");
			return;
		}

		if ((data.stock ?? 0) < 0) {
			toast.error("El stock no puede ser negativo.");
			return;
		}

		if ((data.capacity ?? 0) <= 0) {
			toast.error("La capacidad debe ser mayor a 0.");
			return;
		}

		if ((data.retailPrice ?? 0) <= (data.wholesalePrice ?? 0)) {
			toast.error("El precio de venta debe ser mayor al precio por mayor.");
			return;
		}

		if (!data.name || !data.brand || !data.category) {
			toast.error("Por favor completa todos los campos obligatorios.");
			return;
		}

		const updatedData = {
			...data,
			locations: productStorages,
		};

		toast.promise(updateProduct(updatedData), {
			loading: "Actualizando producto...",
			success: "¡Producto actualizado con éxito!",
			error: "Error al actualizar el producto.",
		});
	};

	const handleCapacityUnitChange = (unit: string) => {
		if (productCapacityUnits.includes(unit as ProductCapacityUnit)) {
			setValue("capacityUnit", unit as ProductCapacityUnit);
			return;
		}

		setValue("capacityUnit", "count");
	};

	const handleStoragesChange = (storages: ProductStorageWithDisplay[]) => {
		const totalStock = storages.reduce(
			(sum, storage) => sum + storage.stock,
			0,
		);
		setValue("stock", totalStock);

		setProductStorages(
			storages.map((storage) => ({
				storageId: storage.storageId,
				productId: product?._id ?? "",
				stock: storage.stock,
				displayName: storage.displayName,
				showInStore: storage.showInStore ?? true,
			})),
		);
	};

	return (
		<form
			id="edit-product"
			className="flex flex-col grow"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="grid sm:grid-cols-2 grid-cols-1 gap-4 px-5">
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="name" className="text-right">
						Nombre
					</Label>
					<Input
						id="name"
						required
						{...register("name")}
						className="col-span-3"
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="brand" className="text-right">
						Marca
					</Label>
					<Input
						id="brand"
						required
						{...register("brand")}
						className="col-span-3"
					/>
				</div>
				<div className="flex flex-col gap-y-2 sm:col-span-2">
					<Label htmlFor="description" className="text-right">
						Descripción
					</Label>
					<Textarea
						id="description"
						{...register("description")}
						className="col-span-3"
						rows={4}
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="category">Categoría</Label>
					<Controller
						control={control}
						name="category"
						render={({ field }) => (
							<ProductCategorySelect
								{...field}
								value={field.value}
								defaultValue={product?.category}
								className="w-full truncate"
							/>
						)}
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="capacity" className="text-right">
						Capacidad
					</Label>
					<Input
						id="capacity"
						type="number"
						required
						step="0.01"
						pattern="[0-9]*(\.[0-9]{0,2})?"
						{...register("capacity", {
							valueAsNumber: true,
							min: { value: 0, message: "La capacidad debe ser mayor a 0" },
						})}
						className="col-span-3"
					/>
				</div>
				<div className="flex flex-col gap-y-2 w-full">
					<Label htmlFor="capacityUnit" className="text-right">
						Unidad
					</Label>
					<Controller
						control={control}
						name="capacityUnit"
						render={({ field }) => (
							<ProductCapacityUnitSelect
								onValueChange={handleCapacityUnitChange}
								value={field.value}
								defaultValue={product?.capacityUnit}
								className="w-full truncate"
							/>
						)}
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="stock" className="text-right">
						Stock Total
					</Label>
					<Input
						id="stock"
						required
						type="number"
						step="0.01"
						pattern="[0-9]*(\.[0-9]{0,2})?"
						{...register("stock", {
							valueAsNumber: true,
							min: { value: 0, message: "El stock no puede ser negativo" },
						})}
						className="col-span-3"
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-y-2 col-span-2">
					<Label htmlFor="minimumStock" className="text-right">
						Stock Mínimo
					</Label>
					<Input
						id="minimumStock"
						type="number"
						required
						step="1"
						pattern="[0-9]*"
						{...register("minimumStock", {
							valueAsNumber: true,
							min: {
								value: 0,
								message: "El stock mínimo no puede ser negativo",
							},
						})}
						className="col-span-3"
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="retailPrice">Precio Venta</Label>
					<Input
						id="retailPrice"
						required
						type="number"
						step="0.01"
						pattern="[0-9]*(\.[0-9]{0,2})?"
						{...register("retailPrice", {
							valueAsNumber: true,
							min: { value: 0, message: "El precio debe ser mayor a 0" },
						})}
						className="col-span-3"
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="wholesalePrice">Precio Por Mayor</Label>
					<Input
						id="wholesalePrice"
						required
						type="number"
						step="0.01"
						pattern="[0-9]*(\.[0-9]{0,2})?"
						{...register("wholesalePrice", {
							valueAsNumber: true,
							min: { value: 0, message: "El precio debe ser mayor a 0" },
						})}
						className="col-span-3"
					/>
				</div>
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="cost" className="text-right">
						Costo
					</Label>
					<Input
						id="cost"
						type="number"
						required
						step="0.01"
						pattern="[0-9]*(\.[0-9]{0,2})?"
						min={0}
						{...register("cost", {
							valueAsNumber: true,
							min: { value: 0, message: "El costo debe ser mayor a 0" },
						})}
						className="col-span-3"
					/>
				</div>
			</div>
			<div className="mt-6">
				<Label htmlFor="storages" className="my-2 ml-5">
					Distribución de Stock por Almacén
				</Label>
				<ProductStoragesFrom
					productId={product?._id}
					initialStorages={productStorages as ProductStorageWithDisplay[]}
					onStoragesChange={handleStoragesChange}
				/>
			</div>
		</form>
	);
}
