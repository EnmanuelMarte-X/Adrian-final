import { siteConfig } from "@/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Términos de Servicio | Jhenson Supply",
	description: "Conoce los términos y condiciones de uso de Jhenson Supply.",
};

export default function TermsOfServicePage() {
	return (
		<div className="min-h-screen py-12">
			<div className="max-w-4xl mx-auto px-4">
				<div className="prose prose-slate dark:prose-invert max-w-none">
					<h1 className="text-4xl font-bold mb-8">Términos de Servicio</h1>
					<p className="text-lg text-muted-foreground mb-8">
						Última actualización: 10 de agosto de 2025
					</p>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							1. Aceptación de los términos
						</h2>
						<p className="mb-4">
							Al acceder y utilizar los servicios de Jhenson Supply, aceptas
							estar sujeto a estos términos de servicio y todas las leyes y
							regulaciones aplicables.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							2. Descripción del servicio
						</h2>
						<p className="mb-4">
							Jhenson Supply es una plataforma de suministros que ofrece:
						</p>
						<ul className="list-disc pl-6 mb-4">
							<li>Venta de productos de belleza y cuidado personal</li>
							<li>Servicios de suministro para tiendas y negocios</li>
							<li>Plataforma de gestión de pedidos</li>
							<li>Soporte técnico y comercial</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							3. Registro de cuenta
						</h2>
						<p className="mb-4">
							Para utilizar ciertos servicios, debes crear una cuenta
							proporcionando información precisa y actualizada. Eres responsable
							de mantener la confidencialidad de tu cuenta.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">4. Precios y pagos</h2>
						<ul className="list-disc pl-6 mb-4">
							<li>
								Todos los precios están sujetos a cambios sin previo aviso
							</li>
							<li>Los pagos deben realizarse en el momento de la compra</li>
							<li>Aceptamos múltiples métodos de pago</li>
							<li>Los precios incluyen impuestos aplicables</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							5. Envíos y entregas
						</h2>
						<p className="mb-4">
							Los tiempos de entrega son estimados y pueden variar según la
							ubicación y disponibilidad del producto. No somos responsables por
							retrasos causados por terceros.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							6. Devoluciones y reembolsos
						</h2>
						<ul className="list-disc pl-6 mb-4">
							<li>Aceptamos devoluciones dentro de 30 días de la compra</li>
							<li>Los productos deben estar en condición original</li>
							<li>
								Los costos de envío de devolución corren por cuenta del cliente
							</li>
							<li>Los reembolsos se procesarán en 5-10 días hábiles</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							7. Limitación de responsabilidad
						</h2>
						<p className="mb-4">
							Jhenson Supply no será responsable por daños indirectos,
							incidentales o consecuenciales que resulten del uso de nuestros
							servicios.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">8. Modificaciones</h2>
						<p className="mb-4">
							Nos reservamos el derecho de modificar estos términos en cualquier
							momento. Los cambios entrarán en vigor inmediatamente después de
							su publicación.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">9. Contacto</h2>
						<p className="mb-4">
							Para preguntas sobre estos términos, contacta:
						</p>
						<ul className="list-none pl-0 mb-4">
							<li>
								<strong>Email:</strong> legal@jhensonsupply.com
							</li>
							<li>
								<strong>Teléfono:</strong> {siteConfig.contact.phone.formatted}
							</li>
						</ul>
					</section>
				</div>
			</div>
		</div>
	);
}
