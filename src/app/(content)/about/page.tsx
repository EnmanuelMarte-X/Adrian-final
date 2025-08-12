import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, Heart } from "lucide-react";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
	title: "Acerca de Nosotros | Jhenson Supply",
	description:
		"Conoce la historia, misión y valores de Jhenson Supply. Tu socio confiable en suministros de belleza.",
};

export default function AboutPage() {
	const stats = [
		{ label: "Años de experiencia", value: "10+" },
		{ label: "Clientes satisfechos", value: "5,000+" },
		{ label: "Productos disponibles", value: "1,500+" },
		{ label: "Ciudades atendidas", value: "50+" },
	];

	const values = [
		{
			icon: <Target className="w-8 h-8 text-primary" />,
			title: "Calidad",
			description:
				"Nos comprometemos a ofrecer solo productos de la más alta calidad para nuestros clientes.",
		},
		{
			icon: <Users className="w-8 h-8 text-primary" />,
			title: "Servicio al cliente",
			description:
				"Nuestro equipo está dedicado a brindar un servicio excepcional y personalizado.",
		},
		{
			icon: <Award className="w-8 h-8 text-primary" />,
			title: "Innovación",
			description:
				"Constantemente buscamos nuevas formas de mejorar y evolucionar nuestros servicios.",
		},
		{
			icon: <Heart className="w-8 h-8 text-primary" />,
			title: "Confianza",
			description:
				"Construimos relaciones duraderas basadas en la transparencia y confiabilidad.",
		},
	];

	return (
		<div className="min-h-screen py-12">
			<div className="max-w-6xl mx-auto px-4">
				<div className="text-center mb-16">
					<Badge variant="secondary" className="mb-4">
						Acerca de nosotros
					</Badge>
					<h1 className="text-4xl md:text-5xl font-bold mb-6">
						Tu socio confiable en suministros de belleza
					</h1>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Desde 2015, Jhenson Supply ha sido el líder en distribución de
						productos de belleza y cuidado personal, ayudando a miles de
						negocios a crecer y prosperar.
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
					{stats.map((stat, index) => (
						<Card key={index} className="text-center">
							<CardContent className="pt-6">
								<div className="text-3xl font-bold text-primary mb-2">
									{stat.value}
								</div>
								<div className="text-sm text-muted-foreground">
									{stat.label}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
					<div>
						<h2 className="text-3xl font-bold mb-6">Nuestra historia</h2>
						<div className="space-y-4 text-muted-foreground">
							<p>
								Todo comenzó en 2015 cuando Jhenson vio una oportunidad en el
								mercado de suministros de belleza. Con una pequeña inversión y
								mucha determinación, inició lo que hoy es una de las
								distribuidoras más confiables del sector.
							</p>
							<p>
								Desde nuestros humildes comienzos en un pequeño almacén, hemos
								crecido hasta convertirnos en un distribuidor líder que atiende
								a más de 5,000 clientes en todo el país.
							</p>
							<p>
								Nuestro éxito se basa en relaciones sólidas con nuestros
								proveedores y clientes, garantizando siempre la mejor calidad y
								servicio.
							</p>
						</div>
					</div>
					<div className="flex items-center justify-center">
						<div className="text-center">
							<Logo width={1024} height={1024} className="size-80" />
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
					<Card>
						<CardContent className="pt-6">
							<h3 className="text-2xl font-bold mb-4">Nuestra misión</h3>
							<p className="text-muted-foreground">
								Proveer productos de belleza y cuidado personal de alta calidad,
								junto con un servicio excepcional que permita a nuestros
								clientes hacer crecer sus negocios de manera sostenible.
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<h3 className="text-2xl font-bold mb-4">Nuestra visión</h3>
							<p className="text-muted-foreground">
								Ser la distribuidora de productos de belleza más confiable y
								reconocida, estableciendo el estándar de excelencia en servicio
								al cliente y calidad de productos.
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="mb-16">
					<h2 className="text-3xl font-bold text-center mb-12">
						Nuestros valores
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{values.map((value, index) => (
							<Card key={index} className="text-center">
								<CardContent className="pt-6">
									<div className="flex justify-center mb-4">{value.icon}</div>
									<h3 className="text-xl font-semibold mb-3">{value.title}</h3>
									<p className="text-muted-foreground text-sm">
										{value.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
