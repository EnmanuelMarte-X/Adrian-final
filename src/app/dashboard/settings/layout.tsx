import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Ajustes | Jheson Supply",
	description: "Configura los ajustes de tu perfil y de la tienda.",
};

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
