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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { type Control, useFieldArray, useWatch } from "react-hook-form";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CreateClientFormValues } from "./schemas/create-client-schema";

interface ClientPhonesFieldsProps {
	control: Control<CreateClientFormValues>;
}

export function ClientPhonesFields({ control }: ClientPhonesFieldsProps) {
	const { fields, append, remove, update } = useFieldArray({
		control,
		name: "phones",
	});

	const watchedPhones = useWatch({
		control,
		name: "phones",
	});

	const handleAdd = () => {
		append({
			number: "",
			type: "mobile",
			isPrimary: false,
		});
	};

	const handlePrimaryChange = (index: number, isPrimary: boolean) => {
		if (isPrimary && watchedPhones) {
			// Si se marca como primario, desmarcar todos los otros
			fields.forEach((_, i) => {
				if (i !== index && watchedPhones[i]?.isPrimary) {
					update(i, { ...watchedPhones[i], isPrimary: false });
				}
			});
		}

		if (watchedPhones?.[index]) {
			update(index, { ...watchedPhones[index], isPrimary });
		}
	};

	return (
		<div className="space-y-4">
			{fields.map((field, index) => (
				<div
					key={field.id}
					className="flex flex-col md:flex-row gap-3 p-3 border rounded-md relative"
				>
					{fields.length > 1 && (
						<button
							type="button"
							className="absolute top-2 right-2 text-muted-foreground hover:text-gray-700"
							onClick={() => remove(index)}
						>
							<X size={16} />
						</button>
					)}

					<FormField
						control={control}
						name={`phones.${index}.number`}
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Número</FormLabel>
								<FormControl>
									<Input placeholder="Número de teléfono" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name={`phones.${index}.type`}
						render={({ field }) => (
							<FormItem className="w-32">
								<FormLabel required>Tipo</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Tipo" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="mobile">Móvil</SelectItem>
										<SelectItem value="work">Trabajo</SelectItem>
										<SelectItem value="home">Casa</SelectItem>
										<SelectItem value="other">Otro</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name={`phones.${index}.isPrimary`}
						render={({ field }) => (
							<FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md p-3">
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
									{field.value && <Badge variant="outline">Principal</Badge>}
									{!field.value && "Marcar como principal"}
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
				Añadir teléfono
			</Button>
		</div>
	);
}
