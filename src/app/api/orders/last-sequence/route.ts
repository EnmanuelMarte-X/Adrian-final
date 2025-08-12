import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongo";
import { Order } from "@/contexts/orders/model";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const type = searchParams.get("type");

		if (!type || (type !== "cf" && type !== "ncf")) {
			return NextResponse.json(
				{ error: "Invalid type parameter. Must be 'cf' or 'ncf'" },
				{ status: 400 },
			);
		}

		await connectToMongo();

		if (type === "cf") {
			const latestOrder = await Order.findOne({
				cfSequence: { $exists: true, $ne: null },
			})
				.sort({ cfSequence: -1 })
				.exec();
			console.log("Latest CF sequence:", latestOrder);
			const nextSequence = latestOrder?.cfSequence
				? latestOrder.cfSequence + 1
				: 1;
			return NextResponse.json({ cfSequence: nextSequence });
		}

		const latestOrder = await Order.findOne({
			ncfSequence: { $exists: true, $ne: null },
		})
			.sort({ ncfSequence: -1 })
			.exec();
		const nextSequence = latestOrder?.ncfSequence
			? latestOrder.ncfSequence + 1
			: 1;
		return NextResponse.json({ ncfSequence: nextSequence });
	} catch (error) {
		console.error("Error fetching latest sequence:", error);
		return NextResponse.json(
			{ error: "Failed to fetch latest sequence" },
			{ status: 500 },
		);
	}
}
