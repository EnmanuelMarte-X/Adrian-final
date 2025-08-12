import { siteConfig } from "./siteConfig";

// Configuración para ubicaciones y direcciones
export const locationsConfig = {
	// Ubicación principal (tienda física)
	primary: {
		name: "Tienda Principal",
		address: siteConfig.addresses.primary,
		coordinates: {
			lat: 18.4802489,
			lng: -69.9730215,
		},
		googleMapsUrl: siteConfig.links.googleMaps,
		isMainStore: true,
	},

	// Ubicación alternativa
	alternative: {
		name: "Ubicación Alternativa",
		address: siteConfig.addresses.alternative,
		isMainStore: false,
	},

	// Configuración del mapa
	map: {
		embedUrl:
			"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60632.347471535935!2d-69.9730215!3d18.4802489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f4aecbcc7d%3A0x93c6c79a8e9e7c3e!2sSanto%20Domingo%2C%20Dominican%20Republic!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s",
		title: `Ubicación de ${siteConfig.name} en Santo Domingo`,
	},
} as const;

// Configuración de contacto detallada
export const contactConfig = {
	// Información de contacto principal
	primary: {
		phone: siteConfig.contact.phone.primary,
		email: siteConfig.contact.email.general,
		address: siteConfig.addresses.primary.formatted,
	},

	// Información específica por departamento
	departments: {
		general: {
			email: siteConfig.contact.email.general,
			description: "Consultas generales e información",
		},
		invoicing: {
			email: siteConfig.contact.email.invoices,
			description: "Facturación y documentos fiscales",
		},
		sales: {
			phone: siteConfig.contact.phone.primary,
			description: "Ventas y pedidos",
		},
	},

	// Horarios de atención
	businessHours: siteConfig.businessHours,

	// Redes sociales
	socialMedia: {
		instagram: {
			url: siteConfig.links.instagram,
			handle: "@jhensonsupply",
			platform: "Instagram",
		},
		facebook: {
			url: siteConfig.links.facebook,
			handle: "jhensonsupply",
			platform: "Facebook",
		},
	},
} as const;

// Funciones helper para obtener información de ubicación
export const getPrimaryLocation = () => locationsConfig.primary;

export const getAllLocations = () => [
	locationsConfig.primary,
	locationsConfig.alternative,
];

export const getMapConfig = () => locationsConfig.map;

export const getContactDetails = () => ({
	phone: contactConfig.primary.phone,
	email: contactConfig.primary.email,
	address: contactConfig.primary.address,
	departments: contactConfig.departments,
	businessHours: contactConfig.businessHours.formatted,
	socialMedia: contactConfig.socialMedia,
});
