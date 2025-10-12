import { NextRequest, NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongo";
import { Storage } from "@/contexts/storages/model";
import { Product } from "@/contexts/products/model";
import { withAdminOnly } from "@/contexts/auth/middlewares";

export const POST = withAdminOnly()(async (req: NextRequest) => {
	try {
		await connectToMongo();
		
		// Get all storages
		const storages = await Storage.find({});
		const results = [];

		for (const storage of storages) {
			// Count actual products that have this storage in their locations
			const actualProductCount = await Product.countDocuments({
				"locations.storageId": storage._id,
			});

			console.log(`Storage "${storage.name}" (${storage._id}):`, {
				storedCount: storage.productsCount,
				actualCount: actualProductCount,
				needsFix: storage.productsCount !== actualProductCount
			});

			const wasIncorrect = storage.productsCount !== actualProductCount;

			// Update the productsCount field if it doesn't match
			if (wasIncorrect) {
				await Storage.findByIdAndUpdate(storage._id, {
					productsCount: actualProductCount,
				});
				console.log(`✅ Updated storage "${storage.name}" from ${storage.productsCount} to ${actualProductCount}`);
			}

			results.push({
				storageId: storage._id,
				storageName: storage.name,
				oldCount: storage.productsCount,
				newCount: actualProductCount,
				wasFixed: wasIncorrect,
			});
		}

		const fixedCount = results.filter(r => r.wasFixed).length;

		return NextResponse.json({
			success: true,
			message: `Fixed product counts for ${fixedCount} out of ${storages.length} storages`,
			details: results.filter(r => r.wasFixed), // Only return fixed storages
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
});