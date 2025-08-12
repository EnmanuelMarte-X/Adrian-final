import { APIError } from "../shared/exceptions";

export class PaymentHistoryNotFoundException extends APIError {
	constructor() {
		super(404, "Payment history not found", "payment_history_not_found");
	}
}

export class InvalidPaymentAmountException extends APIError {
	constructor() {
		super(400, "Invalid payment amount", "invalid_payment_amount");
	}
}

export class InvalidPaymentMethodException extends APIError {
	constructor() {
		super(400, "Invalid payment method", "invalid_payment_method");
	}
}
