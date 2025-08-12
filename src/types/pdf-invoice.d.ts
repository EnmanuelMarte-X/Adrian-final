declare module "@h1dd3nsn1p3r/pdf-invoice" {
	interface CompanyInfo {
		logo?: string;
		name: string;
		address: string;
		phone: string;
		email: string;
		website?: string;
		taxId?: string;
		bank?: string;
	}

	interface CustomerInfo {
		name: string;
		company?: string;
		address: string;
		phone: string;
		email: string;
		taxId?: string;
	}

	interface InvoiceInfo {
		number: string | number;
		date?: string;
		dueDate?: string;
		status?: string;
		locale?: string;
		currency?: string;
		path: string;
	}

	interface InvoiceItem {
		name: string;
		quantity: number;
		price: number;
		tax?: number;
	}

	interface QRInfo {
		data: string;
		width?: number;
	}

	interface NoteInfo {
		text: string;
		italic?: boolean;
	}

	interface PDFInvoicePayload {
		company: CompanyInfo;
		customer: CustomerInfo;
		invoice: InvoiceInfo;
		items: InvoiceItem[];
		qr?: QRInfo;
		note?: NoteInfo;
	}

	export class PDFInvoice {
		constructor(payload: PDFInvoicePayload);
		create(): Promise<string>;
	}
}
