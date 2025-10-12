import { TAX_PERCENTAGE } from "@/config/shop";
import type { OrderType } from "@/types/models/orders";
import type { PaymentHistoryType } from "@/types/models/paymentHistory";

/**
 * Calcula el total de una factura incluyendo impuestos y descuentos
 */
export function calculateInvoiceTotal(order: OrderType): number {
	const subtotal =
		order?.products?.reduce((total, product) => {
			return total + product.price * product.quantity;
		}, 0) ?? 0;
	
	const totalDiscount =
		order?.products?.reduce((totalDiscount, product) => {
			return totalDiscount + (product.discount || 0);
		}, 0) ?? 0;
	
	const tax = subtotal * TAX_PERCENTAGE;
	const total = subtotal - totalDiscount + tax;
	
	return total;
}

/**
 * Calcula cuánto se ha pagado de una factura específica
 */
export function calculateTotalPaid(payments: PaymentHistoryType[]): number {
	return payments.reduce((total, payment) => total + payment.amount, 0);
}

/**
 * Calcula cuánto se debe de una factura específica
 * @param order - La orden/factura
 * @param payments - Los pagos realizados a esta factura
 * @returns La cantidad pendiente por pagar
 */
export function calculateInvoiceOwing(
	order: OrderType,
	payments: PaymentHistoryType[]
): number {
	const total = calculateInvoiceTotal(order);
	const totalPaid = calculateTotalPaid(payments);
	
	// Devuelve la cantidad pendiente, mínimo 0
	return Math.max(0, total - totalPaid);
}

/**
 * Determina si una factura está completamente pagada
 */
export function isInvoiceFullyPaid(
	order: OrderType,
	payments: PaymentHistoryType[]
): boolean {
	const owing = calculateInvoiceOwing(order, payments);
	return owing <= 0.01; // Consideramos pagado si debe menos de 1 centavo
}

/**
 * Obtiene el estado de pago de una factura
 */
export function getInvoicePaymentStatus(
	order: OrderType,
	payments: PaymentHistoryType[]
): "paid" | "partial" | "unpaid" {
	if (!order.isCredit) {
		return "paid"; // Las facturas de contado siempre están pagadas
	}
	
	const totalPaid = calculateTotalPaid(payments);
	const total = calculateInvoiceTotal(order);
	
	if (totalPaid <= 0) {
		return "unpaid";
	} else if (totalPaid >= total - 0.01) {
		return "paid";
	} else {
		return "partial";
	}
}