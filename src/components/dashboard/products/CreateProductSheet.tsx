import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { CreateProductForm } from "./CreateProductForm";
import { useState } from "react";
import { ProductStoragesFrom } from "./ProductStoragesFrom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { productCapacityUnits } from "@/contexts/products/units";
import { useCreateProductMutation } from "@/contexts/products/queries";
import type {
	ProductType,
	ProductCapacityUnit,
	ProductImage,
	ProductStorageType,
} from "@/types/models/products";
import useFormPersist from "react-hook-form-persist";

type ProductStorageWithDisplay = ProductStorageType & { displayName: string };

const stepsHeader = {
	"create-product": {
		title: "Crear producto",
		description: `Ingresa la información del nuevo producto y haz clic en "Siguiente" para agregar el stock.`,
	},
	"add-stock": {
		title: "Agregar stock",
		description: `Agrega el stock del producto en los almacenes y haz clic en "Crear producto" para finalizar.`,
	},
};

export function CreateProductSheet({
	children,
}: { children?: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState<"create-product" | "add-stock">(
		"create-product",
	);
	const [isHoveringSteps, setIsHoveringSteps] = useState(false);
	const [productImages, setProductImages] = useState<string[]>([]);
	const [productStorages, setProductStorages] = useState<
		ProductStorageWithDisplay[]
	>([]);

	const form = useForm<ProductType>({
		defaultValues: {
			name: "",
			description: "",
			brand: "",
			category: "",
			capacity: 0,
			capacityUnit: "count" as ProductCapacityUnit, // Valor por defecto válido
			// stock is now calculated from locations
			retailPrice: 0,
			wholesalePrice: 0,
			cost: 0,
			minimumStock: 0,
		},
	});

	const { handleSubmit, setValue, reset, watch, getValues } = form;
	useFormPersist("form", { watch, setValue });

	const { mutateAsync: createProduct } = useCreateProductMutation({
		onSuccess: () => {
			// Reset state and close sheet. Success toast is handled by toast.promise
			resetAll();
			setIsOpen(false);
		},
	});

	const resetAll = () => {
		setStep("create-product");
		setProductStorages([]);
		setProductImages([]);
		reset();
	};

	// NOTE: removed hardcoded validCategories whitelist to accept categories
	// provided by the ProductCategorySelect source. Validation will only check
	// presence (non-empty) of the category in the form values.

	const validateForm = (values: ProductType) => {
		// Validar campos obligatorios
		if (!values.name?.trim()) {
			toast.error("El nombre del producto es obligatorio.");
			return false;
		}

		if (!values.brand?.trim()) {
			toast.error("La marca del producto es obligatoria.");
			return false;
		}

		if (!values.category?.trim()) {
			toast.error("La categoría es obligatoria.");
			return false;
		}

		// (No whitelist check) Only ensure category is present (non-empty)

		// Validar que la unidad de capacidad sea válida
		if (!values.capacityUnit || !productCapacityUnits.includes(values.capacityUnit as ProductCapacityUnit)) {
			toast.error("Debe seleccionar una unidad de capacidad válida.");
			return false;
		}

		if ((values.retailPrice ?? 0) <= 0) {
			toast.error("El precio de venta debe ser mayor a 0.");
			return false;
		}

		if ((values.wholesalePrice ?? 0) <= 0) {
			toast.error("El precio por mayor debe ser mayor a 0.");
			return false;
		}

		if ((values.cost ?? 0) <= 0) {
			toast.error("El costo debe ser mayor a 0.");
			return false;
		}

		if ((values.retailPrice ?? 0) < (values.cost ?? 0)) {
			toast.error("El precio de venta no puede ser menor al costo.");
			return false;
		}

		if ((values.wholesalePrice ?? 0) < (values.cost ?? 0)) {
			toast.error("El precio por mayor no puede ser menor al costo.");
			return false;
		}

		if ((values.retailPrice ?? 0) <= (values.wholesalePrice ?? 0)) {
			toast.error("El precio de venta debe ser mayor al precio por mayor.");
			return false;
		}

		if ((values.capacity ?? 0) <= 0) {
			toast.error("La capacidad debe ser mayor a 0.");
			return false;
		}

		if ((values.minimumStock ?? 0) <= 0) {
			toast.error("El stock mínimo debe ser mayor a 0.");
			return false;
		}

		return true;
	};

	const handleNextStep = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (validateForm(getValues())) {
			setStep("add-stock");
		}
	};

	const handleBackStep = () => setStep("create-product");
	const handleClose = () => setIsOpen(false);
	const isFirstStep = step === "create-product";
	const handleSheetOpenChange = (open: boolean) => setIsOpen(open);

	const prepareImagesForProduct = (imageUrls: string[]): ProductImage[] => {
		return imageUrls.map((url, index) => ({
			url,
			alt: `Imagen del producto ${index + 1}`,
		}));
	};

	const handleStoragesChange = (storages: ProductStorageWithDisplay[]) => {
		setProductStorages(storages);
		setValue("locations", storages as ProductStorageType[]);
	};

	const onSubmit = async (data: ProductType) => {
		try {
			if (productStorages.length === 0) {
				toast.error("Debes agregar al menos un almacén con stock.");
				return;
			}

			const storagesWithZeroStock = productStorages.filter(
				(storage) => (storage.stock ?? 0) <= 0,
			);
			if (storagesWithZeroStock.length > 0) {
				toast.error("Todos los almacenes deben tener stock mayor a 0.");
				return;
			}

			const images = prepareImagesForProduct(productImages);
			// Send as `locations` and preserve showInStore flag from each storage.
			// Previously this used a `storages` field and omitted showInStore,
			// which caused the backend to default showInStore to true.
			const productData = {
				...data,
				images,
				locations: productStorages.map((s) => ({
					storageId: s.storageId,
					stock: s.stock,
					showInStore: s.showInStore ?? true,
				})),
			};

			// Await the promise so any thrown errors can be handled if needed.
			await toast.promise(createProduct(productData as ProductType), {
				loading: "Creando producto...",
				success: "Producto creado exitosamente!",
				// Use the error value from the rejected promise if available
				error: (err: unknown) =>
					(err instanceof Error && err.message) ||
					"No se pudo crear el producto. Por favor intenta de nuevo.",
			});
		} catch {
			toast.error(
				"Error al procesar las información. Por favor intente de nuevo.",
			);
		}
	};

	const handleCapacityUnitChange = (unit: string) => {
		setValue(
			"capacityUnit",
			productCapacityUnits.includes(unit as ProductCapacityUnit)
				? (unit as ProductCapacityUnit)
				: "count",
		);
	};

	const handleCategoryChange = (category: string) => {
		// Set the category value directly (no whitelist). Accept any non-empty value.
		if (category?.trim()) {
			setValue("category", category);
		} else {
			// allow clearing the category
			setValue("category", "");
		}
	};
	const handleImagesChange = (imageUrls: string[]) => setProductImages(imageUrls);

	return (
		<Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
			<SheetTrigger asChild>
				{children ? children : <Button>Agregar producto</Button>}
			</SheetTrigger>
			<SheetContent className="sm:min-w-3xl w-full overflow-y-auto">
				<SheetHeader className="pb-0">
					<SheetTitle>{stepsHeader[step].title}</SheetTitle>
					<SheetDescription>{stepsHeader[step].description}</SheetDescription>
					<div
						className="grid grid-cols-2 gap-x-1 min-h-6 place-content-center mt-1"
						onMouseEnter={() => setIsHoveringSteps(true)}
						onMouseLeave={() => setIsHoveringSteps(false)}
					>
						{(["create-product", "add-stock"] as const).map((stepKey) => (
							<motion.span
								key={stepKey}
								className={`flex items-center justify-center ${step === stepKey ? "bg-primary" : "bg-muted"} w-full ${stepKey === "create-product" ? "rounded-l-full" : "rounded-r-full"} overflow-hidden relative`}
								animate={{ height: isHoveringSteps ? "1.5rem" : "0.25rem" }}
								transition={{ duration: 0.2, ease: "easeInOut" }}
							>
								<AnimatePresence>
									{isHoveringSteps && (
										<motion.span
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.15 }}
											className={`${step === stepKey ? "text-primary-foreground font-medium" : "text-muted-foreground"} text-[0.68rem] absolute inset-0 flex items-center justify-center`}
										>
											{stepsHeader[stepKey].title}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.span>
						))}
					</div>
				</SheetHeader>

				<FormProvider {...form}>
					<form id="create-product" onSubmit={handleSubmit(onSubmit)}>
						<AnimatePresence mode="wait">
							<motion.div
								key={step}
								initial={{ opacity: 0, x: isFirstStep ? -20 : 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: isFirstStep ? -20 : 20 }}
								transition={{ duration: 0.2 }}
							>
								{isFirstStep ? (
									<CreateProductForm
										onCategoryChange={handleCategoryChange}
										onCapacityUnitChange={handleCapacityUnitChange}
										onImagesChange={handleImagesChange}
										productImages={productImages}
									/>
								) : (
									<ProductStoragesFrom
										initialStorages={productStorages}
										onStoragesChange={handleStoragesChange}
									/>
								)}
							</motion.div>
						</AnimatePresence>
					</form>
				</FormProvider>

				<SheetFooter className="grid grid-cols-2 gap-2 items-start">
					{isFirstStep ? (
						<>
							<Button
								type="button"
								onClick={handleNextStep}
								className="flex items-center gap-2"
								form=""
							>
								Asignar stock <ArrowRight size={16} />
							</Button>
							<Button type="reset" variant="ghost" onClick={handleClose}>
								Cancelar
							</Button>
						</>
					) : (
						<>
							<Button type="submit" form="create-product">
								Crear producto
							</Button>
							<Button
								variant="outline"
								onClick={handleBackStep}
								className="flex items-center gap-2"
								type="button"
							>
								<ArrowLeft size={16} /> Atrás
							</Button>
						</>
					)}
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
