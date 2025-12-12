import { type NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "../shared/exceptions";
import { tryCatch } from "@/lib/utils";
import * as controller from "./controller";
import type { OrderFilters } from "./types";
import { OrdersNotFoundException } from "./exceptions";
import { withAdminOnly } from "@/contexts/auth/middlewares";
import { DEMO_DATA } from "@/lib/mongo-fallback";

export async function getOrdersCountView(
	_: NextRequest,
): Promise<NextResponse> {
	const { data: count, error } = await tryCatch(controller.getOrdersCount());

	if (error) {
		console.log("MongoDB not available for orders count, returning 0");
		return NextResponse.json({ count: 0, _isDemo: true });
	}

	return NextResponse.json({ count });
}

export async function getOrdersViews(req: NextRequest): Promise<NextResponse> {
	const {
		page,
		limit,
		filters = "{}",
		sort,
	} = Object.fromEntries(req.nextUrl.searchParams);

	const parsedFilters = JSON.parse(filters) as OrderFilters;
	
	// Parse sort parameter
	const sortParams = sort ? sort.split(',').map((s: string) => {
		const [field, order] = s.split(':');
		return { field, order: order || 'asc' };
	}) : [];

	const { data, error } = await tryCatch(
		controller.getOrders(
			{
				page: Number.parseInt(page),
				limit: Number.parseInt(limit),
			},
			parsedFilters,
			sortParams,
		),
	);

	if (error) {
		console.log("MongoDB not available for orders, returning empty data");
		return NextResponse.json({ ...DEMO_DATA.orders, _isDemo: true });
	}

	if (!data) {
		return new OrdersNotFoundException().toNextResponse();
	}

	return NextResponse.json(data);
}

export async function getOrderByIdView(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
	const { id } = await params;

	const { data: order, error } = await tryCatch(controller.getOrderById(id));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json(order);
}

export async function createOrderView(
	request: NextRequest,
): Promise<NextResponse> {
	const orderData = await request.json();

	const { data, error } = await tryCatch(controller.createOrder(orderData));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json(data);
}

export async function updateOrderView(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
	const { id } = await params;
	const orderData = await request.json();

	const { data, error } = await tryCatch(controller.updateOrder(id, orderData));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json(data);
}

export const deleteOrderView = withAdminOnly()(async (req) => {
	const url = new URL(req.url);
	const pathSegments = url.pathname.split("/");
	const id = pathSegments[pathSegments.length - 1];

	const { data, error } = await tryCatch(controller.deleteOrder(id));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json({ success: true, deleted: data });
});

export const deleteOrdersView = withAdminOnly()(async (request) => {
	const { ids } = await request.json();

	const { data, error } = await tryCatch(controller.deleteOrders(ids));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json({ success: true, deleted: data });
});
