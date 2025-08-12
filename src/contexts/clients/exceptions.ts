import { APIError } from "../shared/exceptions";

export class ClientNotFoundException extends APIError {
	constructor() {
		super(404, "Cliente no encontrado", "client_not_found");
	}
}

export class ClientAlreadyExistsException extends APIError {
	constructor() {
		super(
			409,
			"Ya existe un cliente con ese documento o correo electrónico",
			"client_already_exists",
		);
	}
}

export class InvalidClientDataException extends APIError {
	constructor() {
		super(400, "Los datos del cliente son inválidos", "invalid_client_data");
	}
}
