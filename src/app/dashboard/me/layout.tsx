import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Mi perfil | Jheson Supply",
	description: "Ve tu perfil, permisos y roles.",
};

export default function MeLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
