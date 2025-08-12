"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { defaultPathLabel, pathsLabels } from "@/config/paths";
import { usePathname } from "next/navigation";

export function DashboardHeader() {
	const path = usePathname();
	const label =
		pathsLabels[path as keyof typeof pathsLabels] || defaultPathLabel;

	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger />
			<Separator orientation="vertical" className="mx-2 max-h-6" />
			<h1 className="text-lg font-semibold">{label}</h1>
		</header>
	);
}
