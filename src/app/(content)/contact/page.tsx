import type { Metadata } from "next";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { EmailForm } from "@/components/ui/email-form";

export const metadata: Metadata = {
	title: "Contacto | Jhenson Supply",
	description:
		"Ponte en contacto con nosotros. Estamos aquí para ayudarte con cualquier pregunta o necesidad.",
};

export default function ContactPage() {
	return (
		<div className="min-h-screen py-12">
			<div className="max-w-6xl mx-auto px-4">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold mb-4">Contáctanos</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Estamos aquí para ayudarte. Ponte en contacto con nosotros y te
						responderemos lo antes posible.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<Card>
						<CardHeader>
							<CardTitle>Envíanos un mensaje</CardTitle>
							<CardDescription>
								Completa el formulario y nos pondremos en contacto contigo
								pronto.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<EmailForm type="contact" submitText="Enviar mensaje">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="firstName">Nombre</Label>
										<Input
											id="firstName"
											name="firstName"
											placeholder="Tu nombre"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="lastName">Apellido</Label>
										<Input
											id="lastName"
											name="lastName"
											placeholder="Tu apellido"
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input
										id="email"
										name="email"
										type="email"
										placeholder="tu@email.com"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone">Teléfono (opcional)</Label>
									<Input
										id="phone"
										name="phone"
										type="tel"
										placeholder="+1 (555) 123-4567"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="subject">Asunto</Label>
									<Input
										id="subject"
										name="subject"
										placeholder="¿En qué podemos ayudarte?"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="message">Mensaje</Label>
									<Textarea
										id="message"
										name="message"
										placeholder="Cuéntanos más detalles sobre tu consulta..."
										className="min-h-[150px]"
										required
									/>
								</div>
							</EmailForm>
						</CardContent>
					</Card>

					<div className="space-y-8">
						<Card>
							<CardHeader>
								<CardTitle>Información de contacto</CardTitle>
								<CardDescription>
									Otras formas de ponerte en contacto con nosotros.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="flex items-start gap-3">
									<Mail className="w-5 h-5 text-primary mt-1" />
									<div>
										<h3 className="font-semibold">Email</h3>
										<p className="text-muted-foreground">
											info@jhensonsupply.com
										</p>
										<p className="text-muted-foreground">
											soporte@jhensonsupply.com
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<Phone className="w-5 h-5 text-primary mt-1" />
									<div>
										<h3 className="font-semibold">Teléfono</h3>
										<p className="text-muted-foreground">+1 (555) 123-4567</p>
										<p className="text-muted-foreground">+1 (555) 987-6543</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<MapPin className="w-5 h-5 text-primary mt-1" />
									<div>
										<h3 className="font-semibold">Dirección</h3>
										<p className="text-muted-foreground">
											123 Commerce Street
											<br />
											Ciudad, Estado 12345
											<br />
											País
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3">
									<Clock className="w-5 h-5 text-primary mt-1" />
									<div>
										<h3 className="font-semibold">Horarios de atención</h3>
										<p className="text-muted-foreground">
											Lunes a Viernes: 9:00 AM - 6:00 PM
											<br />
											Sábados: 10:00 AM - 4:00 PM
											<br />
											Domingos: Cerrado
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>¿Necesitas ayuda inmediata?</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-muted-foreground">
									Si tienes una emergencia o necesitas ayuda urgente, no dudes
									en llamarnos directamente.
								</p>
							</CardContent>
							<CardFooter className="grid sm:grid-cols-2 grid-cols-1 gap-2">
								<Button variant="outline" className="w-full">
									<Phone className="w-4 h-4 mr-2" />
									Llamar ahora
								</Button>
								<Button variant="outline" className="w-full">
									<svg
										className="w-4 h-4 mr-2"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.108" />
									</svg>
									Enviar mensaje
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
