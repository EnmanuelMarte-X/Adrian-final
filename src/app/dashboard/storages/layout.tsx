import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Gestión de Almacenamiento | Jheson Supply",
	description: "Administra el almacenamiento de tus productos.",
};

export default function StoragesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
