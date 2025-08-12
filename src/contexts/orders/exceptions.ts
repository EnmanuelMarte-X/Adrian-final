import { APIError } from "../shared/exceptions";

export class OrdersNotFoundException extends APIError {
	constructor() {
		super(404, "Orders not found", "orders_not_found");
	}
}
