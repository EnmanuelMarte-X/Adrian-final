import mongoose from "mongoose";
import { paymentMethodsKeys } from "./payment-method";

export const paymentHistorySchema = new mongoose.Schema({
	orderId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Order",
		required: true,
		index: true,
	},
	clientId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Client",
		required: true,
		index: true,
	},
	amount: {
		type: Number,
		required: true,
		min: 0,
		index: true,
	},
	method: {
		type: String,
		enum: paymentMethodsKeys,
		required: true,
		index: true,
	},
	date: {
		type: Date,
		default: Date.now,
		index: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

// Index compuesto para consultas comunes
paymentHistorySchema.index({ clientId: 1, date: -1 });
paymentHistorySchema.index({ orderId: 1, date: -1 });
paymentHistorySchema.index({ method: 1, date: -1 });

export const PaymentHistory =
	mongoose.models.PaymentHistory ||
	mongoose.model("PaymentHistory", paymentHistorySchema);
