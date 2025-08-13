"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
} from "@/components/ui/sidebar";

import {
	BanknoteIcon,
	FileTextIcon,
	HomeIcon,
	PackageIcon,
	SettingsIcon,
	UserIcon,
	UsersIcon,
	WarehouseIcon,
} from "lucide-react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { useEffect, useRef } from "react";
import { Logo } from "../logo";

export interface DashboardSidebarProps {
	ref: React.RefObject<HTMLDivElement | null>;
	children: React.ReactNode;
}

const sidebarItems = [
	{ href: "/dashboard", name: "Resumen", icon: HomeIcon },
	{ href: "/dashboard/products", name: "Productos", icon: PackageIcon },
	{ href: "/dashboard/storages", name: "Almacenes", icon: WarehouseIcon },
	{ href: "/dashboard/orders", name: "Facturas", icon: FileTextIcon },
	{ href: "/dashboard/clients", name: "Clientes", icon: UsersIcon },
	{ href: "/dashboard/payments", name: "Pagos", icon: BanknoteIcon },
	{ href: "/dashboard/me", name: "Perfil", icon: UserIcon },
	{ href: "/dashboard/settings", name: "Ajustes", icon: SettingsIcon },
];

export function DashboardSidebar({ children }: DashboardSidebarProps) {
	const pathname = usePathname();
	const sidebarRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleResize = () => {
			if (sidebarRef.current) {
				sidebarRef.current.style.maxWidth = `${window.innerWidth}px`;
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	return (
		<SidebarProvider>
			<Sidebar ref={sidebarRef} variant="inset" collapsible="icon">
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton size="lg" className="hover:bg-transparent">
								<Logo width={64} height={64} className="size-10" />
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">Jhenson Supply</span>
									<Link
										href={"/"}
										className="truncate text-xs hover:text-primary hover:underline"
									>
										jhensonsupply.com
									</Link>
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Principal</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{sidebarItems.slice(0, 6).map((item) => (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											asChild
											tooltip={item.name}
											isActive={pathname === item.href}
										>
											<Link href={item.href}>
												<item.icon className="size-4" />
												<span>{item.name}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupLabel>Personal</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{sidebarItems.slice(6).map((item) => (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											asChild
											tooltip={item.name}
											isActive={pathname.startsWith(item.href)}
										>
											<Link href={item.href}>
												<item.icon className="size-4" />
												<span>{item.name}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarRail />
			</Sidebar>
			<SidebarInset>{children}</SidebarInset>
		</SidebarProvider>
	);
}
