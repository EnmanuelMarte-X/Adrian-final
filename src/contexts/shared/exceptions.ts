import { NextResponse } from "next/server";

export class APIError extends Error {
	statusCode: number;
	i18nKey: string;

	constructor(statusCode: number, message: string, i18nKey: string) {
		super(message);
		this.name = "APIError";
		this.statusCode = statusCode;
		this.i18nKey = i18nKey;
	}

	toJSON() {
		return {
			error: {
				message: this.message,
				i18nKey: this.i18nKey,
			},
		};
	}

	toNextResponse() {
		return NextResponse.json(this.toJSON(), { status: this.statusCode });
	}
}

export class InvalidObjectIdException extends APIError {
	constructor() {
		super(400, "Invalid ObjectId", "invalid_object_id");
	}
}

export class InternalServerException extends APIError {
	constructor() {
		super(500, "Internal Server Error", "internal_server_error");
	}
}

// Type guard to check if error is APIError-like
const isAPIError = (error: unknown): error is APIError => {
	return (
		error instanceof Error &&
		"statusCode" in error &&
		"i18nKey" in error &&
		"toNextResponse" in error &&
		typeof (error as Record<string, unknown>).toNextResponse === "function"
	);
};

export const getErrorResponse = (error: unknown): NextResponse => {
	if (isAPIError(error)) {
		return error.toNextResponse();
	}

	console.error("Unhandled error:", error);
	return new InternalServerException().toNextResponse();
};
