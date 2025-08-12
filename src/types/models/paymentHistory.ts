import type { paymentMethods } from "@/contexts/paymentHistory/payment-method";
import type { ClientBasicInfo } from "./clients";

export type OrderBasicInfo = {
	_id?: string;
	orderId: number;
	products?: Array<{
		productId:
			| {
					_id: string;
					name?: string;
					retailPrice?: number;
					wholesalePrice?: number;
					cost?: number;
			  }
			| string;
		quantity: number;
		discount?: number;
	}>;
};

export type PaymentHistoryType = {
	_id?: string;
	orderId: string | OrderBasicInfo;
	clientId: string | ClientBasicInfo;
	amount: number;
	method: PaymentMethod;
	date: Date;
	createdAt?: Date;
	updatedAt?: Date;
	discount?: number;
};

export type PaymentMethod = (typeof paymentMethods)[number]["id"];
