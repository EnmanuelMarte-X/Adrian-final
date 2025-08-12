import { Skeleton } from "@/components/ui/skeleton";
import { useStorages } from "@/contexts/storages/queries";
import type { ProductStorageType, ProductType } from "@/types/models/products";
import { AlertCircleIcon, WarehouseIcon } from "lucide-react";
import { memo, useMemo } from "react";
import Link from "next/link";

interface ProductDialogLocationsProps {
	product: ProductType;
	isLoading: boolean;
}

function ProductDialogLocationsPure({
	product,
	isLoading,
}: ProductDialogLocationsProps) {
	const hasLocations = useMemo(() => {
		return product?.locations && product.locations.length > 0;
	}, [product]);

	const storageIds = useMemo(() => {
		return hasLocations
			? product?.locations.map(
					(location: ProductStorageType) => location.storageId,
				)
			: [];
	}, [product, hasLocations]);

	const {
		data: locations,
		isLoading: isLocationDataLoading,
		isError: isLocationDataError,
	} = useStorages({
		ids: storageIds,
		enabled: hasLocations,
	});

	return (
		<div className="flex flex-col gap-y-2 mt-4 px-6">
			<h3 className="text-muted-foreground text-sm">Ubicaciones</h3>
			<hr />
			{isLoading || !product ? (
				<div className="space-y-2 mt-2">
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-full" />
				</div>
			) : isLocationDataLoading && hasLocations ? (
				<div className="space-y-2 mt-2">
					{product.locations.map((location: ProductStorageType) => (
						<div key={location.storageId} className="flex justify-between">
							<Skeleton className="h-6 w-1/2" />
							<Skeleton className="h-6 w-20" />
						</div>
					))}
				</div>
			) : isLocationDataError ? (
				<div className="w-full flex items-center justify-center gap-2 p-4 text-destructive">
					<AlertCircleIcon className="h-5 w-5" />
					<span>Error al cargar las ubicaciones</span>
				</div>
			) : (
				<div className="my-2 space-y-2">
					{hasLocations &&
						product.locations.map((location: ProductStorageType) => (
							<div
								key={location.storageId}
								className="cursor-pointer flex flex-col sm:flex-row gap-2 justify-between hover:opacity-85"
							>
								<Link
									href={`/dashboard/storages/${location.storageId}`}
									className="font-medium hover:underline"
								>
									{locations?.storages.find((s) => s._id === location.storageId)
										?.name || "Ubicación desconocida"}
								</Link>

								<span className="text-sm text-muted-foreground">
									{location.stock} Stock
								</span>
							</div>
						))}
					{!hasLocations && (
						<div className="w-full flex flex-col items-center justify-center mt-2">
							<WarehouseIcon className="w-6 h-6 text-muted-foreground/70" />
							<p className="text-sm text-muted-foreground/70 text-center mt-2 max-w-[25ch] font-medium">
								No hay ubicaciones asignadas a este producto.
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export const ProductDialogLocations = memo(
	ProductDialogLocationsPure,
	(prevProps, nextProps) => {
		return (
			prevProps.product === nextProps.product &&
			prevProps.isLoading === nextProps.isLoading
		);
	},
);
