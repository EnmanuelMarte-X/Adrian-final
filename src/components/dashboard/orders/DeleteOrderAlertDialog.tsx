import {
	AlertDialogFooter,
	AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteOrderMutation } from "@/contexts/orders/queries";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function DeleteOrderAlertDialog({
	orderId,
	isOpen,
	onOpenChange,
}: {
	orderId: number;
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
}) {
	const { mutateAsync: deleteProduct, isPending } = useDeleteOrderMutation(
		String(orderId),
		{
			onSuccess: () => onOpenChange(false),
		},
	);

	const handleDeleteProduct = () => {
		toast.promise(deleteProduct, {
			loading: "Eliminando factura...",
			success: "Factura eliminado exitosamente!",
			error: "No se pudo eliminar la factura. Por favor intenta de nuevo.",
		});
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						¿Estás seguro de eliminar esta factura?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no se puede deshacer. Esto eliminará permanentemente la
						factura.
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
