import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Jhenson Supply",
	description: "Descubre nuestra amplia gama de shampoos, acondicionadores, productos de belleza y cuidado personal. Calidad premium, precios competitivos y envío rápido.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es-DO" suppressHydrationWarning>
			<body
				className={cn(
					"bg-background text-foreground antialiased",
					inter.className,
				)}
			>
				<div className="relative min-h-screen">
					<Providers>{children}</Providers>
				</div>
				<Toaster richColors position="top-center" />
			</body>
		</html>
	);
}
