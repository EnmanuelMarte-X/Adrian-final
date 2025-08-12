import {
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteProductMutation } from "@/contexts/products/queries";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function DeleteProductAlertDialog({
	productId,
	isOpen,
	onOpenChange,
	children,
}: {
	productId: string;
	isOpen?: boolean;
	children?: React.ReactNode;
	onOpenChange?: (isOpen: boolean) => void;
}) {
	const { mutateAsync: deleteProduct, isPending } = useDeleteProductMutation(
		productId,
		{
			onSuccess: () => onOpenChange?.(false),
		},
	);

	const handleDeleteProduct = () => {
		toast.promise(deleteProduct, {
			loading: "Eliminando producto...",
			success: "Producto eliminado exitosamente!",
			error: "No se pudo eliminar el producto. Por favor intenta de nuevo.",
		});
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			{children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						¿Estás seguro de eliminar este producto?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no se puede deshacer. Esto eliminará permanentemente el
						producto.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						disabled={isPending}
						className="hover:bg-destructive bg-destructive/75 text-white"
						onClick={handleDeleteProduct}
					>
						Eliminar
						{isPending && <Spinner className="size-5" />}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
