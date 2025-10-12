"use client";

import { useEffect } from "react";
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
	AlertCircle,
	Package,
	RefreshCw,
	Clock,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ReturnsPage() {
	// Set document title for Client Component
	useEffect(() => {
		document.title = "Devoluciones | Jhenson Supply";
	}, []);

	const returnSteps = [
		{
			step: 1,
			title: "Verificar elegibilidad",
			description:
				"El producto debe estar en condición original dentro de 30 días de la compra",
			icon: <CheckCircle className="w-6 h-6 text-green-500" />,
		},
		{
			step: 2,
			title: "Solicitar devolución",
			description: "Completa el formulario con los detalles de tu pedido",
			icon: <Package className="w-6 h-6 text-blue-500" />,
		},
		{
			step: 3,
			title: "Empaque y envío",
			description:
				"Empaca el producto de forma segura y envíalo a nuestra dirección",
			icon: <RefreshCw className="w-6 h-6 text-orange-500" />,
		},
		{
			step: 4,
			title: "Procesamiento",
			description:
				"Revisamos el producto y procesamos tu reembolso en 5-10 días",
			icon: <Clock className="w-6 h-6 text-purple-500" />,
		},
	];

	const eligibilityCriteria = [
		"Producto en condición original y sin usar",
		"Embalaje original incluido",
		"Dentro de 30 días calendario de la compra",
		"Recibo o comprobante de compra",
		"Productos no personalizados o de higiene personal",
	];

	const nonReturnableItems = [
		"Productos de higiene personal abiertos",
		"Artículos personalizados o modificados",
		"Productos en liquidación o oferta final",
		"Cosméticos abiertos o usados",
		"Productos dañados por uso indebido",
	];

	return (
		<div className="min-h-screen py-12">
			<div className="max-w-6xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-12">
					<Badge variant="secondary" className="mb-4">
						Devoluciones
					</Badge>
					<h1 className="text-4xl font-bold mb-4">Centro de Devoluciones</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Proceso fácil y rápido para devolver productos. Tu satisfacción es
						nuestra prioridad.
					</p>
				</div>

				{/* Process Steps */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-center mb-8">
						Proceso de Devolución
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						{returnSteps.map((step) => (
							<Card key={step.step} className="text-center">
								<CardContent className="pt-6">
									<div className="flex justify-center mb-4">{step.icon}</div>
									<div className="text-2xl font-bold text-primary mb-2">
										Paso {step.step}
									</div>
									<h3 className="font-semibold mb-2">{step.title}</h3>
									<p className="text-sm text-muted-foreground">
										{step.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
					{/* Return Form */}
					<Card>
						<CardHeader>
							<CardTitle>Solicitar Devolución</CardTitle>
							<CardDescription>
								Completa este formulario para iniciar el proceso de devolución
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="orderNumber">Número de pedido</Label>
									<Input id="orderNumber" placeholder="Ej: JS-2025-001" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="purchaseDate">Fecha de compra</Label>
									<Input id="purchaseDate" type="date" />
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="customerName">Nombre completo</Label>
									<Input id="customerName" placeholder="Tu nombre completo" />
								</div>
								<div className="space-y-2">
									<Label htmlFor="customerEmail">Email</Label>
									<Input
										id="customerEmail"
										type="email"
										placeholder="tu@email.com"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="productName">Producto a devolver</Label>
								<Input id="productName" placeholder="Nombre del producto" />
							</div>

							<div className="space-y-2">
								<Label htmlFor="returnReason">Motivo de devolución</Label>
								<Textarea
									id="returnReason"
									placeholder="Explica por qué deseas devolver este producto..."
									className="min-h-[100px]"
								/>
							</div>

							<Alert>
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>
									Una vez enviado, recibirás un email con las instrucciones para
									el envío y la dirección de devolución.
								</AlertDescription>
							</Alert>

							<Button className="w-full">Enviar Solicitud de Devolución</Button>
						</CardContent>
					</Card>

					{/* Policies and Info */}
					<div className="space-y-6">
						{/* Eligibility */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<CheckCircle className="w-5 h-5 text-green-500" />
									Productos Elegibles
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2">
									{eligibilityCriteria.map((criteria, index) => (
										<li key={index} className="flex items-start gap-2 text-sm">
											<CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
											{criteria}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						{/* Non-returnable */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<XCircle className="w-5 h-5 text-red-500" />
									Productos No Retornables
								</CardTitle>
							</CardHeader>
							<CardContent>
								<ul className="space-y-2">
									{nonReturnableItems.map((item, index) => (
										<li key={index} className="flex items-start gap-2 text-sm">
											<XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
											{item}
										</li>
									))}
								</ul>
							</CardContent>
						</Card>

						{/* Contact */}
						<Card>
							<CardHeader>
								<CardTitle>¿Necesitas ayuda?</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm text-muted-foreground">
									Si tienes preguntas sobre el proceso de devolución, nuestro
									equipo está aquí para ayudarte.
								</p>
								<div className="flex flex-col gap-2">
									<Button 
										variant="outline" 
										className="justify-start"
										onClick={() => {
											const subject = encodeURIComponent('Consulta sobre devolución - Jhenson Supply');
											const body = encodeURIComponent('Hola,\n\nTengo una pregunta sobre el proceso de devolución.\n\nDetalles de mi consulta:\n\n\n\nGracias por su tiempo.');
											window.open(`mailto:info@jhensonsupply.com?subject=${subject}&body=${body}`, '_blank');
										}}
									>
										📧 Contactar Soporte
									</Button>
									<Button 
										variant="outline" 
										className="justify-start"
										onClick={() => {
											window.open('tel:+18498636444', '_self');
										}}
									>
										📞 Llamar Ahora
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* FAQ Section */}
				<Card>
					<CardHeader>
						<CardTitle>Preguntas Frecuentes sobre Devoluciones</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<h4 className="font-semibold mb-2">
									¿Cuánto tiempo tengo para devolver un producto?
								</h4>
								<p className="text-sm text-muted-foreground">
									Tienes 30 días calendario desde la fecha de compra para
									iniciar una devolución.
								</p>
							</div>
							<div>
								<h4 className="font-semibold mb-2">
									¿Quién paga los costos de envío?
								</h4>
								<p className="text-sm text-muted-foreground">
									Los costos de envío para devoluciones corren por cuenta del
									cliente, excepto si el producto llegó defectuoso.
								</p>
							</div>
							<div>
								<h4 className="font-semibold mb-2">
									¿Cuándo recibiré mi reembolso?
								</h4>
								<p className="text-sm text-muted-foreground">
									Los reembolsos se procesan en 5-10 días hábiles después de
									recibir y verificar el producto devuelto.
								</p>
							</div>
							<div>
								<h4 className="font-semibold mb-2">
									¿Puedo cambiar un producto por otro?
								</h4>
								<p className="text-sm text-muted-foreground">
									Sí, ofrecemos cambios por productos de igual o mayor valor.
									Contacta nuestro equipo para coordinar el cambio.
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
