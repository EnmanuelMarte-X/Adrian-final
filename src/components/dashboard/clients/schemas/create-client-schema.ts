import { z } from "zod";

const phoneSchema = z.object({
	number: z.string().optional(),
	type: z.enum(["mobile", "work", "home", "other"]),
	isPrimary: z.boolean(),
});

const addressSchema = z.object({
	street: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zipCode: z.string().optional(),
	country: z.string().optional(),
	isPrimary: z.boolean(),
});

export const createClientFormSchema = z
	.object({
		name: z.string().optional(),
		email: z
			.string()
			.email("Correo electrónico inválido")
			.optional()
			.or(z.literal(""))
			.transform((val) => (val === "" ? undefined : val)), // Transformar string vacío a undefined
		documentType: z.enum(["cedula", "rnc", "passport", "other"]).optional(),
		documentNumber: z.string().optional(),
		phones: z.array(phoneSchema).optional(),
		addresses: z.array(addressSchema).optional(),
		notes: z.string().optional(),
		type: z.enum(["individual", "company"]).optional(),
		isActive: z.boolean(),
	})
	.refine(
		(data) => {
			// Validar que tenga al menos un método de contacto válido
			const hasDocument =
				data.documentNumber && data.documentNumber.trim() !== "";
			const hasEmail =
				data.email && data.email !== "" && data.email.trim() !== "";
			const hasPhone = data.phones?.some(
				(phone) => phone.number && phone.number.trim() !== "",
			);

			return hasDocument || hasEmail || hasPhone;
		},
		{
			message:
				"Debe proporcionar al menos un número de documento, correo electrónico o teléfono",
			path: ["root"],
		},
	)
	.refine(
		(data) => {
			// Validar que solo haya un teléfono primario
			if (!data.phones) return true;
			const primaryPhones = data.phones.filter((phone) => phone.isPrimary);
			return primaryPhones.length <= 1;
		},
		{
			message: "Solo puede haber un teléfono marcado como primario",
			path: ["phones"],
		},
	)
	.refine(
		(data) => {
			// Validar que solo haya una dirección primaria
			if (!data.addresses) return true;
			const primaryAddresses = data.addresses.filter(
				(address) => address.isPrimary,
			);
			return primaryAddresses.length <= 1;
		},
		{
			message: "Solo puede haber una dirección marcada como primaria",
			path: ["addresses"],
		},
	);

export const validatePrimaryConstraints = (data: CreateClientFormValues) => {
	const primaryPhones = data.phones?.filter((phone) => phone.isPrimary) || [];
	const primaryAddresses =
		data.addresses?.filter((address) => address.isPrimary) || [];

	return {
		hasMultiplePrimaryPhones: primaryPhones.length > 1,
		hasMultiplePrimaryAddresses: primaryAddresses.length > 1,
		isValid: primaryPhones.length <= 1 && primaryAddresses.length <= 1,
	};
};

export type CreateClientFormValues = z.infer<typeof createClientFormSchema>;
