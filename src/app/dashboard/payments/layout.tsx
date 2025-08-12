import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Gestión de Pagos | Jheson Supply",
	description: "Administra los pagos de tus clientes a facturas pendientes.",
};

export default function PaymentsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
