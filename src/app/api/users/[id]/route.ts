import {
	getUserById,
	updateUser,
	deleteUser,
} from "@/contexts/users/controller";
import { type NextRequest, NextResponse } from "next/server";
import { withAdminOnly } from "@/contexts/auth/middlewares";

export async function GET(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
	try {
		const { id } = await params;
		const user = await getUserById(id);

		return NextResponse.json(user);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
	try {
		const { id } = await params;
		const userData = await request.json();
		const updatedUser = await updateUser(id, userData);

		return NextResponse.json(updatedUser);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}

export const DELETE = withAdminOnly()(async (req) => {
	try {
		const url = new URL(req.url);
		const pathSegments = url.pathname.split("/");
		const id = pathSegments[pathSegments.length - 1];

		const deletedUser = await deleteUser(id);
		return NextResponse.json(deletedUser);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
});
