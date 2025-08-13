import {
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductType } from "@/types/models/products";
import { memo, useMemo } from "react";

interface ProductDialogHeaderProps {
	product?: ProductType | null;
	isLoading: boolean;
	isError: boolean;
}

function ProductDialogHeaderPure({
	product,
	isLoading,
	isError,
}: ProductDialogHeaderProps) {
	const isHidden = useMemo(
		() => !product || isLoading || isError,
		[product, isLoading, isError],
	);

	return (
		<DialogHeader
			data-hidden={isHidden}
			className="data-[hidden=true]:sr-only sticky top-0 z-20 bg-secondary px-6 pt-6 pb-4 shadow-sm"
		>
			<DialogTitle>
				{isLoading || !product ? (
					<Skeleton className="h-7 w-1/2" />
				) : (
					`${product.name} - ${product.brand}`
				)}
			</DialogTitle>
			<DialogDescription asChild className="line-clamp-2">
				{isLoading || !product ? (
					<>
						<Skeleton className="h-4 w-3/4 mt-1" />
						<Skeleton className="h-4 w-2/3 mt-1" />
					</>
				) : (
					product.description
				)}
			</DialogDescription>
		</DialogHeader>
	);
}

export const ProductDialogHeader = memo(
	ProductDialogHeaderPure,
	(prevProps, nextProps) => {
		return (
			prevProps.product?._id === nextProps.product?._id &&
			prevProps.isLoading === nextProps.isLoading &&
			prevProps.isError === nextProps.isError
		);
	},
);
