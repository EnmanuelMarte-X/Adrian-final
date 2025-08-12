import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Gestión de Productos | Jheson Supply",
	description: "Administra los productos de tu negocio.",
};

export default function ProductsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
