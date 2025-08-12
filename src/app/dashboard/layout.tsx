import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Administaracion | Jhenson Supply",
};

export default function DashboardPageLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return <DashboardLayout>{children}</DashboardLayout>;
}
