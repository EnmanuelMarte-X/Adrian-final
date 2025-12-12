import { type NextRequest, NextResponse } from "next/server";
import * as controller from "./controller";
import { tryCatch } from "@/lib/utils";
import { getErrorResponse } from "../shared/exceptions";
import { withAdminOnly } from "@/contexts/auth/middlewares";
import { DEMO_DATA } from "@/lib/mongo-fallback";

export const getStoragesView = async (
	req: NextRequest,
): Promise<NextResponse> => {
	const { offset, limit } = Object.fromEntries(req.nextUrl.searchParams);

	const { data, error } = await tryCatch(
		controller.getStorages({
			offset: Number.parseInt(offset) || 0,
			limit: Number.parseInt(limit) || 20,
		}),
	);

	if (error) {
		console.log("MongoDB not available for storages, returning empty data");
		return NextResponse.json({ ...DEMO_DATA.storages, _isDemo: true });
	}

	return NextResponse.json(data);
};

export const getStoragesCountView = async (
	_: NextRequest,
): Promise<NextResponse> => {
	const { data, error } = await tryCatch(controller.getStoragesCount());

	if (error) {
		console.log("MongoDB not available for storages count, returning 0");
		return NextResponse.json({ count: 0, _isDemo: true });
	}

	return NextResponse.json({ count: data });
};

export const createStorageView = async (
	req: NextRequest,
): Promise<NextResponse> => {
	const storage = await req.json();
	const { data, error } = await tryCatch(controller.createStorage(storage));

	if (error) {
		console.error("Error creating storage:", error);
		return getErrorResponse(error);
	}

	return NextResponse.json(data, { status: 201 });
};

export const getStorageByIdView = async (
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
	const { id } = await params;
	const { data, error } = await tryCatch(controller.getStorageById(id));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json(data);
};

export const updateStorageView = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> => {
	const { id } = await params;
	const storage = await req.json();
	const { data, error } = await tryCatch(controller.updateStorage(id, storage));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json(data);
};

export const deleteStorageView = withAdminOnly()(async (req) => {
	const url = new URL(req.url);
	const pathSegments = url.pathname.split("/");
	const id = pathSegments[pathSegments.length - 1];

	const { data, error } = await tryCatch(controller.deleteStorage(id));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json(data);
});
