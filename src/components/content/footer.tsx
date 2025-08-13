import { cn } from "@/lib/utils";

import {
	Footer,
	FooterBottom,
	FooterColumn,
	FooterContent,
} from "@/components/ui/footer";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Logo } from "@/components/logo";

interface FooterLink {
	text: string;
	href: string;
}

interface FooterColumnProps {
	title: string;
	links: FooterLink[];
}

interface FooterProps {
	logo?: React.ReactNode;
	name?: string;
	columns: FooterColumnProps[];
	copyright?: string;
	policies: FooterLink[];
	showModeToggle?: boolean;
	className?: string;
}

export function FooterSection({
	logo = <Logo />,
	name = "Jhenson Supply",
	columns,
	copyright = "© 2025 Jhenson Supply.",
	policies,
	showModeToggle = true,
	className,
}: FooterProps) {
	return (
		<footer className={cn("bg-secondary/50 w-full px-4 border-t", className)}>
			<div className="max-w-7xl mx-auto">
				<Footer>
					<FooterContent>
						<FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
							<div className="flex items-center gap-2">
								{logo}
								<h3 className="text-xl font-bold">{name}</h3>
							</div>
						</FooterColumn>
						{columns.map((column, index) => (
							<FooterColumn key={index}>
								<h3 className="text-md pt-1 font-semibold">{column.title}</h3>
								{column.links.map((link, linkIndex) => (
									<a
										key={linkIndex}
										href={link.href}
										className="text-muted-foreground text-sm hover:text-foreground"
									>
										{link.text}
									</a>
								))}
							</FooterColumn>
						))}
					</FooterContent>
					<FooterBottom>
						<div>{copyright}</div>
						<div className="flex items-center gap-4">
							{policies.map((policy, index) => (
								<a key={index} href={policy.href} className="hover:text-foreground">
									{policy.text}
								</a>
							))}
							{showModeToggle && <ModeToggle />}
						</div>
					</FooterBottom>
				</Footer>
			</div>
		</footer>
	);
}
