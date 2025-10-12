import { connectToMongo } from "@/lib/mongo";
import { Storage } from "@/contexts/storages/model";
import { Product } from "@/contexts/products/model";
import mongoose from "mongoose";

export async function fixStorageProductCounts() {
	try {
		await connectToMongo();
		console.log("Connected to MongoDB");

		// Get all storages
		const storages = await Storage.find({});
		console.log(`Found ${storages.length} storages`);

		for (const storage of storages) {
			// Count actual products that have this storage in their locations
			const actualProductCount = await Product.countDocuments({
				"locations.storageId": storage._id,
			});

			console.log(
				`Storage "${storage.name}" (${storage._id}):`,
				`Current count: ${storage.productsCount}, Actual count: ${actualProductCount}`
			);

			// Update the productsCount field if it doesn't match
			if (storage.productsCount !== actualProductCount) {
				await Storage.findByIdAndUpdate(storage._id, {
					productsCount: actualProductCount,
				});
				console.log(
					`✅ Updated storage "${storage.name}" product count from ${storage.productsCount} to ${actualProductCount}`
				);
			} else {
				console.log(`✅ Storage "${storage.name}" count is already correct`);
			}
		}

		console.log("✅ Finished fixing storage product counts");
	} catch (error) {
		console.error("❌ Error fixing storage product counts:", error);
		throw error;
	}
}

// If running this script directly
if (require.main === module) {
	fixStorageProductCounts()
		.then(() => {
			console.log("Script completed successfully");
			process.exit(0);
		})
		.catch((error) => {
			console.error("Script failed:", error);
			process.exit(1);
		});
}