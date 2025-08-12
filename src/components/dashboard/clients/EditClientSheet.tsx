"use client";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { useUpdateClientMutation } from "@/contexts/clients/queries";
import type { ClientType } from "@/types/models/clients";
import { ClientAddressesFields } from "./ClientAddressesFields";
import { ClientPhonesFields } from "./ClientPhonesFields";
import { toast } from "sonner";
import {
	createClientFormSchema,
	type CreateClientFormValues,
} from "./schemas/create-client-schema";

interface EditClientSheetProps {
	client: ClientType;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EditClientSheet({
	client,
	open,
	onOpenChange,
}: EditClientSheetProps) {
	const form = useForm<CreateClientFormValues>({
		resolver: zodResolver(createClientFormSchema),
		defaultValues: {
			name: client.name,
			email: client.email || "",
			documentType: client.documentType,
			documentNumber: client.documentNumber,
			phones: client.phones,
			addresses: client.addresses,
			notes: client.notes || "",
			type: client.type,
			isActive: client.isActive,
		},
	});

	const updateClientMutation = useUpdateClientMutation(client._id, {
		onSuccess: () => {
			toast.success("Cliente actualizado correctamente", {
				description: "El cliente ha sido actualizado correctamente",
			});
			onOpenChange(false);
		},
		onError: () => {
			toast.error("Error al actualizar cliente.", {
				description:
					"Ha ocurrido un error al actualizar el cliente, por favor intente nuevamente.",
			});
		},
	});

	const onSubmit = (values: CreateClientFormValues) => {
		const sanitizedValues = {
			...values,
			phones: values.phones
				?.filter(
					(phone) =>
						typeof phone.number === "string" && phone.number.trim() !== "",
				)
				?.map((phone) => ({
					...phone,
					number: phone.number as string,
				})),
			addresses: values.addresses
				?.filter(
					(address) =>
						typeof address.street === "string" && address.street.trim() !== "",
				)
				?.map((address) => ({
					...address,
					street: address.street ?? "",
					city: address.city ?? "",
					state: address.state ?? "",
					zipCode: address.zipCode ?? "",
					country: address.country ?? "",
				})),
		};
		updateClientMutation.mutate(sanitizedValues);
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="min-w-xl w-full overflow-y-auto">
				<SheetHeader>
					<SheetTitle>Editar Cliente</SheetTitle>
					<SheetDescription>
						Actualice la información del cliente. Los campos marcados con un
						asterisco (*) son obligatorios.
					</SheetDescription>
				</SheetHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input placeholder="Nombre del cliente" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Correo electrónico</FormLabel>
										<FormControl>
											<Input placeholder="correo@ejemplo.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="documentType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo de documento</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Seleccione un tipo" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="cedula">Cédula</SelectItem>
												<SelectItem value="rnc">RNC</SelectItem>
												<SelectItem value="passport">Pasaporte</SelectItem>
												<SelectItem value="other">Otro</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="documentNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Número de documento</FormLabel>
										<FormControl>
											<Input placeholder="Número de documento" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo de cliente</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Seleccione un tipo" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="individual">Individual</SelectItem>
												<SelectItem value="company">Empresa</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
										<div className="space-y-0.5">
											<FormLabel>Estado</FormLabel>
											<FormDescription>
												El cliente estará activo en el sistema
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="space-y-6 px-5">
							<div>
								<h4 className="font-medium mb-4 text-lg">Teléfonos</h4>
								<ClientPhonesFields control={form.control} />
							</div>

							<div>
								<h4 className="font-medium mb-4 text-lg">Direcciones</h4>
								<ClientAddressesFields control={form.control} />
							</div>
						</div>

						<FormField
							control={form.control}
							name="notes"
							render={({ field }) => (
								<FormItem className="px-5">
									<FormLabel>Notas</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Notas adicionales sobre el cliente"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<SheetFooter className="grid grid-cols-2">
							<Button type="submit" disabled={updateClientMutation.isPending}>
								{updateClientMutation.isPending
									? "Actualizando..."
									: "Actualizar Cliente"}
							</Button>
							<Button variant="outline">Cancelar</Button>
						</SheetFooter>
					</form>
				</Form>
			</SheetContent>
		</Sheet>
	);
}
