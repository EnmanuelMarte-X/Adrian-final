import { siteConfig } from "@/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Política de Privacidad | Jhenson Supply",
	description:
		"Conoce cómo protegemos y manejamos tu información personal en Jhenson Supply.",
};

export default function PrivacyPolicyPage() {
	return (
		<div className="min-h-screen py-12">
			<div className="max-w-4xl mx-auto px-4">
				<div className="prose prose-slate dark:prose-invert max-w-none">
					<h1 className="text-4xl font-bold mb-8">Política de Privacidad</h1>
					<p className="text-lg text-muted-foreground mb-8">
						Última actualización: 10 de agosto de 2025
					</p>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							1. Información que recopilamos
						</h2>
						<p className="mb-4">
							En Jhenson Supply recopilamos información que nos proporcionas
							directamente cuando:
						</p>
						<ul className="list-disc pl-6 mb-4">
							<li>Te registras en nuestra plataforma</li>
							<li>Realizas una compra o solicitas nuestros servicios</li>
							<li>Te suscribes a nuestro boletín</li>
							<li>
								Nos contactas a través de nuestros canales de comunicación
							</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							2. Cómo utilizamos tu información
						</h2>
						<p className="mb-4">Utilizamos la información recopilada para:</p>
						<ul className="list-disc pl-6 mb-4">
							<li>Procesar y gestionar tus pedidos</li>
							<li>Mejorar nuestros productos y servicios</li>
							<li>Enviarte actualizaciones sobre tus pedidos</li>
							<li>
								Comunicarte ofertas especiales y novedades (solo si has dado tu
								consentimiento)
							</li>
							<li>Cumplir con obligaciones legales</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							3. Compartir información
						</h2>
						<p className="mb-4">
							No vendemos, intercambiamos ni transferimos tu información
							personal a terceros sin tu consentimiento, excepto en los
							siguientes casos:
						</p>
						<ul className="list-disc pl-6 mb-4">
							<li>
								Proveedores de servicios que nos ayudan a operar nuestro negocio
							</li>
							<li>Cuando sea requerido por ley</li>
							<li>Para proteger nuestros derechos y seguridad</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">
							4. Seguridad de los datos
						</h2>
						<p className="mb-4">
							Implementamos medidas de seguridad apropiadas para proteger tu
							información personal contra acceso no autorizado, alteración,
							divulgación o destrucción.
						</p>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">5. Tus derechos</h2>
						<p className="mb-4">Tienes derecho a:</p>
						<ul className="list-disc pl-6 mb-4">
							<li>Acceder a tu información personal</li>
							<li>Rectificar datos incorrectos</li>
							<li>Solicitar la eliminación de tu información</li>
							<li>Retirar tu consentimiento en cualquier momento</li>
						</ul>
					</section>

					<section className="mb-8">
						<h2 className="text-2xl font-semibold mb-4">6. Contacto</h2>
						<p className="mb-4">
							Si tienes preguntas sobre esta política de privacidad, puedes
							contactarnos en:
						</p>
						<ul className="list-none pl-0 mb-4">
							<li>
								<strong>Email:</strong> privacy@jhensonsupply.com
							</li>
							<li>
								<strong>Teléfono:</strong> {siteConfig.contact.phone.formatted}
							</li>
							<li>
								<strong>Dirección:</strong> 123 Commerce St, Ciudad, País
							</li>
						</ul>
					</section>
				</div>
			</div>
		</div>
	);
}
