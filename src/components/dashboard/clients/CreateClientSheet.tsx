"use client";

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
import { Spinner } from "@/components/ui/spinner";
import { PlusIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { ClientBasicInfoForm } from "./ClientBasicInfoForm";
import { ClientContactsForm } from "./ClientContactsForm";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { useCreateClientMutation } from "@/contexts/clients/queries";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createClientFormSchema,
	type CreateClientFormValues,
	validatePrimaryConstraints,
} from "./schemas/create-client-schema";

const stepsHeader = {
	"basic-info": {
		title: "Información básica",
		description: `Ingresa la información básica del nuevo cliente y haz clic en "Siguiente" para agregar contactos.`,
	},
	contacts: {
		title: "Contactos y direcciones",
		description: `Agrega los teléfonos y direcciones del cliente y haz clic en "Crear cliente" para finalizar.`,
	},
};

export function CreateClientSheet() {
	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState<"basic-info" | "contacts">("basic-info");
	const [isHoveringSteps, setIsHoveringSteps] = useState(false);

	const form = useForm<CreateClientFormValues>({
		resolver: zodResolver(createClientFormSchema),
		defaultValues: {
			name: "",
			email: "",
			documentType: "cedula",
			documentNumber: "",
			phones: [
				{
					number: "",
					type: "mobile",
					isPrimary: true,
				},
			],
			addresses: [],
			notes: "",
			type: "individual",
			isActive: true,
		},
	});

	const { handleSubmit, reset, getValues } = form;

	const { mutateAsync: createClient, isPending } = useCreateClientMutation({
		onSuccess: () => {
			resetAll();
			setIsOpen(false);
		},
	});

	const resetAll = () => {
		setStep("basic-info");
		reset();
	};

	const handleClose = () => {
		setIsOpen(false);
		resetAll();
	};

	const validateBasicInfo = (values: CreateClientFormValues) => {
		// La validación básica es opcional, solo verificamos el tipo si está presente
		if (values.type && !values.type) {
			toast.error("Debe seleccionar un tipo de cliente");
			return false;
		}

		return true;
	};

	const validateContacts = (values: CreateClientFormValues) => {
		// Validar que tenga al menos un método de contacto
		const hasDocument =
			values.documentNumber && values.documentNumber.trim() !== "";
		const hasEmail = values.email && values.email.trim() !== "";
		const hasPhone = values.phones?.some(
			(phone) => phone.number && phone.number.trim() !== "",
		);

		if (!hasDocument && !hasEmail && !hasPhone) {
			toast.error(
				"Debe proporcionar al menos un número de documento, correo electrónico o teléfono",
			);
			return false;
		}

		// Validar restricciones de elementos primarios
		const primaryValidation = validatePrimaryConstraints(values);
		if (!primaryValidation.isValid) {
			if (primaryValidation.hasMultiplePrimaryPhones) {
				toast.error("Solo puede haber un teléfono marcado como primario");
				return false;
			}
			if (primaryValidation.hasMultiplePrimaryAddresses) {
				toast.error("Solo puede haber una dirección marcada como primaria");
				return false;
			}
		}

		return true;
	};

	const handleNextStep = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (validateBasicInfo(getValues())) {
			setStep("contacts");
		}
	};

	const handleBackStep = () => setStep("basic-info");
	const isFirstStep = step === "basic-info";
	const handleSheetOpenChange = (open: boolean) => setIsOpen(open);

	const onSubmit = async (data: CreateClientFormValues) => {
		if (!validateContacts(data)) {
			return;
		}

		const cleanData = {
			...data,
			name: data.name?.trim() || "",
			email:
				data.email?.trim() && data.email.trim() !== ""
					? data.email.trim()
					: undefined,
			documentType: data.documentType || "cedula",
			documentNumber: data.documentNumber?.trim() || "",
			notes: data.notes?.trim() || "",
			phones:
				data.phones
					?.filter((phone) => phone.number?.trim())
					.map((phone) => ({
						...phone,
						number: phone.number!.trim(),
					})) || [],
			addresses:
				data.addresses
					?.filter(
						(address) =>
							address.street?.trim() &&
							address.city?.trim() &&
							address.state?.trim() &&
							address.zipCode?.trim() &&
							address.country?.trim(),
					)
					.map((address) => ({
						...address,
						street: address.street!.trim(),
						city: address.city!.trim(),
						state: address.state!.trim(),
						zipCode: address.zipCode!.trim(),
						country: address.country!.trim(),
					})) || [],
		};

		try {
			await toast.promise(createClient(cleanData), {
				loading: "Creando cliente...",
				success: "Cliente creado exitosamente!",
				error: (error) => {
					console.error("Error creating client:", error);
					const message = error?.message || "Error desconocido";
					return `Error al crear el cliente: ${message}`;
				},
			});
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Error desconocido";
			toast.error(`Error al procesar la información: ${errorMessage}`);
		}
	};

	return (
		<Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
			<SheetTrigger asChild>
				<Button className="gap-x-2 shadow-md">
					<PlusIcon className="size-4" />
					Nuevo Cliente
				</Button>
			</SheetTrigger>
			<SheetContent className="min-w-xl w-full overflow-y-auto">
				<SheetHeader className="pb-0">
					<SheetTitle>{stepsHeader[step].title}</SheetTitle>
					<SheetDescription>{stepsHeader[step].description}</SheetDescription>
					<div
						className="grid grid-cols-2 gap-x-1 min-h-6 place-content-center mt-1"
						onMouseEnter={() => setIsHoveringSteps(true)}
						onMouseLeave={() => setIsHoveringSteps(false)}
					>
						{(["basic-info", "contacts"] as const).map((stepKey) => (
							<motion.span
								key={stepKey}
								className={`flex items-center justify-center ${step === stepKey ? "bg-primary" : "bg-muted"} w-full ${stepKey === "basic-info" ? "rounded-l-full" : "rounded-r-full"} overflow-hidden relative`}
								animate={{ height: isHoveringSteps ? "1.5rem" : "0.25rem" }}
								transition={{ duration: 0.2, ease: "easeInOut" }}
							>
								<AnimatePresence>
									{isHoveringSteps && (
										<motion.span
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ duration: 0.15 }}
											className={`${step === stepKey ? "text-primary-foreground font-medium" : "text-muted-foreground"} text-[0.68rem] absolute inset-0 flex items-center justify-center`}
										>
											{stepsHeader[stepKey].title}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.span>
						))}
					</div>
				</SheetHeader>

				<FormProvider {...form}>
					<form
						id="create-client"
						className="grow"
						onSubmit={handleSubmit(onSubmit)}
					>
						<AnimatePresence mode="wait">
							<motion.div
								key={step}
								initial={{ opacity: 0, x: isFirstStep ? -20 : 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: isFirstStep ? -20 : 20 }}
								transition={{ duration: 0.2 }}
							>
								{isFirstStep ? (
									<ClientBasicInfoForm />
								) : (
									<div className="px-5">
										<ClientContactsForm />
									</div>
								)}
							</motion.div>
						</AnimatePresence>
					</form>
				</FormProvider>

				<SheetFooter className="grid grid-cols-2 gap-2 items-start mt-6">
					{isFirstStep ? (
						<>
							<Button
								type="button"
								onClick={handleNextStep}
								className="flex items-center gap-2"
							>
								Agregar contactos <ArrowRight size={16} />
							</Button>
							<Button type="button" variant="ghost" onClick={handleClose}>
								Cancelar
							</Button>
						</>
					) : (
						<>
							<Button
								type="submit"
								disabled={isPending}
								className="flex items-center gap-2"
								form="create-client"
							>
								{isPending && <Spinner className="w-4 h-4" />}
								{isPending ? "Creando cliente..." : "Crear"}
							</Button>
							<Button
								variant="outline"
								onClick={handleBackStep}
								className="flex items-center gap-2"
								type="button"
								disabled={isPending}
							>
								<ArrowLeft size={16} /> Atrás
							</Button>
						</>
					)}
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
