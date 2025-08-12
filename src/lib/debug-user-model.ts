// SOLO PARA USO EN EL SERVIDOR - NO IMPORTAR EN EL CLIENTE

import { connectToMongo } from "@/lib/mongo";

// Función async para importar el modelo User dinámicamente
async function getUserModel() {
	const { User } = await import("@/contexts/users/model");
	return User;
}

export async function testUserModel() {
	try {
		console.log("🔄 Testing MongoDB connection...");
		await connectToMongo();
		console.log("✅ MongoDB connected successfully");

		console.log("🔄 Testing User model...");
		const User = await getUserModel();
		console.log("User model:", User);
		console.log("User model name:", User.modelName);
		console.log("User collection name:", User.collection.name);

		// Intentar una consulta simple
		const userCount = await User.countDocuments();
		console.log("📊 Total users in database:", userCount);

		console.log("✅ User model test completed successfully");
		return true;
	} catch (error) {
		console.error("❌ User model test failed:");
		console.error("Error:", error);
		console.error("Error details:", {
			message: error instanceof Error ? error.message : "Unknown error",
			stack: error instanceof Error ? error.stack : undefined,
		});
		return false;
	}
}

export async function checkUserModelHealth() {
	try {
		await connectToMongo();

		// Verificar que el modelo existe
		const User = await getUserModel();
		if (!User) {
			throw new Error("User model is undefined");
		}

		// Verificar que el modelo tiene las propiedades correctas
		const schema = User.schema;
		const paths = Object.keys(schema.paths);
		console.log("User schema paths:", paths);

		// Verificar que los campos requeridos existen
		const requiredFields = [
			"username",
			"email",
			"password",
			"firstName",
			"lastName",
			"role",
		];
		const missingFields = requiredFields.filter(
			(field) => !paths.includes(field),
		);

		if (missingFields.length > 0) {
			throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
		}

		console.log("✅ User model health check passed");
		return true;
	} catch (error) {
		console.error("❌ User model health check failed:", error);
		return false;
	}
}
