"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { type Control, useFieldArray, useWatch } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CreateClientFormValues } from "./schemas/create-client-schema";

interface ClientAddressesFieldsProps {
	control: Control<CreateClientFormValues>;
}

export function ClientAddressesFields({ control }: ClientAddressesFieldsProps) {
	const { fields, append, remove, update } = useFieldArray({
		control,
		name: "addresses",
	});

	const watchedAddresses = useWatch({
		control,
		name: "addresses",
	});

	const handleAdd = () => {
		append({
			street: "",
			city: "",
			state: "",
			zipCode: "",
			country: "República Dominicana",
			isPrimary: false,
		});
	};

	const handlePrimaryChange = (index: number, isPrimary: boolean) => {
		if (isPrimary && watchedAddresses) {
			// Si se marca como primario, desmarcar todas las otras
			fields.forEach((_, i) => {
				if (i !== index && watchedAddresses[i]?.isPrimary) {
					update(i, { ...watchedAddresses[i], isPrimary: false });
				}
			});
		}

		if (watchedAddresses?.[index]) {
			update(index, { ...watchedAddresses[index], isPrimary });
		}
	};

	return (
		<div className="space-y-4">
			{fields.map((field, index) => (
				<div key={field.id} className="relative p-3 space-y-3">
					{fields.length > 0 && (
						<button
							type="button"
							className="absolute top-2 right-2 text-muted-foreground hover:text-muted-foreground/70"
							onClick={() => remove(index)}
						>
							<X size={16} />
						</button>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<FormField
							control={control}
							name={`addresses.${index}.street`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Calle</FormLabel>
									<FormControl>
										<Input placeholder="Dirección" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name={`addresses.${index}.city`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ciudad</FormLabel>
									<FormControl>
										<Input placeholder="Ciudad" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name={`addresses.${index}.state`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Provincia</FormLabel>
									<FormControl>
										<Input placeholder="Provincia" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name={`addresses.${index}.zipCode`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Código Postal</FormLabel>
									<FormControl>
										<Input placeholder="Código Postal" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={control}
							name={`addresses.${index}.country`}
							render={({ field }) => (
								<FormItem>
									<FormLabel>País</FormLabel>
									<FormControl>
										<Input placeholder="País" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={control}
						name={`addresses.${index}.isPrimary`}
						render={({ field }) => (
							<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md">
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={(checked) => {
											field.onChange(checked);
											handlePrimaryChange(index, checked);
										}}
									/>
								</FormControl>
								<FormLabel className="cursor-pointer">
									{field.value && (
										<Badge variant="outline">Dirección principal</Badge>
									)}
									{!field.value && "Marcar como dirección principal"}
								</FormLabel>
							</FormItem>
						)}
					/>
				</div>
			))}

			<Button
				type="button"
				variant="outline"
				size="sm"
				className="mt-2"
				onClick={handleAdd}
			>
				<Plus className="mr-2 size-4" />
				Añadir dirección
			</Button>
		</div>
	);
}
