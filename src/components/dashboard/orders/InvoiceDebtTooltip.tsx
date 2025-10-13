"use client";

import { usePaymentHistoryByOrderId } from "@/contexts/paymentHistory/queries";
import type { OrderType } from "@/types/models/orders";
import type { PaymentHistoryType } from "@/types/models/paymentHistory";
import { calculateInvoiceOwing, calculateInvoiceTotal, calculateTotalPaid } from "@/lib/invoice-utils";
import { currencyFormat } from "@/config/formats";
import { Spinner } from "@/components/ui/spinner";
import { paymentMethodIcons, unknownPaymentMethodIcon } from "@/config/orders";

export function InvoiceDebtTooltipContent({ order }: { order: OrderType }) {
    const { data: payments = [], isLoading } = usePaymentHistoryByOrderId(order._id || "");

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-sm">
                <Spinner />
                Cargando...
            </div>
        );
    }

    const total = calculateInvoiceTotal(order);
    const totalPaid = calculateTotalPaid(payments);
    const owing = calculateInvoiceOwing(order, payments);

    // Ordenar pagos por fecha (más reciente primero)
    const sortedPayments: PaymentHistoryType[] = [...payments].sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return db - da;
    });

    return (
        <div className="space-y-3 text-sm w-72 py-2">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="text-muted-foreground">Total</div>
                <div className="font-semibold text-right">{currencyFormat.format(total)}</div>

                <div className="text-muted-foreground">Pagado</div>
                <div className="font-semibold text-right">{currencyFormat.format(totalPaid)}</div>

                <div className="text-muted-foreground">Pendiente</div>
                <div className={`font-bold text-right ${owing > 0 ? "text-destructive" : "text-success"}`}>
                    {currencyFormat.format(owing)}
                </div>
            </div>

            <div className="border rounded-md overflow-hidden text-xs">
                <div className="flex items-center justify-between bg-secondary px-3 py-1.5 text-[11px] font-medium">
                    <span>Fecha</span>
                    <span className="text-center">Método</span>
                    <span className="text-right">Monto</span>
                </div>

                {sortedPayments.length === 0 ? (
                    <div className="px-3 py-2 text-center text-xs text-muted-foreground">Sin pagos registrados</div>
                ) : (
                    <div className="divide-y">
                        {sortedPayments.map((payment) => (
                            <div key={payment._id} className="flex items-center justify-between px-3 py-2">
                                {/* Fecha compacta */}
                                <span className="text-xs text-muted-foreground">
                                    {new Date(payment.date).toLocaleDateString()}{" "}
                                    <span className="text-[11px] text-muted-foreground/80">
                                        {new Date(payment.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                </span>

                                {/* Método */}
                                <span className="text-xs text-center mx-2">
                                    {paymentMethodIcons[payment.method] ?? unknownPaymentMethodIcon}
                                </span>

                                {/* Monto */}
                                <span className="text-xs font-semibold text-right">
                                    {currencyFormat.format(payment.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pie: conteo de pagos */}
            <div className="text-center pt-1">
                <span className="text-xs text-muted-foreground">
                    {payments.length} pago{payments.length !== 1 ? "s" : ""} registrado{payments.length !== 1 ? "s" : ""}
                </span>
            </div>
        </div>
    );
}