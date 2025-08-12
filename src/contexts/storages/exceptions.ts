import { APIError } from "../shared/exceptions";

export class StorageNotFoundException extends APIError {
	constructor() {
		super(404, "Storage not found", "storage_not_found");
	}
}
