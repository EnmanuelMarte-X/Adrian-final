"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
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
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";
import { AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreateClientFormValues } from "./schemas/create-client-schema";

export function ClientBasicInfoForm() {
	const {
		control,
		formState: { errors },
	} = useFormContext<CreateClientFormValues>();

	return (
		<div className="flex flex-col grow">
			<div className="space-y-4 px-5">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nombre</FormLabel>
								<FormControl>
									<Input
										placeholder="Nombre del cliente"
										{...field}
										className={cn(errors.name && "border-destructive")}
									/>
								</FormControl>
								{errors.name && (
									<div className="flex items-center gap-1 text-xs text-destructive">
										<AlertCircleIcon className="h-3 w-3" />
										<FormMessage />
									</div>
								)}
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Correo electrónico</FormLabel>
								<FormControl>
									<Input
										placeholder="correo@ejemplo.com"
										{...field}
										className={cn(errors.email && "border-destructive")}
									/>
								</FormControl>
								{errors.email && (
									<div className="flex items-center gap-1 text-xs text-destructive">
										<AlertCircleIcon className="h-3 w-3" />
										<FormMessage />
									</div>
								)}
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="documentType"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo de documento</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger
											className={cn(
												errors.documentType && "border-destructive",
											)}
										>
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
								{errors.documentType && (
									<div className="flex items-center gap-1 text-xs text-destructive">
										<AlertCircleIcon className="h-3 w-3" />
										<FormMessage />
									</div>
								)}
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="documentNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Número de documento</FormLabel>
								<FormControl>
									<Input
										placeholder="Número de documento"
										{...field}
										className={cn(
											errors.documentNumber && "border-destructive",
										)}
									/>
								</FormControl>
								{errors.documentNumber && (
									<div className="flex items-center gap-1 text-xs text-destructive">
										<AlertCircleIcon className="h-3 w-3" />
										<FormMessage />
									</div>
								)}
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Tipo de cliente</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger
											className={cn(errors.type && "border-destructive")}
										>
											<SelectValue placeholder="Seleccione un tipo" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="individual">Individual</SelectItem>
										<SelectItem value="company">Empresa</SelectItem>
									</SelectContent>
								</Select>
								{errors.type && (
									<div className="flex items-center gap-1 text-xs text-destructive">
										<AlertCircleIcon className="h-3 w-3" />
										<FormMessage />
									</div>
								)}
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="isActive"
						render={({ field }) => (
							<FormItem className="flex flex-row items-center justify-between p-2 shadow-sm rounded-md border">
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

				<FormField
					control={control}
					name="notes"
					render={({ field }) => (
						<FormItem className="mt-4">
							<FormLabel>Notas</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Notas adicionales sobre el cliente"
									{...field}
									className={cn(errors.notes && "border-destructive")}
								/>
							</FormControl>
							{errors.notes && (
								<div className="flex items-center gap-1 text-xs text-destructive">
									<AlertCircleIcon className="h-3 w-3" />
									<FormMessage />
								</div>
							)}
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
