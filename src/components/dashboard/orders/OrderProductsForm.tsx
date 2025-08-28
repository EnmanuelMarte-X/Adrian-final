import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	CheckIcon,
	PlusIcon,
	XIcon,
	PencilIcon,
	AlertCircleIcon,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ProductsSelect } from "@/components/dashboard/products/ProductsSelect";
import { StoragesSelect } from "@/components/dashboard/storages/StoragesSelect";
import type { OrderProduct } from "@/types/models/orders";
import type { ProductType, ProductStorageType } from "@/types/models/products";
import type { StorageType } from "@/types/models/storages";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useDebouncedCallback } from "@/hooks/use-debounce";

export type OrderProductWithDisplay = OrderProduct & {
	displayName: string;
	displayPrice: number;
	locationId?: string;
};

interface ProductFormData {
	quantity: number;
	discount: number;
}

function OrderProductInput({
	onSubmit,
	isFinish,
	onCancel,
	orderProduct,
	isEditing,
	editingProductData,
}: {
	onSubmit: (
		product: ProductType,
		quantity: number,
		discount?: number,
		locationId?: string,
	) => void;
	isFinish?: boolean;
	onCancel?: (action?: "edit" | "delete" | "cancel") => void;
	orderProduct?: OrderProductWithDisplay;
	isEditing?: boolean;
	editingProductData?: ProductType;
}) {
	const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
		editingProductData || null,
	);
	const [selectedStorage, setSelectedStorage] = useState<StorageType | null>(
		null,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		handleSubmit,
		control,
		formState: { errors },
		watch,
		setValue,
		trigger,
	} = useForm<ProductFormData>({
		defaultValues: {
			quantity: orderProduct?.quantity || 1,
			discount: orderProduct?.discount || 0,
		},
		mode: "onChange",
	});

	const quantity = watch("quantity");
	const discount = watch("discount");

	const calculateSubtotal = useCallback(() => {
		if (!selectedProduct && !orderProduct) return 0;
		const price =
			selectedProduct?.retailPrice || orderProduct?.displayPrice || 0;
		return price * (quantity || 1);
	}, [selectedProduct, orderProduct, quantity]);

	const calculateDiscountAmount = useCallback(() => {
		return calculateSubtotal() * ((discount || 0) / 100);
	}, [calculateSubtotal, discount]);

	const calculateTotal = useCallback(() => {
		return calculateSubtotal() - calculateDiscountAmount();
	}, [calculateSubtotal, calculateDiscountAmount]);

	const onFormSubmit = handleSubmit(async (data) => {
		const productToUse = selectedProduct || editingProductData;
		if (!productToUse) {
			toast.error("Debe seleccionar un producto");
			return;
		}

		if (data.quantity <= 0) {
			toast.error("La cantidad debe ser mayor a 0");
			return;
		}

		if (!selectedStorage) {
			toast.error("Debe seleccionar un almacén");
			return;
		}

		console.log("Selected Storage:", selectedStorage._id);
		console.log("Product Locations:", productToUse.locations);
		const locationStock =
			productToUse.locations?.find(
				(l: ProductStorageType) => String(l.storageId) === String(selectedStorage._id),
			)?.stock ?? 0;
		if (data.quantity > locationStock) {
			toast.error(
				`Stock insuficiente en el almacén seleccionado. Disponible: ${locationStock}`,
			);
			return;
		}

		setIsSubmitting(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay for UX
			onSubmit(productToUse, data.quantity, data.discount, selectedStorage.id);
		} catch {
			toast.error("Error al agregar el producto");
		} finally {
			setIsSubmitting(false);
		}
	});

	const handleQuantityChange = useCallback(
		(value: string) => {
			const numValue = Number.parseInt(value) || 0;
			setValue("quantity", Math.max(1, numValue));
			trigger("quantity");
		},
		[setValue, trigger],
	);

	const handleDiscountChange = useCallback(
		(value: string) => {
			const numValue = Number.parseFloat(value) || 0;
			setValue("discount", Math.max(0, Math.min(100, numValue)));
			trigger("discount");
		},
		[setValue, trigger],
	);

	if (isFinish && orderProduct) {
		const subtotal = orderProduct.displayPrice * orderProduct.quantity;
		const discountAmount = subtotal * ((orderProduct.discount ?? 0) / 100);
		const total = subtotal - discountAmount;

		return (
			<div className="p-4 border rounded-lg bg-card">
				<div className="flex justify-between items-start">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<h4 className="font-medium text-sm">
								{orderProduct.displayName}
							</h4>
							{(orderProduct.discount ?? 0) > 0 && (
								<Badge variant="secondary" className="text-xs">
									{orderProduct.discount}% DESC.
								</Badge>
							)}
						</div>
						<div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
							<div>
								<span className="font-medium">Cantidad:</span>{" "}
								{orderProduct.quantity}
							</div>
							<div>
								<span className="font-medium">Precio unitario:</span> $
								{orderProduct.displayPrice.toFixed(2)}
							</div>
							{(orderProduct.discount ?? 0) > 0 && (
								<div>
									<span className="font-medium">Descuento:</span> $
									{discountAmount.toFixed(2)}
								</div>
							)}
							<div className="font-medium text-foreground">
								<span>Total:</span> ${total.toFixed(2)}
							</div>
						</div>
					</div>
					<div className="flex gap-1 ml-4">
						{!isEditing && (
							<Button
								size="sm"
								variant="ghost"
								className="h-8 w-8 p-0 hover:bg-primary/10"
								onClick={() => onCancel?.("edit")}
							>
								<PencilIcon className="h-3 w-3" />
							</Button>
						)}
						<Button
							size="sm"
							variant="ghost"
							className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
							onClick={() => onCancel?.("delete")}
						>
							<XIcon className="h-3 w-3" />
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="p-4 border rounded-lg space-y-2 bg-card/60 border-dashed">
			<div className="space-y-2">
				<Label className="text-sm font-medium">Producto</Label>
				<ProductsSelect
					className="w-full"
					onChange={(value) => setSelectedProduct(value || null)}
					defaultValue={orderProduct?.productId}
					placeholder="Buscar y seleccionar producto"
				/>
			</div>

			{(selectedProduct || editingProductData) && (
				<div className="space-y-2">
					<Label className="text-sm font-medium">Almacén</Label>
					<StoragesSelect
						className="w-full"
						onChange={(value) => setSelectedStorage(value || null)}
					/>
					{selectedStorage && selectedProduct && (
						<div className="text-xs text-muted-foreground">
							Stock disponible:{" "}
							{selectedProduct.locations.find(l => l.storageId === selectedStorage._id)?.stock || 0}{" "}
							unidades
						</div>
					)}
				</div>
			)}

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="quantity" className="text-sm font-medium">
						Cantidad
					</Label>
					<Controller
						name="quantity"
						control={control}
						rules={{
							required: "La cantidad es requerida",
							min: { value: 1, message: "Mínimo 1 unidad" },
							validate: (value) =>
								Number.isInteger(value) || "Debe ser un número entero",
						}}
						render={({ field }) => (
							<div className="space-y-1">
								<Input
									{...field}
									id="quantity"
									type="number"
									min="1"
									step="1"
									className={cn(errors.quantity && "border-destructive")}
									onChange={(e) => handleQuantityChange(e.target.value)}
								/>
								{errors.quantity && (
									<p className="text-xs text-destructive flex items-center gap-1">
										<AlertCircleIcon className="h-3 w-3" />
										{errors.quantity.message}
									</p>
								)}
							</div>
						)}
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="discount" className="text-sm font-medium">
						Descuento (%)
					</Label>
					<Controller
						name="discount"
						control={control}
						rules={{
							min: { value: 0, message: "Mínimo 0%" },
							max: { value: 100, message: "Máximo 100%" },
						}}
						render={({ field }) => (
							<div className="space-y-1">
								<Input
									{...field}
									id="discount"
									type="number"
									min="0"
									max="100"
									step="0.1"
									className={cn(errors.discount && "border-destructive")}
									onChange={(e) => handleDiscountChange(e.target.value)}
								/>
								{errors.discount && (
									<p className="text-xs text-destructive flex items-center gap-1">
										<AlertCircleIcon className="h-3 w-3" />
										{errors.discount.message}
									</p>
								)}
							</div>
						)}
					/>
				</div>
			</div>

			{(selectedProduct || editingProductData) && quantity > 0 && (
				<div className="space-y-2 p-3 bg-muted/50 rounded-md">
					<h5 className="text-sm font-medium">Resumen</h5>
					<div className="grid grid-cols-2 gap-2 text-xs">
						<div>Subtotal: ${calculateSubtotal().toFixed(2)}</div>
						{discount > 0 && (
							<div className="text-success">
								Descuento: -${calculateDiscountAmount().toFixed(2)}
							</div>
						)}
						<div className="font-medium col-span-2 pt-1 border-t">
							Total: ${calculateTotal().toFixed(2)}
						</div>
					</div>
				</div>
			)}

			<div className="grid grid-cols-2 gap-2 mt-4">
				<Button
					type="button"
					size="sm"
					onClick={onFormSubmit}
					disabled={
						!selectedProduct ||
						isSubmitting ||
						Object.keys(errors).length > 0 ||
						!selectedStorage
					}
				>
					<CheckIcon className="size-4 mr-2" />
					{isSubmitting ? "Agregando..." : isEditing ? "Actualizar" : "Agregar"}
				</Button>
				<Button
					type="button"
					size="sm"
					variant="outline"
					onClick={() => onCancel?.("cancel")}
					disabled={isSubmitting}
				>
					<XIcon className="size-4 mr-2" />
					Cancelar
				</Button>
			</div>
		</div>
	);
}

