import { parseSortParams, tryCatch } from "@/lib/utils";
import * as controller from "./controller";
import { type NextRequest, NextResponse } from "next/server";
import { getErrorResponse } from "../shared/exceptions";
import { ProductsNotFoundException } from "./exceptions";
import type { ProductFilters, ProductSort } from "./types";
import { withAdminOnly } from "@/contexts/auth/middlewares";
import { DEMO_DATA } from "@/lib/mongo-fallback";

export async function getProductsCountView(
	_: NextRequest,
): Promise<NextResponse> {
	const { data: count, error } = await tryCatch(controller.getProductsCount());

	if (error) {
		// Si hay error de conexión, devolver 0 en lugar de error
		console.log("MongoDB not available for products count, returning 0");
		return NextResponse.json({ count: 0, _isDemo: true });
	}

	return NextResponse.json({ count });
}

export async function getProductsView(req: NextRequest): Promise<NextResponse> {
	const {
		page,
		limit,
		sort = "",
		filters = "{}",
	} = Object.fromEntries(req.nextUrl.searchParams);

	const sortArray = parseSortParams<ProductSort>(sort);

	const parsedFilters = JSON.parse(filters) as ProductFilters;
	const { data, error } = await tryCatch(
		controller.getProducts(
			{
				page: Number.parseInt(page),
				limit: Number.parseInt(limit),
			},
			parsedFilters,
			sortArray,
		),
	);

	if (error) {
		// Si hay error de conexión a MongoDB, devolver datos vacíos
		console.log("MongoDB not available for products, returning empty data");
		return NextResponse.json({ ...DEMO_DATA.products, _isDemo: true });
	}

	if (!data) {
		return new ProductsNotFoundException().toNextResponse();
	}

	return NextResponse.json(data);
}

export async function getProductByIdView(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
	const { id } = await params;
	const { filters = "{}" } = Object.fromEntries(req.nextUrl.searchParams);

	const parsedFilters = JSON.parse(filters) as ProductFilters;
	const { data, error } = await tryCatch(
		controller.getProductById(id, parsedFilters),
	);

	if (error) {
		return getErrorResponse(error);
	}

	if (!data) {
		return new ProductsNotFoundException().toNextResponse();
	}

	return NextResponse.json(data);
}

export async function createProductView(
	req: NextRequest,
): Promise<NextResponse> {
	const product = await req.json();

	const { data, error } = await tryCatch(
		controller.createProduct(product),
	);

	if (error) {
		console.error("Error creating product:", error);
		return getErrorResponse(error);
	}

	return NextResponse.json(data, { status: 201 });
}

export async function updateProductView(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
	const { id } = await params;
	const product = await req.json();

	const { data, error } = await tryCatch(
		controller.updateProduct(id, product),
	);

	if (error) {
		return getErrorResponse(error);
	}

	if (!data) {
		return new ProductsNotFoundException().toNextResponse();
	}

	return NextResponse.json(data);
}

export const deleteProductView = withAdminOnly()(async (req) => {
	const url = new URL(req.url);
	const pathSegments = url.pathname.split("/");
	const id = pathSegments[pathSegments.length - 1];

	const { error } = await tryCatch(controller.deleteProduct(id));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json({ success: true });
});

export const deleteProductsView = withAdminOnly()(async (req) => {
	const { ids } = await req.json();
	const { error } = await tryCatch(controller.deleteProducts(ids));

	if (error) {
		return getErrorResponse(error);
	}

	return NextResponse.json({ success: true });
});
