import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Gestión de Facturas | Jheson Supply",
	description: "Administra las facturas de tus clientes.",
};

export default function OrdersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
