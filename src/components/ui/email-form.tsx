"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
	sendContactEmail,
	sendSupplyEmail,
	sendReturnEmail,
	type SupplyFormData,
	type ContactFormData,
	type ReturnFormData,
} from "@/lib/email-utils";

interface ContactFormProps {
	onSubmit?: (data: Record<string, string>) => void;
	submitText?: string;
	type: "contact" | "supply" | "return";
	children: React.ReactNode;
}

export function EmailForm({
	onSubmit,
	submitText = "Enviar",
	type,
	children,
}: ContactFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);

		try {
			const formData = new FormData(event.currentTarget);
			const data = Object.fromEntries(formData.entries());

			// Convert FormData to the appropriate type
			const emailData = Object.keys(data).reduce(
				(acc, key) => {
					acc[key] = data[key] as string;
					return acc;
				},
				{} as Record<string, string>,
			);

			// Send email based on type
			switch (type) {
				case "contact":
					await sendContactEmail(emailData as unknown as ContactFormData);
					break;
				case "supply":
					await sendSupplyEmail(emailData as unknown as SupplyFormData);
					break;
				case "return":
					await sendReturnEmail(emailData as unknown as ReturnFormData);
					break;
				default:
					throw new Error("Tipo de formulario no válido");
			}

			// Show success message only if email was sent successfully
			toast.success("¡Mensaje enviado!", {
				description: "Hemos recibido tu solicitud. Te contactaremos pronto.",
			});

			// Reset form only on success
			event.currentTarget.reset();

			// Call custom onSubmit if provided only after successful email send and UI updates
			if (onSubmit) {
				onSubmit(emailData);
			}
		} catch (error) {
			console.error("Error enviando formulario:", error);
			toast.error("Error al enviar mensaje", {
				description:
					"Hubo un problema enviando tu mensaje. Por favor, verifica tus datos e inténtalo de nuevo.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{children}
			<Button type="submit" className="w-full" disabled={isSubmitting}>
				{isSubmitting ? "Enviando..." : submitText}
			</Button>
		</form>
	);
}
