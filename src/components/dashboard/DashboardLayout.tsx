"use client";

import { useRef } from "react";
import { DashboardHeader } from "./Header";
import { DashboardSidebar } from "./Sidebar";
import { DashboardPage } from "./DashboardPage";

export interface DashboardLayoutProps {
	children: React.ReactNode;
	sidebarRef?: React.RefObject<HTMLDivElement>;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const sidebarRef = useRef<HTMLDivElement>(null);

	return (
		<DashboardSidebar ref={sidebarRef}>
			<DashboardHeader />
			<DashboardPage sidebarRef={sidebarRef}>{children}</DashboardPage>
		</DashboardSidebar>
	);
}
