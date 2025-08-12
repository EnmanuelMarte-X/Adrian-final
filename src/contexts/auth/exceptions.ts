import { APIError } from "@/contexts/shared/exceptions";

export class UserUnauthorizedException extends APIError {
	constructor() {
		super(401, "No autorizado", "user_unauthorized");
	}
}
