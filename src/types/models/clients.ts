export type ClientDocumentType = "cedula" | "rnc" | "passport" | "other";

export type ClientPhoneType = {
	number: string;
	type: "mobile" | "work" | "home" | "other";
	isPrimary: boolean;
};

export type ClientAddressType = {
	street: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	isPrimary: boolean;
};

export type ClientType = {
	_id: string;
	name: string;
	email?: string;
	documentType: ClientDocumentType;
	documentNumber: string;
	phones: ClientPhoneType[];
	addresses: ClientAddressType[];
	debt?: number;
	notes?: string;
	type: "individual" | "company";
	createdAt: Date;
	updatedAt: Date;
	lastPurchaseAt?: Date;
	isActive: boolean;
};

export type ClientBasicInfo = Pick<
	ClientType,
	| "_id"
	| "name"
	| "email"
	| "documentType"
	| "documentNumber"
	| "type"
	| "debt"
	| "phones"
>;
