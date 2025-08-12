import mongoose from "mongoose";

export const storageSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	productsCount: {
		type: Number,
		required: true,
	},
	order: {
		type: Number,
		required: true,
	},
});

storageSchema.index({ id: 1 });
storageSchema.index({ order: 1 });

export const Storage =
	mongoose.models.Storage || mongoose.model("Storage", storageSchema);
