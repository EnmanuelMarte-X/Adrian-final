import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { CreatePaymentForm } from "./CreatePaymentForm";
import { useState } from "react";
import { motion } from "motion/react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { useCreatePaymentHistoryMutation } from "@/contexts/paymentHistory/queries";
import type { PaymentHistoryType } from "@/types/models/paymentHistory";
import type { PaymentMethod } from "@/types/models/paymentHistory";
import { PlusIcon } from "lucide-react";

export function CreatePaymentSheet({
	children,
}: { children?: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm<PaymentHistoryType>({
		defaultValues: {
			orderId: "",
			clientId: "",
			amount: 0,
			method: "cash" as PaymentMethod,
			date: new Date(),
		},
	});

	const { handleSubmit, reset } = form;

	const { mutateAsync: createPayment } = useCreatePaymentHistoryMutation({
		onSuccess: () => {
			resetAll();
			setIsOpen(false);
		},
		onError: () => {
			// El error ya se maneja en toast.promise
		},
	});

	const resetAll = () => {
		reset();
	};

	const validateForm = (values: PaymentHistoryType) => {
		if (!values.orderId || !values.clientId) {
			toast.error("Por favor completa todos los campos obligatorios.");
			return false;
		}
		if ((values.amount ?? 0) <= 0) {
			toast.error("El monto debe ser mayor a 0.");
			return false;
		}
		if (!values.method) {
			toast.error("Por favor selecciona un método de pago.");
			return false;
		}
		return true;
	};

	const handleClose = () => setIsOpen(false);
	const handleSheetOpenChange = (open: boolean) => setIsOpen(open);

	const onSubmit = async (data: PaymentHistoryType) => {
		try {
			if (!validateForm(data)) {
				return;
			}

			toast.promise(createPayment(data), {
				loading: "Registrando pago...",
				success: "Pago registrado exitosamente!",
				error: "No se pudo registrar el pago. Por favor intenta de nuevo.",
			});
		} catch {
			toast.error(
				"Error al procesar la información. Por favor intente de nuevo.",
			);
		}
	};

	return (
		<Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
			<SheetTrigger asChild>
				{children ? (
					children
				) : (
					<Button className="flex items-center gap-2">
						<PlusIcon className="size-4" />
						Registrar pago
					</Button>
				)}
			</SheetTrigger>
			<SheetContent className="sm:min-w-lg w-full overflow-y-auto">
				<SheetHeader className="pb-6">
					<SheetTitle>Registrar nuevo pago</SheetTitle>
					<SheetDescription>
						Ingresa la información del pago realizado por el cliente.
					</SheetDescription>
				</SheetHeader>

				<FormProvider {...form}>
					<form id="create-payment" onSubmit={handleSubmit(onSubmit)}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<CreatePaymentForm />
						</motion.div>
					</form>
				</FormProvider>

				<SheetFooter className="grid grid-cols-2 gap-2 items-start mt-0">
					<Button type="submit" form="create-payment">
						Registrar pago
					</Button>
					<Button type="button" variant="outline" onClick={handleClose}>
						Cancelar
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
