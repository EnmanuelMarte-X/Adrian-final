"use client";

import { PaymentVoucher } from "@/components/dashboard/paymentHistory/PaymentVoucher";
import { usePaymentHistoryById } from "@/contexts/paymentHistory/queries";
import { use, useEffect } from "react";
import { toast } from "sonner";

export default function VoucherSlugPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: paymentId } = use(params);
	const {
		data: payment,
		isError,
		isLoading,
	} = usePaymentHistoryById(paymentId);

	useEffect(() => {
		if (payment && !isLoading && !isError) {
			const timer = setTimeout(() => {
				toast.info(
					"Para una impresión limpia, desactive 'Headers y footers' en las opciones de impresión del navegador.",
					{
						duration: 4000,
					},
				);
				window.print();
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, [payment, isLoading, isError]);

	if (isError || !payment) {
		return null;
	}

	return (
		<>
			<PaymentVoucher payment={payment} isLoading={isLoading} />

			<style jsx global>{`
				@media print {
					@page {
						margin: 0.4in;
						size: letter portrait;
						/* Ocultar headers y footers del navegador */
						margin-top: 10mm;
						margin-bottom: 10mm;
					}

					/* Margen inferior específico para la segunda página */
					#payment-voucher:nth-child(2) {
						margin-bottom: 20mm !important;
					}

					/* Ocultar headers y footers automáticos del navegador */
					@page :first {
						margin-top: 0;
					}

					@page :left {
						margin-left: 0.4in;
						margin-right: 0.4in;
					}

					@page :right {
						margin-left: 0.4in;
						margin-right: 0.4in;
					}

					body {
						-webkit-print-color-adjust: exact;
						print-color-adjust: exact;
						margin: 0 !important;
						padding: 0 !important;
					}

					* {
						visibility: hidden;
					}

					#payment-voucher,
					#payment-voucher * {
						visibility: visible;
					}

					#payment-voucher {
						position: absolute;
						left: 0;
						top: 0;
						width: 100%;
						background: white !important;
						box-shadow: none !important;
						margin: 0 !important;
						padding: 0 !important;
					}
				}

				@media screen {
					body {
						margin: 0;
						padding: 0;
						background: white;
					}
				}
			`}</style>
		</>
	);
}
