import { APIError } from "../shared/exceptions";

export class ProductsNotFoundException extends APIError {
	constructor() {
		super(404, "Products not found", "products_not_found");
	}
}
