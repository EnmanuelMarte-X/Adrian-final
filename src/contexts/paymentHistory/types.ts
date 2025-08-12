import type { PaymentMethod } from "@/types/models/paymentHistory";

export interface PaymentHistoryFilters {
	orderId?: string;
	clientId?: string;
	method?: PaymentMethod;
	amount?: [number, number] | undefined;
	date?: Date | { from: Date; to: Date };
}

export interface PaymentHistorySort {
	field: "date" | "amount" | "method" | "_id" | "orderId" | "clientId";
	order: "asc" | "desc";
}
