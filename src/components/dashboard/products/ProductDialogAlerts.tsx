import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductStorageType, ProductType } from "@/types/models/products";
import {
	AlertCircleIcon,
	AlertTriangleIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
} from "lucide-react";
import { memo, useMemo, useState } from "react";

interface ProductAlert {
	id: string;
	level: "critical" | "warning";
	message: string;
}

interface ProductDialogAlertsProps {
	product: ProductType;
	isLoading: boolean;
}

function ProductDialogAlertsPure({
	product,
	isLoading,
}: ProductDialogAlertsProps) {
	const [currentAlertIndex, setCurrentAlertIndex] = useState(0);

	const productAlerts = useMemo(() => {
		if (!product || isLoading) return [];

		const alerts: ProductAlert[] = [];

		if (
			(product.locations.reduce(
				(sum: number, l: ProductStorageType) => sum + (l.stock || 0),
				0,
			) || 0) <= (product.minimumStock ?? 0)
		) {
			alerts.push({
				id: "low-stock",
				level: "critical",
				message: `El stock actual (${
					product.locations.reduce(
						(sum: number, l: ProductStorageType) => sum + (l.stock || 0),
						0,
					) || 0
				}) está por debajo o igual al stock mínimo (${product.minimumStock ?? 0})`,
			});
		}

		if (product.retailPrice < product.cost) {
			alerts.push({
				id: "retail-price-below-cost",
				level: "critical",
				message: "El precio de venta es menor al costo del producto.",
			});
		}
		if (product.wholesalePrice < product.cost) {
			alerts.push({
				id: "wholesale-price-below-cost",
				level: "critical",
				message: "El precio al por mayor es menor al costo del producto.",
			});
		}

	
		if (!product.minimumStock) {
			alerts.push({
				id: "missing-minimum-stock",
				level: "warning",
				message: "El producto no tiene un stock mínimo definido.",
			});
		}
		if (!product.images || product.images.length === 0) {
			alerts.push({
				id: "missing-images",
				level: "warning",
				message:
					"El producto no tiene imágenes, no será mostrado en la tienda en línea.",
			});
		}
		if (!product.locations || product.locations.length === 0) {
			alerts.push({
				id: "missing-locations",
				level: "warning",
				message: "El producto no tiene ubicaciones asignadas.",
			});
		}
		if (!product.description) {
			alerts.push({
				id: "missing-description",
				level: "warning",
				message: "El producto no tiene una descripción.",
			});
		}
		if (!product.category) {
			alerts.push({
				id: "missing-category",
				level: "warning",
				message: "El producto no tiene una categoría asignada.",
			});
		}

		return alerts;
	}, [product, isLoading]);

	const handlePrevAlert = () => {
		setCurrentAlertIndex((prev) =>
			prev > 0 ? prev - 1 : productAlerts.length - 1,
		);
	};

	const handleNextAlert = () => {
		setCurrentAlertIndex((prev) =>
			prev < productAlerts.length - 1 ? prev + 1 : 0,
		);
	};

	if (productAlerts.length === 0 || isLoading || !product) return null;

	return (
		<div
			className={cn(
				"sticky top-[55px] z-10 flex flex-col gap-y-1 px-4 pt-5",
				"bg-background",
			)}
		>
			<Alert
				className={cn(
					"items-start justify-center border-0",
					productAlerts[currentAlertIndex].level === "critical"
						? "bg-destructive/20 [&>svg]:text-destructive/90"
						: "bg-warning/20 [&>svg]:text-warning/90",
				)}
			>
				{productAlerts[currentAlertIndex].level === "critical" ? (
					<AlertTriangleIcon
						color="currentColor"
						className="size-5 min-w-5 min-h-5"
					/>
				) : (
					<AlertCircleIcon
						color="currentColor"
						className="size-5 min-w-5 min-h-5"
					/>
				)}
				<AlertDescription>
					{productAlerts[currentAlertIndex].message}
				</AlertDescription>
			</Alert>
			<div className="flex items-center justify-center self-end mt-1 gap-2 text-xs text-muted-foreground">
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6"
					onClick={handlePrevAlert}
					disabled={productAlerts.length <= 1}
				>
					<ChevronLeftIcon className="size-4" />
				</Button>
				<span>
					{currentAlertIndex + 1} de {productAlerts.length}
				</span>
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6"
					onClick={handleNextAlert}
					disabled={productAlerts.length <= 1}
				>
					<ChevronRightIcon className="size-4" />
				</Button>
			</div>
		</div>
	);
}

export const ProductDialogAlerts = memo(
	ProductDialogAlertsPure,
	(prevProps, nextProps) => {
		return (
			prevProps.product?._id === nextProps.product?._id &&
			prevProps.isLoading === nextProps.isLoading
		);
	},
);
