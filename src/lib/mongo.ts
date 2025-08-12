import mongoose from "mongoose";
import type { MongooseCache } from "../../global"; // Import the type from global.d.ts

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local",
	);
}

let cached: MongooseCache = global.mongoose;

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function connectToMongo() {
	if (!MONGODB_URI) {
		throw new Error(
			"Please define the MONGODB_URI environment variable inside .env.local",
		);
	}

	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
			console.log("✅ MongoDB connected successfully");
			return mongoose.connection;
		});
	}

	try {
		cached.conn = await cached.promise;
		return cached.conn;
	} catch (error) {
		console.error("❌ MongoDB connection failed:", error);
		cached.promise = null; // Reset promise so we can try again
		throw error;
	}
}

export { connectToMongo };
