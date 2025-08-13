import { FooterSection } from "./footer";
import { Navbar } from "./navbar";
import { Logo } from "../logo";
import { siteConfig } from "@/config";

const navbarConfig = {
	logo: {
		url: "/",
		src: "/logo.png",
		alt: "Logo",
		title: "Jhenson Supply",
	},
	menu: [
		{
			title: "Principal",
			url: "/",
		},
		{
			title: "Catálogo",
			url: "/products",
		},
		{ title: "Acerca de", url: "/about" },
		{ title: "Contacto", url: "/contact" },
	],
	auth: {
		login: {
			title: "Ir a dashboard",
			url: "/dashboard",
		},
		signup: {
			title: "Suplirme",
			url: "/supply",
		},
	},
};

const footerConfig = {
	logo: <Logo width={40} height={40} />,
	columns: [
		{
			title: "Tienda",
			links: [
				{
					text: "Catálogo",
					href: "/products",
				},
				{
					text: "Ubicación",
					href: "/#location",
				},
			],
		},
		{
			title: "Servicios",
			links: [
				{ text: "Suplir tienda", href: "/supply" },
				{ text: "Soporte", href: `tel:${siteConfig.contact.phone.primary}` },
			],
		},
		{
			title: "Empresa",
			links: [
				{ text: "Acerca de", href: "/about" },
				{ text: "Contacto", href: "/contact" },
			],
		},
		{
			title: "Ayuda",
			links: [
				{ text: "Preguntas frecuentes", href: "/faq" },
				{ text: "Devoluciones", href: "/returns" },
			],
		},
	],
	policies: [
		{ text: "Política de privacidad", href: "/legal/privacy" },
		{ text: "Términos de servicio", href: "/legal/terms" },
	],
};

export function ContentLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navbar {...navbarConfig} />
			<div className="flex flex-1 max-w-screen overflow-x-hidden">
				<div className="container mx-auto px-4">{children}</div>
			</div>
			<FooterSection {...footerConfig} />
		</>
	);
}
