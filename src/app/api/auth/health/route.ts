import { NextResponse } from "next/server";
import { testUserModel, checkUserModelHealth } from "@/lib/debug-user-model";

export async function GET() {
	try {
		console.log("🔄 Starting auth system health check...");

		// Test 1: Verificar modelo de usuario
		console.log("\n📝 Test 1: User Model Health Check");
		const modelHealthy = await checkUserModelHealth();

		// Test 2: Probar modelo de usuario
		console.log("\n📝 Test 2: User Model Functionality Test");
		const modelWorking = await testUserModel();

		// Test 3: Verificar importación dinámica
		console.log("\n📝 Test 3: Dynamic Import Test");
		let dynamicImportWorking = false;
		try {
			const { User } = await import("@/contexts/users/model");
			console.log("✅ Dynamic import successful, User model:", !!User);
			dynamicImportWorking = true;
		} catch (error) {
			console.error("❌ Dynamic import failed:", error);
		}

		const results = {
			timestamp: new Date().toISOString(),
			tests: {
				modelHealth: modelHealthy,
				modelFunctionality: modelWorking,
				dynamicImport: dynamicImportWorking,
			},
			overall: modelHealthy && modelWorking && dynamicImportWorking,
		};

		console.log("\n📊 Final Results:", results);

		return NextResponse.json({
			success: true,
			message: "Auth system health check completed",
			results,
		});
	} catch (error) {
		console.error("❌ Health check failed:", error);

		return NextResponse.json(
			{
				success: false,
				message: "Health check failed",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
