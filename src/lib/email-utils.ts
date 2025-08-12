/**
 * Utility functions for sending emails through the API
 */

export interface ContactFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	subject: string;
	message: string;
}

export interface SupplyFormData {
	businessName: string;
	ownerName: string;
	rnc: string;
	businessType: string;
	email: string;
	phone: string;
	address: string;
	monthlyPurchase: string;
	experience: string;
	comments?: string;
}

export interface ReturnFormData {
	orderNumber: string;
	purchaseDate: string;
	customerName: string;
	customerEmail: string;
	productName: string;
	returnReason: string;
}

type FormData = ContactFormData | SupplyFormData | ReturnFormData;

export async function sendEmail(
	type: "contact" | "supply" | "return",
	formData: FormData,
) {
	try {
		const response = await fetch("/api/send-email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				type,
				formData,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Error enviando el email");
		}

		const result = await response.json();
		return result;
	} catch (error) {
		console.error("Error sending email:", error);
		throw error;
	}
}

export async function sendContactEmail(data: ContactFormData) {
	return sendEmail("contact", data);
}

export async function sendSupplyEmail(data: SupplyFormData) {
	return sendEmail("supply", data);
}

export async function sendReturnEmail(data: ReturnFormData) {
	return sendEmail("return", data);
}
