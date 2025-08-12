import type { Metadata } from "next";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
	title: "Preguntas Frecuentes | Jhenson Supply",
	description:
		"Encuentra respuestas a las preguntas más comunes sobre Jhenson Supply, nuestros productos y servicios.",
};

export default function FAQPage() {
	const faqCategories = [
		{
			title: "Pedidos y compras",
			questions: [
				{
					question: "¿Cómo puedo realizar un pedido?",
					answer:
						"Puedes realizar pedidos a través de nuestra plataforma web, por teléfono o enviando un email. Para pedidos en línea, simplemente navega por nuestro catálogo, agrega productos al carrito y sigue el proceso de checkout.",
				},
				{
					question: "¿Cuál es el monto mínimo de pedido?",
					answer:
						"El monto mínimo de pedido es de $50 USD para pedidos individuales. Para mayoristas y distribuidores, ofrecemos condiciones especiales con montos mínimos diferentes.",
				},
				{
					question: "¿Puedo cancelar o modificar mi pedido?",
					answer:
						"Sí, puedes cancelar o modificar tu pedido dentro de las primeras 2 horas después de realizarlo. Después de este tiempo, el pedido entra en proceso y no puede ser modificado.",
				},
				{
					question: "¿Aceptan pagos con tarjeta de crédito?",
					answer:
						"Sí, aceptamos todas las principales tarjetas de crédito y débito (Visa, MasterCard, American Express), transferencias bancarias y PayPal.",
				},
			],
		},
		{
			title: "Envíos y entregas",
			questions: [
				{
					question: "¿Cuánto tiempo tarda la entrega?",
					answer:
						"Los tiempos de entrega varían según tu ubicación: 1-3 días hábiles para ciudades principales, 3-5 días hábiles para otras ciudades, y 5-7 días hábiles para zonas rurales.",
				},
				{
					question: "¿Cobran por el envío?",
					answer:
						"Ofrecemos envío gratuito para pedidos superiores a $100 USD. Para pedidos menores, el costo de envío se calcula según el peso y destino del paquete.",
				},
				{
					question: "¿Puedo rastrear mi pedido?",
					answer:
						"Sí, una vez que tu pedido sea enviado, recibirás un número de seguimiento por email para que puedas rastrear tu paquete en tiempo real.",
				},
				{
					question: "¿Hacen entregas los fines de semana?",
					answer:
						"Realizamos entregas de lunes a viernes. Los pedidos realizados los viernes se procesan el siguiente lunes hábil.",
				},
			],
		},
		{
			title: "Productos y calidad",
			questions: [
				{
					question: "¿Los productos son originales?",
					answer:
						"Sí, todos nuestros productos son 100% originales. Trabajamos directamente con fabricantes autorizados y distribuidores oficiales para garantizar la autenticidad.",
				},
				{
					question: "¿Tienen garantía los productos?",
					answer:
						"Todos nuestros productos incluyen garantía del fabricante. En caso de productos defectuosos, ofrecemos cambio o reembolso completo dentro de los primeros 30 días.",
				},
				{
					question: "¿Puedo solicitar muestras de productos?",
					answer:
						"Sí, para clientes mayoristas ofrecemos muestras gratuitas de productos seleccionados. Contacta a nuestro equipo de ventas para solicitar muestras.",
				},
				{
					question: "¿Actualizan regularmente su inventario?",
					answer:
						"Sí, actualizamos nuestro inventario semanalmente con nuevos productos y las últimas tendencias del mercado de belleza.",
				},
			],
		},
		{
			title: "Cuenta y servicios",
			questions: [
				{
					question: "¿Necesito una cuenta para comprar?",
					answer:
						"No es obligatorio, pero recomendamos crear una cuenta para acceder a precios especiales, historial de pedidos y procesos de compra más rápidos.",
				},
				{
					question: "¿Ofrecen descuentos por volumen?",
					answer:
						"Sí, ofrecemos descuentos progresivos según el volumen de compra. Los mayoristas y distribuidores pueden acceder a precios especiales contactando nuestro equipo comercial.",
				},
				{
					question: "¿Tienen programa de fidelidad?",
					answer:
						"Sí, nuestro programa de puntos te permite acumular recompensas con cada compra. Por cada $1 USD gastado, obtienes 1 punto que puedes canjear por descuentos.",
				},
				{
					question: "¿Ofrecen capacitación sobre productos?",
					answer:
						"Sí, ofrecemos sesiones de capacitación gratuitas para nuestros clientes mayoristas sobre uso, aplicación y venta de productos.",
				},
			],
		},
	];

	return (
		<div className="min-h-screen py-12">
			<div className="max-w-4xl mx-auto px-4">
				{/* Header */}
				<div className="text-center mb-12">
					<Badge variant="secondary" className="mb-4">
						FAQ
					</Badge>
					<h1 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h1>
					<p className="text-lg text-muted-foreground">
						Encuentra respuestas rápidas a las preguntas más comunes sobre
						nuestros productos y servicios.
					</p>
				</div>

				<div className="space-y-8">
					{faqCategories.map((category, categoryIndex) => (
						<Card key={categoryIndex}>
							<CardHeader>
								<CardTitle className="text-xl">{category.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<Accordion type="single" collapsible className="w-full">
									{category.questions.map((faq, faqIndex) => (
										<AccordionItem
											key={`${categoryIndex}-${
												faqIndex
											}`}
											value={`item-${categoryIndex}-${faqIndex}`}
										>
											<AccordionTrigger className="text-left">
												{faq.question}
											</AccordionTrigger>
											<AccordionContent className="text-muted-foreground">
												{faq.answer}
											</AccordionContent>
										</AccordionItem>
									))}
								</Accordion>
							</CardContent>
						</Card>
					))}
				</div>

				<Card className="mt-12">
					<CardHeader className="text-center">
						<CardTitle>¿No encuentras lo que buscas?</CardTitle>
						<CardDescription>
							Nuestro equipo de soporte está aquí para ayudarte con cualquier
							pregunta adicional.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Button
								variant="outline"
								className="flex items-center justify-center gap-2"
							>
								<MessageCircle className="w-4 h-4" />
								Chat en vivo
							</Button>
							<Button
								variant="outline"
								className="flex items-center justify-center gap-2"
							>
								<Mail className="w-4 h-4" />
								Enviar email
							</Button>
							<Button
								variant="outline"
								className="flex items-center justify-center gap-2"
							>
								<Phone className="w-4 h-4" />
								Llamar ahora
							</Button>
						</div>
					</CardContent>
				</Card>

				<div className="mt-12 p-6 bg-muted rounded-lg">
					<h3 className="text-xl font-semibold mb-4">💡 Consejos rápidos</h3>
					<ul className="space-y-2 text-muted-foreground">
						<li>
							• Para pedidos urgentes, llama directamente a nuestro equipo de
							ventas
						</li>
						<li>
							• Revisa tu email de confirmación para detalles importantes del
							pedido
						</li>
						<li>• Guarda tu número de pedido para futuras consultas</li>
						<li>
							• Únete a nuestro programa de fidelidad para obtener descuentos
							exclusivos
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
