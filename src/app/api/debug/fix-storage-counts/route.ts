import { NextRequest, NextResponse } from "next/server";
import { fixStorageProductCounts } from "@/contexts/storages/controller";

export async function GET(req: NextRequest) {
	try {
		const result = await fixStorageProductCounts();
		
		return NextResponse.json({
			success: true,
			message: `Fixed product counts for ${result.fixed.length} storages`,
			details: result.fixed,
		});
	} catch (error) {
		console.error("Error fixing storage product counts:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Failed to fix storage product counts",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}