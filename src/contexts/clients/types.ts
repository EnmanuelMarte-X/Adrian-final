export interface ClientFilters {
	name?: string;
	documentNumber?: string;
	phone?: string;
	documentType?: "cedula" | "rnc" | "passport" | "other";
	type?: "individual" | "company";
	email?: string;
	isActive?: boolean;
}

export interface ClientSort {
	field: "name" | "documentNumber" | "_id" | "createdAt" | "lastPurchaseAt";
	order: "asc" | "desc";
}
