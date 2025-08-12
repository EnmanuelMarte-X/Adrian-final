// Archivo principal de configuración que exporta todas las configuraciones
export { siteConfig } from "./siteConfig";
export {
	companyConfig,
	getCompanyInfo,
	getReceiptFooter,
	getContactInfo,
	getBusinessHours,
} from "./company";
export {
	locationsConfig,
	contactConfig,
	getPrimaryLocation,
	getAllLocations,
	getMapConfig,
	getContactDetails,
} from "./locations";
export {
	documentsConfig,
	getOrderReceiptConfig,
	getCreditReceiptConfig,
	getPaymentVoucherConfig,
	formatNCF,
	getDocumentFooter,
	getCompanyHeader,
} from "./documents";

// Re-exportar configuraciones específicas existentes
export * from "./filters";
export * from "./formats";
export * from "./pagination";
export * from "./paths";
export * from "./products";
export * from "./roles";
export * from "./shop";

// Configuración consolidada para uso rápido
export const config = {
	site: () => import("./siteConfig").then((m) => m.siteConfig),
	company: () => import("./company").then((m) => m.companyConfig),
	locations: () => import("./locations").then((m) => m.locationsConfig),
	contact: () => import("./locations").then((m) => m.contactConfig),
	documents: () => import("./documents").then((m) => m.documentsConfig),
} as const;

// Funciones de utilidad para acceso rápido a información común
export const quickAccess = {
	// Información básica de la empresa
	companyName: "Jhenson Supply",
	businessName: "JHENSON SUPPLY",
	rnc: "132145399",

	// Contacto rápido
	mainPhone: "+1 (849) 863-6444",
	generalEmail: "info@jhensonsupply.com",
	invoicesEmail: "facturas@jhensonsupply.com",

	// Dirección principal
	mainAddress: "Calle Santa Lucía No. 15, Val. del Este, SDE",

	// Enlaces
	website: "https://jhensonsupply.com",
	instagram: "https://www.instagram.com/jhensonsupply/",
	facebook: "https://www.facebook.com/jhensonsupply/",
	googleMaps: "https://maps.app.goo.gl/DyUqFNWzx3Mxk6ERA",
} as const;
