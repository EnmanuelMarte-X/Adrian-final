"use client";

import { Menu, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "next-auth/react";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MenuItem {
	title: string;
	url: string;
	description?: string;
	icon?: React.ReactNode;
	items?: MenuItem[];
}

interface NavbarProps {
	logo: {
		url: string;
		src: string;
		alt: string;
		title: string;
	};
	menu: MenuItem[];
	auth: {
		login: {
			title: string;
			url: string;
		};
		signup: {
			title: string;
			url: string;
		};
	};
}

const Navbar = ({ logo, menu, auth }: NavbarProps) => {
	const [isScrolled, setIsScrolled] = useState(false);
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			data-scroll={isScrolled}
			className={cn(
				"group sticky top-0 left-0 right-0 z-[999] transition-all duration-300 border-b",
				"data-[scroll=true]:bg-background data-[scroll=true]:border-b",
				"data-[scroll=false]:bg-transparent data-[scroll=false]:border-transparent",
			)}
		>
			<div className="px-6 py-4 group-data-[scroll=true]:bg-secondary/50">
				<div className="container mx-auto max-w-7xl">
					<nav className="hidden justify-between lg:flex">
						<div className="flex items-center gap-6">
							<Link href={logo.url} className="flex items-center gap-2">
								<img src={logo.src} className="max-h-10" alt={logo.alt} />
								<span className="text-lg font-semibold tracking-tighter">
									{logo.title}
								</span>
							</Link>
							<div className="flex items-center">
								<NavigationMenu>
									<NavigationMenuList>
										{menu.map((item) => renderMenuItem(item))}
									</NavigationMenuList>
								</NavigationMenu>
							</div>
						</div>
						<div className="flex gap-2">
							{!isAuthenticated && (
								<Button asChild variant="outline" size="sm">
									<a href={auth.login.url}>{auth.login.title}</a>
								</Button>
							)}

							{!isAuthenticated && (
								<Button asChild size="sm">
									<a href={auth.signup.url}>{auth.signup.title}</a>
								</Button>
							)}

							{isAuthenticated && (
								<>
									<Button asChild variant="outline" size="sm">
										<a href="/dashboard">Panel</a>
									</Button>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => signOut({ callbackUrl: "/" })}
									>
										<LogOut className="size-4 mr-2" />
										Cerrar sesión
									</Button>
								</>
							)}
						</div>
					</nav>

					<div className="block lg:hidden">
						<div className="flex items-center justify-between">
							<Link href={logo.url} className="flex items-center gap-2">
								<img
									src={logo.src}
									className="max-h-8"
									alt={logo.alt}
								/>
							</Link>
							<Sheet>
								<SheetTrigger asChild>
									<Button variant="outline" size="icon">
										<Menu className="size-4" />
									</Button>
								</SheetTrigger>
								<SheetContent className="overflow-y-auto">
									<SheetHeader>
										<SheetTitle>
											<Link href={logo.url} className="flex items-center gap-2">
												<img
													src={logo.src}
													className="max-h-8"
													alt={logo.alt}
												/>
											</Link>
										</SheetTitle>
									</SheetHeader>
									<div className="flex flex-col gap-6 p-4">
										<Accordion
											type="single"
											collapsible
											className="flex w-full flex-col gap-4"
										>
											{menu.map((item) => renderMobileMenuItem(item))}
										</Accordion>

										<div className="flex flex-col gap-3">
											{!isAuthenticated && (
												<Button asChild variant="outline">
													<a href={auth.login.url}>{auth.login.title}</a>
												</Button>
											)}
											{!isAuthenticated && (
												<Button asChild>
													<a href={auth.signup.url}>{auth.signup.title}</a>
												</Button>
											)}
											{isAuthenticated && (
												<>
													<Button asChild variant="outline">
														<a href="/dashboard">Panel</a>
													</Button>
													<Button
														variant="destructive"
														onClick={() => signOut({ callbackUrl: "/" })}
													>
														<LogOut className="size-4 mr-2" />
														Cerrar sesión
													</Button>
												</>
											)}
										</div>
									</div>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

const renderMenuItem = (item: MenuItem) => {
	if (item.items) {
		return (
			<NavigationMenuItem key={item.title}>
				<NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
				<NavigationMenuContent className="bg-transparent text-popover-foreground">
					{item.items.map((subItem) => (
						<NavigationMenuLink asChild key={subItem.title} className="w-80">
							<SubMenuLink item={subItem} />
						</NavigationMenuLink>
					))}
				</NavigationMenuContent>
			</NavigationMenuItem>
		);
	}

	return (
		<NavigationMenuItem key={item.title}>
			<NavigationMenuLink
				href={item.url}
				className="bg-transparent hover:text-accent-foreground group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
			>
				{item.title}
			</NavigationMenuLink>
		</NavigationMenuItem>
	);
};

const renderMobileMenuItem = (item: MenuItem) => {
	if (item.items) {
		return (
			<AccordionItem key={item.title} value={item.title} className="border-b-0">
				<AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
					{item.title}
				</AccordionTrigger>
				<AccordionContent className="mt-2">
					{item.items.map((subItem) => (
						<SubMenuLink key={subItem.title} item={subItem} />
					))}
				</AccordionContent>
			</AccordionItem>
		);
	}

	return (
		<a key={item.title} href={item.url} className="text-md font-semibold">
			{item.title}
		</a>
	);
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
	return (
		<a
			className="hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
			href={item.url}
		>
			<div className="text-foreground">{item.icon}</div>
			<div>
				<div className="text-sm font-semibold">{item.title}</div>
				{item.description && (
					<p className="text-muted-foreground text-sm leading-snug">
						{item.description}
					</p>
				)}
			</div>
		</a>
	);
};

export { Navbar };
