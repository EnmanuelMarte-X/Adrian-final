import mongoose from "mongoose";
import { productCapacityUnits } from "./units";

const productLocationSchema = new mongoose.Schema(
	{
		storageId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Storage",
			required: true,
		},
		stock: {
			type: Number,
			required: true,
			min: 0,
		},
		showInStore: {
			type: Boolean,
			default: true,
		},
	},
	{ _id: false },
);

const productImageSchema = new mongoose.Schema(
	{
		url: {
			type: String,
			required: true,
		},
		alt: {
			type: String,
			required: true,
		},
	},
	{ _id: false },
);

export const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		index: true,
	},
	description: {
		type: String,
		required: true,
	},
	brand: {
		type: String,
		required: true,
		index: true,
	},
	category: {
		type: String,
		required: true,
	},
	capacity: {
		type: Number,
		required: true,
		index: true,
	},
	capacityUnit: {
		type: String,
		enum: productCapacityUnits,
		required: true,
		index: true,
	},
	// stock is now calculated from locations, not stored directly
	retailPrice: {
		type: Number,
		required: true,
	},
	wholesalePrice: {
		type: Number,
		required: true,
	},
	cost: {
		type: Number,
		required: true,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	minimumStock: {
		type: Number,
		required: true,
	},
	locations: [productLocationSchema],
	images: [productImageSchema],
});

export const Product =
	mongoose.models.Product || mongoose.model("Product", productSchema);
