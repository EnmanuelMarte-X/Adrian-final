export const paymentMethods = [
	{ id: "credit_card", name: "Tarjeta de Crédito" },
	{ id: "bank_transfer", name: "Transferencia Bancaria" },
	{ id: "cash", name: "Efectivo" },
] as const;

export const paymentMethodsKeys = paymentMethods.map((m) => m.id);

export const getPaymentMethodName = (methodId: string): string => {
	const method = paymentMethods.find((m) => m.id === methodId);
	return method?.name || methodId;
};

export const getPaymentMethodById = (methodId: string) => {
	return paymentMethods.find((m) => m.id === methodId);
};
