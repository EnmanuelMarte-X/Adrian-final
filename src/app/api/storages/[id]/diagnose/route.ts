import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongo";
import { Storage } from "@/contexts/storages/model";
import { Product } from "@/contexts/products/model";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	try {
		const { id } = await params;
		await connectToMongo();
		
		// Get the specific storage
		const storage = await Storage.findById(id);
		if (!storage) {
			return NextResponse.json(
				{ error: "Storage not found" },
				{ status: 404 }
			);
		}

		// Count actual products that have this storage in their locations
		const actualProductCount = await Product.countDocuments({
			"locations.storageId": storage._id,
		});

		// Get the products that are in this storage for debugging
		const productsInStorage = await Product.find(
			{ "locations.storageId": storage._id },
			{ name: 1, locations: 1 }
		);

		return NextResponse.json({
			storage: {
				_id: storage._id,
				name: storage.name,
				storedCount: storage.productsCount,
				actualCount: actualProductCount,
				isCorrect: storage.productsCount === actualProductCount,
			},
			products: productsInStorage.map(product => ({
				_id: product._id,
				name: product.name,
				locationsCount: product.locations?.length || 0,
				hasThisStorage: product.locations?.some((loc: any) => 
					loc.storageId.toString() === storage._id.toString()
				),
			})),
		});
	} catch (error) {
		console.error("Error diagnosing storage count:", error);
		return NextResponse.json(
			{
				error: "Failed to diagnose storage count",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}