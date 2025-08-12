import { NextResponse } from "next/server";
import { updateStorageOrder } from "@/contexts/storages/controller";

export async function PUT(request: Request) {
	try {
		const { storageIds } = await request.json();

		if (!Array.isArray(storageIds)) {
			return NextResponse.json(
				{ error: "Invalid storage IDs format" },
				{ status: 400 },
			);
		}

		await updateStorageOrder(storageIds);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error updating storage order:", error);
		return NextResponse.json(
			{ error: "Failed to update storage order" },
			{ status: 500 },
		);
	}
}
