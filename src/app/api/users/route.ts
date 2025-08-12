import { getUsers, createUser } from "@/contexts/users/controller";
import type { UserFilters } from "@/contexts/users/types";
import type { UserRole } from "@/types/models/users";
import { withAdminOnly } from "@/contexts/auth/middlewares";
import { NextResponse, type NextRequest } from "next/server";
import { APIError } from "@/contexts/shared/exceptions";

export const GET = async (request: NextRequest) => {
	try {
		const searchParams = request.nextUrl.searchParams;
		const page = Number.parseInt(searchParams.get("page") || "1");
		const limit = Number.parseInt(searchParams.get("limit") || "10");

		const filters: UserFilters = {};
		if (searchParams.has("username"))
			filters.username = searchParams.get("username")!;
		if (searchParams.has("email")) filters.email = searchParams.get("email")!;
		if (searchParams.has("name")) filters.name = searchParams.get("name")!;
		if (searchParams.has("role"))
			filters.role = searchParams.get("role")! as unknown as UserRole;
		if (searchParams.has("isActive"))
			filters.isActive = searchParams.get("isActive") === "true";

		const users = await getUsers({ page, limit }, filters);

		return NextResponse.json(users);
	} catch (error) {
		if (error instanceof APIError) {
			return error.toNextResponse();
		}

		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
};

export const POST = withAdminOnly()(async (request) => {
	try {
		const userData = await request.json();
		const newUser = await createUser(userData);

		return NextResponse.json(newUser, { status: 201 });
	} catch (error) {
		if (error instanceof APIError) {
			return error.toNextResponse();
		}

		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
});
