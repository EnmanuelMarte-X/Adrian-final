import { parseSortParams, tryCatch } from "@/lib/utils";
import * as controller from "./controller";
import { type NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "../shared/exceptions";
import { PaymentHistoryNotFoundException } from "./exceptions";
import type { PaymentHistoryFilters, PaymentHistorySort } from "./types";
import { withAdminOnly } from "@/contexts/auth/middlewares";

export async function getPaymentHistoryCountView(
	_: NextRequest,
): Promise<NextResponse> {
	const { data: count, error } = await tryCatch(
		controller.getPaymentHistoryCount(),
	);

	if (error) {
		console.log("MongoDB not available for payment history count, returning 0");
		return NextResponse.json({ count: 0, _isDemo: true });
	}

	return NextResponse.json({ count });
}

export async function getPaymentHistoryView(
	req: NextRequest,
): Promise<NextResponse> {
	const {
		page,
		limit,
		sort = "",
		filters = "{}",
	} = Object.fromEntries(req.nextUrl.searchParams);

	const sortArray = parseSortParams<PaymentHistorySort>(sort);

	const parsedFilters = JSON.parse(filters) as PaymentHistoryFilters;
	const { data, error } = await tryCatch(
		controller.getPaymentHistory(
			{
				page: Number.parseInt(page),
				limit: Number.parseInt(limit),
			},
			parsedFilters,
			sortArray,
		),
	);

	if (error) {
		console.log("MongoDB not available for payment history, returning empty data");
		return NextResponse.json({
			items: [],
			total: 0,
			page: 1,
			limit: 10,
			totalPages: 0,
			_isDemo: true,
		});
	}

	if (!data) {
		return new PaymentHistoryNotFoundException().toNextResponse();
	}

	return NextResponse.json(data);
}

export async function getPaymentHistoryByIdView(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
	const { id } = await params;
	const { data, error } = await tryCatch(controller.getPaymentHistoryById(id));

	if (error) {
		return getErrorResponse(error);
	}

	if (!data) {
		return new PaymentHistoryNotFoundException().toNextResponse();
	}

	return NextResponse.json(data);
}

export async function getPaymentHistoryByOrderIdView(
	_: NextRequest,
	{ params }: { params: Promise<{ orderId: string }> },
): Promise<NextResponse> {
	const { orderId } = await params;
	const { data, error } = await tryCatch(
		controller.getPaymentHistoryByOrderId(orderId),
	);

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json(data || []);
}

export async function getPaymentHistoryByClientIdView(
	req: NextRequest,
	{ params }: { params: Promise<{ clientId: string }> },
): Promise<NextResponse> {
	const { clientId } = await params;
	const { page, limit } = Object.fromEntries(req.nextUrl.searchParams);

	const pagination =
		page && limit
			? {
					page: Number.parseInt(page),
					limit: Number.parseInt(limit),
				}
			: undefined;

	const { data, error } = await tryCatch(
		controller.getPaymentHistoryByClientId(clientId, pagination),
	);

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json(data || []);
}

export async function createPaymentHistoryView(
	req: NextRequest,
): Promise<NextResponse> {
	const payment = await req.json();

	const { data, error } = await tryCatch(
		controller.createPaymentHistory(payment),
	);

	if (error) {
		console.error("Error creating payment history:", error);
		return getErrorResponse(error);
	}

	return NextResponse.json(data, { status: 201 });
}

export async function updatePaymentHistoryView(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
	const { id } = await params;
	const payment = await req.json();

	const { data, error } = await tryCatch(
		controller.updatePaymentHistory(id, payment),
	);

	if (error) {
		return getErrorResponse(error);
	}

	if (!data) {
		return new PaymentHistoryNotFoundException().toNextResponse();
	}

	return NextResponse.json(data);
}

export const deletePaymentHistoryView = withAdminOnly()(async (req) => {
	const url = new URL(req.url);
	const pathSegments = url.pathname.split("/");
	const id = pathSegments[pathSegments.length - 1];

	const { error } = await tryCatch(controller.deletePaymentHistory(id));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json({ success: true });
});

export const deletePaymentHistoryBatchView = withAdminOnly()(async (req) => {
	const { ids } = await req.json();
	const { error } = await tryCatch(controller.deletePaymentHistoryBatch(ids));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json({ success: true });
});

export async function getPaymentAnalyticsView(
	req: NextRequest,
): Promise<NextResponse> {
	const { period = "12" } = Object.fromEntries(req.nextUrl.searchParams);

	const { data, error } = await tryCatch(
		controller.getPaymentAnalytics(Number.parseInt(period)),
	);

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json(data);
}
