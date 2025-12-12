import { type NextRequest, NextResponse } from "next/server";
import * as controller from "./controller";
import { parseSortParams, tryCatch } from "@/lib/utils";
import { getErrorResponse } from "../shared/exceptions";
import { ClientNotFoundException } from "./exceptions";
import type { ClientFilters, ClientSort } from "./types";
import { withAdminOnly } from "@/contexts/auth/middlewares";
import { DEMO_DATA } from "@/lib/mongo-fallback";

export async function getClientsCountView(
	_: NextRequest,
): Promise<NextResponse> {
	const { data: count, error } = await tryCatch(controller.getClientsCount());

	if (error) {
		console.log("MongoDB not available for clients count, returning 0");
		return NextResponse.json({ count: 0, _isDemo: true });
	}

	return NextResponse.json({ count });
}

export async function getClientsView(req: NextRequest): Promise<NextResponse> {
	const {
		page,
		limit,
		sort = "",
		filters = "{}",
	} = Object.fromEntries(req.nextUrl.searchParams);

	const sortArray = parseSortParams<ClientSort>(sort);
	const parsedFilters = JSON.parse(filters) as ClientFilters;

	const { data, error } = await tryCatch(
		controller.getClients(
			{
				page: Number.parseInt(page),
				limit: Number.parseInt(limit),
			},
			parsedFilters,
			sortArray,
		),
	);

	if (error) {
		console.log("MongoDB not available for clients, returning empty data");
		return NextResponse.json({ ...DEMO_DATA.clients, _isDemo: true });
	}

	if (!data) {
		return new ClientNotFoundException().toNextResponse();
	}

	return NextResponse.json(data);
}

export async function getClientByIdView(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
	const { id } = await params;
	const { data, error } = await tryCatch(controller.getClientById(id));

	if (error) {
		return getErrorResponse(error);
	}

	if (!data) {
		return new ClientNotFoundException().toNextResponse();
	}

	return NextResponse.json(data);
}

export async function createClientView(
	req: NextRequest,
): Promise<NextResponse> {
	const client = await req.json();
	const { data, error } = await tryCatch(controller.createClient(client));

	if (error) {
		console.error("Error creating client:", error);
		return getErrorResponse(error);
	}

	return NextResponse.json(data, { status: 201 });
}

export async function updateClientView(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
	const { id } = await params;
	const client = await req.json();
	const { data, error } = await tryCatch(controller.updateClient(id, client));

	if (error) {
		return getErrorResponse(error);
	}

	if (!data) {
		return new ClientNotFoundException().toNextResponse();
	}

	return NextResponse.json(data);
}

export const deleteClientView = withAdminOnly()(async (req) => {
	const url = new URL(req.url);
	const pathSegments = url.pathname.split("/");
	const id = pathSegments[pathSegments.length - 1];

	const { error } = await tryCatch(controller.deleteClient(id));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json({ success: true });
});

export const deleteClientsView = withAdminOnly()(async (req) => {
	const { ids } = await req.json();
	const { error } = await tryCatch(controller.deleteClients(ids));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json({ success: true });
});
