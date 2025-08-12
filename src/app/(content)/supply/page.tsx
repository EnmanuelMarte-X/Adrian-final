import type { Metadata } from "next";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Store,
	Users,
	Truck,
	Shield,
	TrendingUp,
	Clock,
	MapPin,
	Phone,
	Mail,
	Package,
	DollarSign,
	Zap,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const metadata: Metadata = {
	title: "Suplir Tienda | Jhenson Supply",
	description:
		"Conviértete en nuestro socio comercial. Suministramos productos de belleza al por mayor para tu negocio.",
};

export default function SupplyPage() {
	const benefits = [
		{
			icon: <DollarSign className="w-8 h-8 text-green-500" />,
			title: "Precios Mayoristas",
			description:
				"Accede a precios especiales por volumen y maximiza tus ganancias",
		},
		{
			icon: <Package className="w-8 h-8 text-blue-500" />,
			title: "Amplio Catálogo",
			description:
				"Más de 1,500 productos de belleza y cuidado personal disponibles",
		},
		{
			icon: <Truck className="w-8 h-8 text-orange-500" />,
			title: "Entrega Rápida",
			description:
				"Entregas de 1-3 días hábiles en toda la República Dominicana",
		},
		{
			icon: <Shield className="w-8 h-8 text-purple-500" />,
			title: "Productos Originales",
			description: "100% productos auténticos con garantía del fabricante",
		},
		{
			icon: <Users className="w-8 h-8 text-pink-500" />,
			title: "Soporte Dedicado",
			description: "Equipo de apoyo comercial especializado para tu negocio",
		},
		{
			icon: <TrendingUp className="w-8 h-8 text-indigo-500" />,
			title: "Capacitación",
			description: "Entrenamientos sobre productos y técnicas de venta",
		},
	];

	const requirements = [
		"Registro Nacional de Contribuyentes (RNC) vigente",
		"Licencia comercial o permiso de operación",
		"Local comercial establecido",
		"Capacidad de compra mínima mensual",
		"Referencias comerciales verificables",
	];

	const businessTypes = [
		"Salón de Belleza",
		"Barbería",
		"Spa / Centro de Estética",
		"Farmacia / Botica",
		"Supermercado / Minimarket",
		"Tienda de Cosméticos",
		"Distribuidor",
		"Otro",
	];

	return (
		<div className="min-h-screen py-12">
			<div className="max-w-6xl mx-auto px-4">
				{/* Hero Section */}
				<div className="text-center mb-12">
					<Badge variant="secondary" className="mb-4">
						Programa de Socios
					</Badge>
					<h1 className="text-4xl md:text-5xl font-bold mb-6">
						Suplir tu Tienda
					</h1>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
						Únete a nuestra red de socios comerciales y accede a los mejores
						productos de belleza al por mayor. Hacemos crecer tu negocio juntos.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<Badge variant="outline" className="px-4 py-2">
							<Store className="w-4 h-4 mr-2" />
							5,000+ Socios Activos
						</Badge>
						<Badge variant="outline" className="px-4 py-2">
							<Package className="w-4 h-4 mr-2" />
							1,500+ Productos
						</Badge>
						<Badge variant="outline" className="px-4 py-2">
							<Zap className="w-4 h-4 mr-2" />
							10+ Años de Experiencia
						</Badge>
					</div>
				</div>

				{/* Benefits */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold text-center mb-12">
						¿Por qué elegirnos?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{benefits.map((benefit, index) => (
							<Card key={index} className="text-center">
								<CardContent className="pt-6">
									<div className="flex justify-center mb-4">{benefit.icon}</div>
									<h3 className="text-xl font-semibold mb-3">
										{benefit.title}
									</h3>
									<p className="text-muted-foreground">{benefit.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
					{/* Application Form */}
					<Card>
						<CardHeader>
							<CardTitle>Solicitar Asociación</CardTitle>
							<CardDescription>
								Completa este formulario y nos pondremos en contacto contigo en
								24 horas
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="businessName">Nombre del negocio</Label>
									<Input id="businessName" placeholder="Ej: Salón María" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="ownerName">Nombre del propietario</Label>
									<Input id="ownerName" placeholder="Tu nombre completo" />
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="rnc">RNC</Label>
									<Input id="rnc" placeholder="123456789" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="businessType">Tipo de negocio</Label>
									<Select>
										<SelectTrigger>
											<SelectValue placeholder="Selecciona el tipo" />
										</SelectTrigger>
										<SelectContent>
											{businessTypes.map((type) => (
												<SelectItem
													key={type}
													value={type.toLowerCase().replace(/\s+/g, "-")}
												>
													{type}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" type="email" placeholder="tu@email.com" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="phone">Teléfono</Label>
									<Input
										id="phone"
										type="tel"
										placeholder="+1 (849) 123-4567"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="address">Dirección del negocio</Label>
								<Input
									id="address"
									placeholder="Calle Principal #123, Ciudad"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="monthlyPurchase">
									Compra mensual estimada (USD)
								</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona el rango" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="500-1000">$500 - $1,000</SelectItem>
										<SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
										<SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
										<SelectItem value="5000+">$5,000+</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="experience">
									Experiencia en el sector (años)
								</Label>
								<Select>
									<SelectTrigger>
										<SelectValue placeholder="Años de experiencia" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="nuevo">Nuevo en el negocio</SelectItem>
										<SelectItem value="1-2">1-2 años</SelectItem>
										<SelectItem value="3-5">3-5 años</SelectItem>
										<SelectItem value="5+">Más de 5 años</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="comments">Comentarios adicionales</Label>
								<Textarea
									id="comments"
									placeholder="Cuéntanos más sobre tu negocio, productos de interés, etc..."
									className="min-h-[100px]"
								/>
							</div>

							<Alert>
								<Package className="h-4 w-4" />
								<AlertDescription>
									Una vez enviada tu solicitud, nuestro equipo comercial te
									contactará para una evaluación personalizada y te enviará el
									catálogo de precios.
								</AlertDescription>
							</Alert>

							<Button className="w-full">Enviar Solicitud</Button>
						</CardContent>
					</Card>

					{/* Requirements and Info */}
					<div className="space-y-6">
						{/* Requirements */}
						<Card>
							<CardHeader>
								<CardTitle>Requisitos para Asociarse</CardTitle>
								<CardDescription>
									Documentos y condiciones necesarias para formar parte de
									nuestra red
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ul className="space-y-3">
									{requirements.map((req, index) => (
										<li key={index} className="flex items-start gap-3">
											<div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
												<div className="w-2 h-2 rounded-full bg-primary" />
											</div>
											<span className="text-sm">{req}</span>
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						{/* Process Timeline */}
						<Card>
							<CardHeader>
								<CardTitle>Proceso de Aprobación</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-start gap-3">
									<div className="flex flex-col items-center">
										<div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
											<span className="text-xs font-semibold text-blue-600">
												1
											</span>
										</div>
										<div className="w-px h-8 bg-border" />
									</div>
									<div>
										<h4 className="font-semibold">Solicitud Enviada</h4>
										<p className="text-sm text-muted-foreground">
											Recibes confirmación inmediata
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="flex flex-col items-center">
										<div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
											<span className="text-xs font-semibold text-orange-600">
												2
											</span>
										</div>
										<div className="w-px h-8 bg-border" />
									</div>
									<div>
										<h4 className="font-semibold">Evaluación (24-48h)</h4>
										<p className="text-sm text-muted-foreground">
											Revisamos tu solicitud y documentos
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<div className="flex flex-col items-center">
										<div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
											<span className="text-xs font-semibold text-green-600">
												3
											</span>
										</div>
									</div>
									<div>
										<h4 className="font-semibold">Aprobación y Onboarding</h4>
										<p className="text-sm text-muted-foreground">
											Configuración de cuenta y catálogo
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Contact Info */}
						<Card>
							<CardHeader>
								<CardTitle>Contacto Directo</CardTitle>
								<CardDescription>
									Habla directamente con nuestro equipo comercial
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-3">
									<Phone className="w-5 h-5 text-primary" />
									<div>
										<p className="font-semibold">Teléfono</p>
										<p className="text-sm text-muted-foreground">
											+1 (849) 863-6444
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<Mail className="w-5 h-5 text-primary" />
									<div>
										<p className="font-semibold">Email Comercial</p>
										<p className="text-sm text-muted-foreground">
											ventas@jhensonsupply.com
										</p>
									</div>
								</div>

								<div className="flex items-center gap-3">
									<Clock className="w-5 h-5 text-primary" />
									<div>
										<p className="font-semibold">Horario de Atención</p>
										<p className="text-sm text-muted-foreground">
											Lun-Vie: 8:00 AM - 6:00 PM
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<MapPin className="w-5 h-5 text-primary mt-1" />
									<div>
										<p className="font-semibold">Ubicación</p>
										<p className="text-sm text-muted-foreground">
											Calle Santa Lucía No. 15
											<br />
											Val. del Este, Santo Domingo Este
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* CTA Section */}
				<Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
					<CardContent className="pt-8 text-center">
						<h3 className="text-2xl font-bold mb-4">
							¿Listo para hacer crecer tu negocio?
						</h3>
						<p className="text-muted-foreground mb-6">
							Únete a más de 5,000 socios que confían en Jhenson Supply para sus
							suministros de belleza.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg">Enviar Solicitud Ahora</Button>
							<Button variant="outline" size="lg">
								Descargar Catálogo
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
