import mongoose from "mongoose";

interface MongooseCache {
	conn: mongoose.Connection | null;
	promise: Promise<mongoose.Connection> | null;
}

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env.local",
	);
}

const globalWithMongoose = globalThis as typeof globalThis & {
	mongoose?: MongooseCache;
};

let cached: MongooseCache | undefined = globalWithMongoose.mongoose;

if (!cached) {
	cached = globalWithMongoose.mongoose = { conn: null, promise: null };
}

async function connectToMongo() {
	if (!MONGODB_URI) {
		throw new Error(
			"Please define the MONGODB_URI environment variable inside .env.local",
		);
	}

	if (cached && cached.conn) {
		return cached.conn;
	}

	if (cached && !cached.promise) {
		const opts = {
			bufferCommands: false,
		};

		cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
			console.log("✅ MongoDB connected successfully");
			return mongoose.connection;
		});
	}

	try {
		if (cached) {
			cached.conn = await cached.promise;
			return cached.conn;
		} else {
			throw new Error("MongoDB cache is not initialized");
		}
	} catch (error) {
		console.error("❌ MongoDB connection failed:", error);
		if (cached) {
			cached.promise = null; // Reset promise so we can try again
		}
		throw error;
	}
}

export { connectToMongo };
