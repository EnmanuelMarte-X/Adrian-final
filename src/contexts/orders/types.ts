import type { PaymentMethod } from "@/types/models/paymentHistory";

export type OrderFilters = {
	orderId?: number;
	productId?: string;
	buyerId?: string;
	sellerId?: string;
	date?: Date | { from: Date; to: Date };
	paymentMethod?: PaymentMethod;
	shippingAddress?: string;
	cfSequence?: number;
	ncfSequence?: number;
};
