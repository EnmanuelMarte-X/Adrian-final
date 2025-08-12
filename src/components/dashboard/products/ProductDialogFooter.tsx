import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { DeleteProductAlertDialog } from "./DeleteProductAlertDialog";
import { EditProductSheet } from "./EditProductSheet";
import type { ProductType } from "@/types/models/products";

interface ProductDialogFooterProps {
	product?: ProductType;
	productId: string;
}

export function ProductDialogFooter({
	product,
	productId,
}: ProductDialogFooterProps) {
	if (!product) return null;

	return (
		<DialogFooter className="grid grid-cols-2 gap-2 px-4 pb-4 pt-6 items-end bg-content mt-6">
			<DeleteProductAlertDialog productId={productId}>
				<Button variant="destructive">Eliminar producto</Button>
			</DeleteProductAlertDialog>

			<EditProductSheet product={product}>
				<Button variant="secondary" className="bg-secondary/50">
					Editar producto
				</Button>
			</EditProductSheet>
		</DialogFooter>
	);
}
