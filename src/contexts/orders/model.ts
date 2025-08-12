import mongoose from "mongoose";

const productItemSchema = new mongoose.Schema(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
		},
		discount: {
			type: Number,
			required: false,
		},
	},
	{ _id: false },
);

export const orderSchema = new mongoose.Schema({
	orderId: {
		type: Number,
		required: true,
	},
	buyerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Client",
		required: true,
	},
	sellerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: false,
	},
	date: {
		type: Date,
		required: true,
	},
	order: {
		type: String,
		required: false,
	},
	isCredit: {
		type: Boolean,
		required: false,
	},
	cfSequence: {
		type: Number,
		required: false,
	},
	ncfSequence: {
		type: Number,
		required: false,
	},
	products: [productItemSchema],
});

orderSchema.index({ orderId: 1 });
orderSchema.index({ buyerId: 1 });
orderSchema.index({ sellerId: 1 });
orderSchema.index({ date: 1 });
orderSchema.index({ cfSequence: 1 });
orderSchema.index({ ncfSequence: 1 });
orderSchema.index({ "products.productId": 1 });

export const Order =
	mongoose.models.Order || mongoose.model("Order", orderSchema);
