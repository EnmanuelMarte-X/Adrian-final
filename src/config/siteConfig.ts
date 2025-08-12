export const siteConfig = {
	url: "https://jhensonsupply.com",
	name: "Jhenson Supply",
	description: "Tu tienda integral para todas tus necesidades de suministros.",
	contact: {
		email: {
			general: "info@jhensonsupply.com",
			invoices: "orders@jhensonsupply.com",
			admin: "admin@jhensonsupply.com",
			system: "system@jehnsonsupply.com",
		},
		phone: {
			primary: "+18498636444",
			formatted: "+1 (849) 863-6444",
		},
	},

	legal: {
		rnc: "132145399",
		fullName: "Jhenson Supply",
		businessName: "JHENSON SUPPLY",
	},

	addresses: {
		primary: {
			street: "Calle Santa Lucía No. 15",
			city: "Val. del Este",
			province: "Santo Domingo Este",
			postalCode: "11605",
			country: "República Dominicana",
			formatted: "Calle Santa Lucía No. 15, Val. del Este, SDE",
		},
		alternative: {
			street: "C. 12 113",
			city: "Santo Domingo Este",
			postalCode: "11509",
			country: "República Dominicana",
		},

		receipt: "Av. Principal #123, Santo Domingo, R.D.",
	},

	businessHours: {
		monday: { open: "8:00 AM", close: "6:00 PM" },
		tuesday: { open: "8:00 AM", close: "6:00 PM" },
		wednesday: { open: "8:00 AM", close: "6:00 PM" },
		thursday: { open: "8:00 AM", close: "6:00 PM" },
		friday: { open: "8:00 AM", close: "6:00 PM" },
		saturday: { open: "8:00 AM", close: "4:00 PM" },
		sunday: null, // Cerrado
		formatted: {
			weekdays: "Lunes - Viernes: 8:00 AM - 6:00 PM",
			saturday: "Sábados: 8:00 AM - 4:00 PM",
			sunday: "Domingos: Cerrado",
		},
	},

	links: {
		instagram: "https://www.instagram.com/jhensonsupply/",
		facebook: "https://www.facebook.com/jhensonsupply/",
		googleMaps: "https://maps.app.goo.gl/DyUqFNWzx3Mxk6ERA",
	},

	invoicing: {
		ncfPrefix: "B01",
		cfPrefix: "B02",
		footerText: "GRACIAS POR SU COMPRA",
	},

	meta: {
		copyright: "© 2025 Jhenson Supply.",
		domain: "jhensonsupply.com",
		title: {
			default: "Jhenson Supply",
			dashboard: "Administración | Jhenson Supply",
		},
	},
};
