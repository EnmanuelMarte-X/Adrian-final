import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Gestión de Clientes | Jheson Supply",
	description: "Administra los clientes de tu negocio",
};

export default function ClientsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
