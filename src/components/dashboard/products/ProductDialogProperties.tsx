import { OrderValue } from "@/components/dashboard/orders/OrderValue";
import { currencyFormat, dateFormat } from "@/config/formats";
import { unknownProductValue } from "@/config/products";
import {
	getDateFromObjectId,
	getProductCapacityUnitLabel,
	getUnsetValue,
} from "@/lib/utils";
import type { ProductStorageType, ProductType } from "@/types/models/products";
import { useMemo } from "react";

interface ProductDialogPropertiesProps {
	product: ProductType;
	isLoading: boolean;
}

export function ProductDialogProperties({
	product,
	isLoading,
}: ProductDialogPropertiesProps) {
	const totalStock = useMemo(() => {
		if (!product || isLoading) return 0;
		return product.locations.reduce(
			(sum: number, location: ProductStorageType) =>
				sum + (location.stock || 0),
			0,
		);
	}, [product, isLoading]);

	return (
		<div className="grid grid-cols-2 gap-4 px-6">
			<div className="flex flex-col col-span-2">
				<h3 className="text-muted-foreground text-sm mb-3">Propiedades</h3>
				<hr />
			</div>
			<div className="flex flex-col gap-y-5">
				<OrderValue label="Precio de venta" isLoading={isLoading}>
					{!isLoading && product && currencyFormat.format(product.retailPrice)}
				</OrderValue>
				<OrderValue label="Precio al por mayor" isLoading={isLoading}>
					{!isLoading &&
						product &&
						currencyFormat.format(product.wholesalePrice)}
				</OrderValue>
				<OrderValue label="Costo" isLoading={isLoading}>
					{!isLoading && product && currencyFormat.format(product.cost)}
				</OrderValue>
				<OrderValue label="Stock" isLoading={isLoading}>
					{!isLoading && product && getUnsetValue(totalStock, 0)}
				</OrderValue>
				<OrderValue label="Stock mínimo" isLoading={isLoading}>
					{!isLoading && product && getUnsetValue(product.minimumStock, 0)}
				</OrderValue>
			</div>
			<div className="flex flex-col gap-y-5">
				<OrderValue label="SKU" isLoading={isLoading}>
					{!isLoading &&
						product &&
						getUnsetValue(product.sku, unknownProductValue)}
				</OrderValue>
				<OrderValue label="Capacidad" isLoading={isLoading}>
					{!isLoading &&
						product &&
						`${product.capacity} ${getProductCapacityUnitLabel(
							product.capacityUnit,
							product.capacity,
						)}`}
				</OrderValue>
				<OrderValue label="Categoría" isLoading={isLoading}>
					{!isLoading && product && product.category}
				</OrderValue>
				<OrderValue label="Fecha de creación" isLoading={isLoading}>
					{!isLoading &&
						product &&
						dateFormat(getDateFromObjectId(product._id), "PP")}
				</OrderValue>
			</div>
		</div>
	);
}
