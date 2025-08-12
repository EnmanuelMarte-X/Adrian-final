import { siteConfig } from "./siteConfig";

// Configuración para documentos fiscales y recibos
export const documentsConfig = {
	// Configuración de NCF (Numeración de Comprobantes Fiscales)
	ncf: {
		prefix: siteConfig.invoicing.ncfPrefix,
		padLength: 8,
		format: (sequence: number) =>
			`${siteConfig.invoicing.ncfPrefix}${String(sequence).padStart(8, "0")}`,
	},

	// Plantillas para recibos de órdenes
	orderReceipt: {
		header: {
			companyName: siteConfig.legal.businessName,
			title: "RECIBO DE VENTA",
		},
		footer: {
			thankYou: siteConfig.invoicing.footerText,
			companyInfo: {
				rnc: `RNC: ${siteConfig.legal.rnc}`,
				email: `Email: ${siteConfig.contact.email.general}`,
				phone: `Tel: ${siteConfig.contact.phone.formatted}`,
				address: `Ubicación: ${siteConfig.addresses.receipt}`,
			},
		},
	},

	// Plantillas para recibos de crédito
	creditReceipt: {
		header: {
			companyName: siteConfig.legal.fullName,
			title: "RECIBO DE CRÉDITO",
		},
		footer: {
			companyInfo: {
				rnc: `RNC ${siteConfig.legal.rnc}`,
				phone: siteConfig.contact.phone.primary,
				email: siteConfig.contact.email.invoices,
				address: siteConfig.addresses.primary.formatted,
			},
		},
	},

	// Plantillas para comprobantes de pago
	paymentVoucher: {
		header: {
			companyName: siteConfig.legal.fullName,
			title: "COMPROBANTE DE PAGO",
		},
		footer: {
			companyName: siteConfig.legal.fullName,
			details: `${siteConfig.legal.rnc} • ${siteConfig.contact.phone.primary} • ${siteConfig.contact.email.invoices}`,
			address: siteConfig.addresses.primary.formatted,
		},
	},

	// Configuración común para todos los documentos
	common: {
		currency: "RD$",
		country: "República Dominicana",
		timezone: "America/Santo_Domingo",
		dateFormat: "DD/MM/YYYY",
		timeFormat: "hh:mm A",
	},
} as const;

// Funciones helper para generar información de documentos
export const getOrderReceiptConfig = () => documentsConfig.orderReceipt;

export const getCreditReceiptConfig = () => documentsConfig.creditReceipt;

export const getPaymentVoucherConfig = () => documentsConfig.paymentVoucher;

export const formatNCF = (sequence: number) =>
	documentsConfig.ncf.format(sequence);

export const getDocumentFooter = (type: "order" | "credit" | "payment") => {
	switch (type) {
		case "order":
			return documentsConfig.orderReceipt.footer;
		case "credit":
			return documentsConfig.creditReceipt.footer;
		case "payment":
			return documentsConfig.paymentVoucher.footer;
		default:
			return documentsConfig.orderReceipt.footer;
	}
};

export const getCompanyHeader = (type: "order" | "credit" | "payment") => {
	switch (type) {
		case "order":
			return documentsConfig.orderReceipt.header;
		case "credit":
			return documentsConfig.creditReceipt.header;
		case "payment":
			return documentsConfig.paymentVoucher.header;
		default:
			return documentsConfig.orderReceipt.header;
	}
};
