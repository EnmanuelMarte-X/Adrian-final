import { NextResponse } from "next/server";
import { connectToMongo } from "@/lib/mongo";
import { Order } from "@/contexts/orders/model";

export async function GET() {
	try {
		await connectToMongo();
		const latestOrder = await Order.findOne({}).sort({ orderId: -1 }).exec();
		const nextOrderId = latestOrder ? latestOrder.orderId + 1 : 1;
		return NextResponse.json({ orderId: nextOrderId });
	} catch {
		return NextResponse.json(
			{ error: "Failed to fetch latest order ID" },
			{ status: 500 },
		);
	}
}
