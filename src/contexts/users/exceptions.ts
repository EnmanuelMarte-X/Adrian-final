import { APIError } from "../shared/exceptions";

export class UsersNotFoundException extends APIError {
	constructor() {
		super(404, "Users not found", "users_not_found");
	}
}

export class UserNotFoundException extends APIError {
	constructor() {
		super(404, "User not found", "user_not_found");
	}
}

export class UserValidationException extends APIError {
	constructor() {
		super(400, "Invalid user data", "invalid_user_data");
	}
}

export class UserAlreadyExistsException extends APIError {
	constructor() {
		super(
			409,
			"User with this email or username already exists",
			"user_already_exists",
		);
	}
}
