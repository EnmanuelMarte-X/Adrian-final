import mongoose from "mongoose";

// Definir los roles directamente para evitar problemas de importación circular
const USER_ROLES = {
	ADMIN: "admin",
	MANAGER: "manager",
	SELLER: "seller",
	SUPPORT: "support",
} as const;

export const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: false,
		default: "",
	},
	role: {
		type: String,
		enum: Object.values(USER_ROLES),
		default: USER_ROLES.SUPPORT,
	},
	isActive: {
		type: Boolean,
		default: true,
	},
	lastLogin: {
		type: Date,
		required: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	phone: {
		type: String,
		required: false,
	},
	avatar: {
		type: String,
		required: false,
	},
});

// Middleware para actualizar updatedAt antes de guardar
userSchema.pre("save", function (next) {
	this.updatedAt = new Date();
	next();
});

// Eliminar el modelo del cache si existe para evitar problemas con cambios en el schema
if (mongoose.models.User) {
	delete mongoose.models.User;
}

// Exportar el modelo de forma estándar
export const User = mongoose.model("User", userSchema);
