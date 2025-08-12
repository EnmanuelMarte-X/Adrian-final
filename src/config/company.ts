import { siteConfig } from "./siteConfig";

// Configuración específica de la empresa
export const companyConfig = {
	// Información básica de la empresa
	name: siteConfig.name,
	legalName: siteConfig.legal.fullName,
	businessName: siteConfig.legal.businessName,
	rnc: siteConfig.legal.rnc,

	// Contacto principal
	contact: siteConfig.contact,

	// Dirección principal para facturas y documentos oficiales
	primaryAddress: siteConfig.addresses.primary,

	// Información para recibos y facturas
	receiptInfo: {
		companyName: siteConfig.legal.businessName,
		rnc: `RNC: ${siteConfig.legal.rnc}`,
		email: `Email: ${siteConfig.contact.email.general}`,
		phone: `Tel: ${siteConfig.contact.phone.formatted}`,
		address: `Ubicación: ${siteConfig.addresses.receipt}`,
		footerText: siteConfig.invoicing.footerText,
	},

	// Información para comprobantes de pago
	paymentVoucherInfo: {
		companyName: siteConfig.legal.fullName,
		details: `${siteConfig.legal.rnc} • ${siteConfig.contact.phone.primary} • ${siteConfig.contact.email.invoices}`,
		address: siteConfig.addresses.primary.formatted,
	},

	// Horarios de atención
	businessHours: siteConfig.businessHours,

	// Enlaces importantes
	links: siteConfig.links,
} as const;

// Funciones helper para obtener información formateada
export const getCompanyInfo = () => ({
	name: companyConfig.name,
	rnc: companyConfig.rnc,
	phone: companyConfig.contact.phone.primary,
	email: companyConfig.contact.email.general,
	address: companyConfig.primaryAddress.formatted,
});

export const getReceiptFooter = () => ({
	companyName: companyConfig.receiptInfo.companyName,
	rnc: companyConfig.receiptInfo.rnc,
	email: companyConfig.receiptInfo.email,
	phone: companyConfig.receiptInfo.phone,
	address: companyConfig.receiptInfo.address,
	thankYou: companyConfig.receiptInfo.footerText,
});

export const getContactInfo = () => ({
	phones: [companyConfig.contact.phone.primary],
	emails: [
		companyConfig.contact.email.general,
		companyConfig.contact.email.invoices,
	],
	addresses: [companyConfig.primaryAddress, siteConfig.addresses.alternative],
});

export const getBusinessHours = () => siteConfig.businessHours.formatted;
