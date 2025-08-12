import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useProduct } from "@/contexts/products/queries";
import { ProductDialogHeader } from "./ProductDialogHeader";
import { ProductDialogAlerts } from "./ProductDialogAlerts";
import { ProductDialogProperties } from "./ProductDialogProperties";
import { ProductDialogLocations } from "./ProductDialogLocations";
import { ProductDialogImages } from "./ProductDialogImages";
import { ProductDialogFooter } from "./ProductDialogFooter";
import { ProductDialogLoading } from "./ProductDialogLoading";

export function ProductDialog({
	productId,
	children,
	isOpen,
	onOpenChange,
}: {
	isOpen?: boolean;
	onOpenChange?: (isOpen: boolean) => void;
	children?: React.ReactNode;
	productId: string;
}) {
	const { data: product, isLoading, isError } = useProduct(productId);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			{children && <DialogTrigger asChild>{children}</DialogTrigger>}
			<DialogContent
				style={{
					scrollbarWidth: "thin",
				}}
				className="max-h-[calc(100vh-6rem)] overflow-y-auto p-0"
			>
				<ProductDialogHeader
					product={product}
					isLoading={isLoading}
					isError={isError}
				/>

				<ProductDialogLoading isLoading={isLoading} isError={isError} />

				{!isLoading && !isError && product && (
					<div className="animate-in fade-in">
						<ProductDialogAlerts product={product} isLoading={isLoading} />
						<ProductDialogProperties product={product} isLoading={isLoading} />
						<ProductDialogLocations product={product} isLoading={isLoading} />
						<ProductDialogImages product={product} isLoading={isLoading} />
						<ProductDialogFooter product={product} productId={productId} />
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
