import { getUserBasicInfo } from "@/contexts/users/controller";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	_: NextRequest,
	context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
	try {
		const { id } = await context.params;
		const user = await getUserBasicInfo(id);

		return NextResponse.json(user);
	} catch (error) {
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 },
		);
	}
}
