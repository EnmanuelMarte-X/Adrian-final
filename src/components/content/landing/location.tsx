"use client";

import { MapPinIcon, PhoneIcon, ClockIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const LocationSection = () => (
	<section id="location" className="py-16 px-4">
		<div className="max-w-7xl mx-auto">
			<div className="text-center mb-12">
				<h2 className="text-primary text-4xl font-bold mb-4 flex items-center justify-center gap-3">
					<MapPinIcon className="size-8" />
					Nuestra Ubicación
				</h2>
				<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
					Visítanos en nuestra tienda física o contáctanos para más información
				</p>
			</div>

			<div className="grid lg:grid-cols-2 gap-12">
				<div className="h-full">
					<Card className="h-full flex flex-col">
						<CardContent className="px-8 h-full flex flex-col justify-between">
							<div className="space-y-6">
								<div className="flex items-start gap-4">
									<div className="bg-primary/10 p-3 rounded-full">
										<MapPinIcon className="size-6 text-primary" />
									</div>
									<div>
										<h3 className="text-lg font-semibold mb-2">
											Dirección
										</h3>
										<p className="text-muted-foreground leading-relaxed">
											C. 12 113, Santo Domingo Este 11509
										</p>
										<p className="text-muted-foreground leading-relaxed">
											C. Sta. Lucía, Santo Domingo Este 11605
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="bg-primary/10 p-3 rounded-full">
										<PhoneIcon className="size-6 text-primary" />
									</div>
									<div>
										<h3 className="text-lg font-semibold text-foreground mb-2">
											Contacto
										</h3>
										<p className="text-muted-foreground">
											+1 (849) 863-6444
											<br />
											info@jhesonsupply.com
										</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="bg-primary/10 p-3 rounded-full">
										<ClockIcon className="size-6 text-primary" />
									</div>
									<div>
										<h3 className="text-lg font-semibold mb-2">
											Horarios de Atención
										</h3>
										<div className="text-muted-foreground space-y-1">
											<p>Lunes - Viernes: 8:00 AM - 6:00 PM</p>
											<p>Sábados: 8:00 AM - 4:00 PM</p>
											<p>Domingos: Cerrado</p>
										</div>
									</div>
								</div>
							</div>

							<a
								href="https://maps.app.goo.gl/DyUqFNWzx3Mxk6ERA"
								target="_blank"
								rel="noopener noreferrer"
								className="w-full bg-primary mt-6 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center justify-center gap-2"
							>
								<MapPinIcon className="size-4" />
								Ver en Google Maps
							</a>
						</CardContent>
					</Card>
				</div>

				{/* Mapa */}
				<div className="h-full">
					<div className="aspect-[4/3] w-full h-full overflow-hidden rounded-lg shadow-lg">
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60632.347471535935!2d-69.9730215!3d18.4802489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89f4aecbcc7d%3A0x93c6c79a8e9e7c3e!2sSanto%20Domingo%2C%20Dominican%20Republic!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
							width="100%"
							height="100%"
							style={{ border: 0 }}
							allowFullScreen={true}
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							title="Ubicación de Jheson Supply en Santo Domingo"
							className="w-full h-full"
						/>
					</div>
				</div>
			</div>
		</div>
	</section>
);