export function OrderProductsForm({
	initialProducts = [],
	onProductsChange,
}: {
	initialProducts?: OrderProductWithDisplay[];
	onProductsChange?: (products: OrderProductWithDisplay[]) => void;
}) {
	const [orderProducts, setOrderProducts] =
		useState<OrderProductWithDisplay[]>(initialProducts);
	const [showNewForm, setShowNewForm] = useState(false);
	const [editingProductIndex, setEditingProductIndex] = useState<number | null>(
		null,
	);
	const [editingProductData, setEditingProductData] =
		useState<ProductType | null>(null);

	// Use debounced callback to prevent infinite re-renders
	const debouncedOnProductsChange = useDebouncedCallback(
		(products: OrderProductWithDisplay[]) => {
			onProductsChange?.(products);
		},
		100,
	);

	// Update parent component when products change with debounced callback
	useEffect(() => {
		debouncedOnProductsChange(orderProducts);
	}, [orderProducts, debouncedOnProductsChange]);

	const handleSubmitProduct = useCallback(
		(
			product: ProductType,
			quantity: number,
			discount = 0,
			locationId?: string,
		) => {
			setOrderProducts((prevProducts) => {
				let updatedProducts: OrderProductWithDisplay[];

				if (editingProductIndex !== null) {
					// Update existing product
					updatedProducts = [...prevProducts];
					updatedProducts[editingProductIndex] = {
						...updatedProducts[editingProductIndex],
						quantity,
						discount,
						productId: product._id,
						displayName: product.name,
						displayPrice: product.retailPrice,
						locationId,
					};
				} else {
					// Check for existing product y almacén
					const existingIndex = prevProducts.findIndex(
						(item) =>
							item.productId === product._id && item.locationId === locationId,
					);

					if (existingIndex >= 0) {
						// Update quantity of existing product
						updatedProducts = [...prevProducts];
						updatedProducts[existingIndex] = {
							...updatedProducts[existingIndex],
							quantity: updatedProducts[existingIndex].quantity + quantity,
							discount,
						};
						toast.success(`Cantidad actualizada para ${product.name}`);
					} else {
						// Add new product
						const newProduct: OrderProductWithDisplay = {
							productId: product._id,
							quantity,
							discount,
							price: product.retailPrice,
							displayName: product.name,
							displayPrice: product.retailPrice,
							locationId,
						};
						updatedProducts = [...prevProducts, newProduct];
						toast.success(`${product.name} agregado a la factura`);
					}
				}

				return updatedProducts;
			});

			// Reset editing state
			setEditingProductIndex(null);
			setEditingProductData(null);
			setShowNewForm(false);
		},
		[editingProductIndex],
	);

	const handleProductAction = useCallback(
		(index: number, action: "edit" | "delete" | "cancel") => {
			if (action === "delete") {
				const productName = orderProducts[index].displayName;
				setOrderProducts((prev) => prev.filter((_, i) => i !== index));
				toast.success(`${productName} eliminado de la factura`);
			} else if (action === "edit") {
				const currentProduct = orderProducts[index];
				setEditingProductIndex(index);
				setEditingProductData({
					_id: currentProduct.productId,
					name: currentProduct.displayName,
					retailPrice: currentProduct.displayPrice,
					category: "",
					description: "",
					cost: 0,
					wholesalePrice: 0,
					minimumStock: 0,
					stock: 0,
					locations: [],
					brand: "",
					capacity: 0,
					capacityUnit: "count",
					images: [],
					updatedAt: new Date(),
				});
				setShowNewForm(true);
			} else {
				setEditingProductIndex(null);
				setEditingProductData(null);
				setShowNewForm(false);
			}
		},
		[orderProducts],
	);

	const calculateTotals = useCallback(() => {
		return orderProducts.reduce(
			(acc, product) => {
				const subtotal = product.displayPrice * product.quantity;
				const discountAmount = subtotal * ((product.discount || 0) / 100);
				const total = subtotal - discountAmount;

				return {
					totalQuantity: acc.totalQuantity + product.quantity,
					subtotal: acc.subtotal + subtotal,
					totalDiscount: acc.totalDiscount + discountAmount,
					total: acc.total + total,
				};
			},
			{ totalQuantity: 0, subtotal: 0, totalDiscount: 0, total: 0 },
		);
	}, [orderProducts]);

	const totals = calculateTotals();

	return (
		<div className="space-y-2">
			{orderProducts.length > 0 && (
				<div className="p-4 bg-muted/30 rounded-lg">
					<h4 className="font-medium mb-3 text-sm">Resumen de la factura</h4>
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="text-muted-foreground">Total productos:</span>
							<span className="ml-2 font-medium">{totals.totalQuantity}</span>
						</div>
						<div>
							<span className="text-muted-foreground">Subtotal:</span>
							<span className="ml-2 font-medium">
								${totals.subtotal.toFixed(2)}
							</span>
						</div>
						{totals.totalDiscount > 0 && (
							<div>
								<span className="text-muted-foreground">Descuentos:</span>
								<span className="ml-2 font-medium text-success">
									-${totals.totalDiscount.toFixed(2)}
								</span>
							</div>
						)}
						<div className="col-span-2 pt-2 border-t">
							<span className="text-muted-foreground">Total factura:</span>
							<span className="ml-2 font-bold text-lg">
								${totals.total.toFixed(2)}
							</span>
						</div>
					</div>
				</div>
			)}

			<div className="space-y-3">
				{orderProducts.map((product, index) =>
					editingProductIndex === index ? (
						<OrderProductInput
							key={`editing-${product.productId}-${index}`}
							onSubmit={handleSubmitProduct}
							onCancel={() => handleProductAction(index, "cancel")}
							orderProduct={product}
							isEditing={true}
							editingProductData={editingProductData || undefined}
						/>
					) : (
						<OrderProductInput
							key={`${product.productId}-${index}`}
							onSubmit={() => {}}
							isFinish={true}
							onCancel={(action) =>
								handleProductAction(index, action || "delete")
							}
							orderProduct={product}
						/>
					),
				)}
			</div>

			{orderProducts.length === 0 && !showNewForm && (
				<div className="text-center py-4 text-muted-foreground">
					<AlertCircleIcon className="h-8 w-8 mx-auto mb-2 opacity-80" />
					<p className="text-sm">No hay productos en esta factura</p>
					<p className="text-xs">
						Haz clic en "Agregar Producto" para comenzar
					</p>
				</div>
			)}

			{showNewForm ? (
				<OrderProductInput
					onSubmit={handleSubmitProduct}
					onCancel={() => setShowNewForm(false)}
				/>
			) : (
				<Button
					variant="outline"
					className="w-full h-12 border-dashed"
					onClick={() => setShowNewForm(true)}
				>
					<PlusIcon className="size-4 mr-2" />
					Agregar Producto
				</Button>
			)}
		</div>
	);
}
