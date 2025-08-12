import mongoose from "mongoose";

const phoneSchema = new mongoose.Schema(
	{
		number: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			enum: ["mobile", "work", "home", "other"],
			default: "mobile",
		},
		isPrimary: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false },
);

const addressSchema = new mongoose.Schema(
	{
		street: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		zipCode: {
			type: String,
			required: true,
		},
		country: {
			type: String,
			required: true,
			default: "República Dominicana",
		},
		isPrimary: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false },
);

export const clientSchema = new mongoose.Schema({
	name: {
		type: String,
		required: false,
		index: true,
	},
	email: {
		type: String,
		required: false,
		unique: true,
		sparse: true,
	},
	documentType: {
		type: String,
		enum: ["cedula", "rnc", "passport", "other"],
		required: false,
	},
	documentNumber: {
		type: String,
		required: false,
		unique: true,
		sparse: true,
		index: true,
	},
	phones: [phoneSchema],
	addresses: [addressSchema],
	notes: {
		type: String,
		required: false,
	},
	type: {
		type: String,
		enum: ["individual", "company"],
		required: true,
		default: "individual",
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
	lastPurchaseAt: {
		type: Date,
		required: false,
	},
	isActive: {
		type: Boolean,
		default: true,
		index: true,
	},
});

export const Client =
	mongoose.models.Client || mongoose.model("Client", clientSchema);
