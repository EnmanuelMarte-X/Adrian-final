import {
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeletePaymentHistoryMutation } from "@/contexts/paymentHistory/queries";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function DeletePaymentHistoryAlertDialog({
	paymentId,
	isOpen,
	onOpenChange,
	children,
}: {
	paymentId: string;
	isOpen?: boolean;
	children?: React.ReactNode;
	onOpenChange?: (isOpen: boolean) => void;
}) {
	const { mutateAsync: deletePayment, isPending } = useDeletePaymentHistoryMutation(
		paymentId,
		{
			onSuccess: () => onOpenChange?.(false),
		},
	);

	const handleDeletePayment = () => {
		toast.promise(deletePayment, {
			loading: "Eliminando pago...",
			success: "Pago eliminado exitosamente!",
			error: "No se pudo eliminar el pago. Por favor intenta de nuevo.",
		});
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={onOpenChange}>
			{children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						¿Estás seguro de eliminar este pago?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Esta acción no se puede deshacer. Esto eliminará permanentemente el
						registro de pago.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancelar</AlertDialogCancel>
					<AlertDialogAction
						disabled={isPending}
						className="hover:bg-destructive bg-destructive/75 text-white"
						onClick={handleDeletePayment}
					>
						Eliminar
						{isPending && <Spinner className="size-5" />}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}