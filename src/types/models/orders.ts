import type { UserBasicInfo } from "./users";
import type { ClientBasicInfo } from "./clients";

export type OrderProduct = {
	productId: string;
	price: number;
	quantity: number;
	discount?: number;
	locationId?: string;
};

export type OrderProductDetails = OrderProduct & {
	name: string;
	retailPrice: number;
	wholesalePrice: number;
	cost: number;
};

export type OrderType = {
	_id?: string;
	orderId: number;
	buyerId: string | ClientBasicInfo;
	sellerId?: string | UserBasicInfo;
	date: Date;
	isCredit: boolean;
	cfSequence?: number;
	ncfSequence?: number;
	products: Array<OrderProduct>;
};

export type OrderTypeWithProducts = Omit<OrderType, "products"> & {
	products: Array<OrderProductDetails>;
};
