import { Skeleton } from "@/components/ui/skeleton";
import type { ProductImage, ProductType } from "@/types/models/products";
import { ImageOffIcon } from "lucide-react";
import { useMemo } from "react";

interface ProductDialogImagesProps {
	product: ProductType;
	isLoading: boolean;
}

export function ProductDialogImages({
	product,
	isLoading,
}: ProductDialogImagesProps) {
	const hasImages = useMemo(() => {
		return product?.images && product.images.length > 0;
	}, [product]);

	return (
		<div className="flex flex-col gap-y-2 px-6">
			<h3 className="text-muted-foreground text-sm">Imágenes</h3>
			<hr />
			{isLoading || !product ? (
				<div className="grid grid-cols-3 w-full gap-2 mt-2">
					<Skeleton className="h-20 w-full" />
					<Skeleton className="h-20 w-full" />
					<Skeleton className="h-20 w-full" />
				</div>
			) : (
				<div className="grid grid-cols-2 gap-2 mt-2">
					{product.images.map((image: ProductImage, index: number) => (
						<div key={index} className="relative aspect-square">
							<img
								src={image.url}
								alt={image.alt}
								className="object-cover rounded-md"
							/>
						</div>
					))}
					{!hasImages && (
						<div className="w-full flex flex-col items-center justify-center mt-2 col-span-2">
							<ImageOffIcon className="w-6 h-6 text-muted-foreground/70" />
							<p className="text-sm text-muted-foreground/70 text-center mt-2 max-w-[25ch] font-medium">
								No hay imágenes asignadas a este producto.
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
