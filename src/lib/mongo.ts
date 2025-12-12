

interface MongooseCache {
	conn: mongoose.Connection | null;
	promise: Promise<mongoose.Connection> | null;
	lastFailure: number | null; // Timestamp del último fallo
}

declare global {
	// eslint-disable-next-line no-var
	var mongoose: MongooseCache | undefined;
}
import mongoose from "mongoose";
import { seedDefaultAdmin } from "./seed-admin";

const { MONGODB_URI } = process.env;

// Tiempo de espera antes de reintentar conexión después de un fallo (30 segundos)
const RETRY_DELAY = 30000;
// Timeout de conexión (3 segundos)
const CONNECTION_TIMEOUT = 3000;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local",
	);
}

let cached: MongooseCache | undefined = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null, lastFailure: null };
}

async function connectToMongo() {
	if (!MONGODB_URI) {
		throw new Error(
			"Please define the MONGODB_URI environment variable inside .env.local",
		);
	}

	// Si ya hay conexión, usarla
	if (cached && cached.conn) {
		return cached.conn;
	}

	// Si hubo un fallo reciente, no reintentar (para evitar lentitud)
	if (cached && cached.lastFailure && Date.now() - cached.lastFailure < RETRY_DELAY) {
		throw new Error("MongoDB connection recently failed, skipping retry");
	}

	if (cached && !cached.promise) {
		const opts = {
			bufferCommands: false,
			serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
			connectTimeoutMS: CONNECTION_TIMEOUT,
		};

		cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
			console.log("✅ MongoDB connected successfully");
			if (cached) cached.lastFailure = null; // Reset en conexión exitosa
			return mongoose.connection;
		});
	}

	try {
		if (cached) {
			cached.conn = await cached.promise;
			
			// Seed automático del usuario admin
			await seedDefaultAdmin();
			
			return cached.conn;
		} else {
			throw new Error("MongoDB cache is not initialized");
		}
	} catch (error) {
		console.error("❌ MongoDB connection failed:", error);
		if (cached) {
			cached.promise = null;
			cached.lastFailure = Date.now(); // Marcar el fallo para no reintentar inmediatamente
		}
		throw error;
	}
}

export { connectToMongo };
