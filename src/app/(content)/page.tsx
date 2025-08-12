import { Hero } from "@/components/content/landing/hero";
import { ProductsSection } from "@/components/content/landing/products";
import { LocationSection } from "@/components/content/landing/location";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			<Hero />
			<ProductsSection />
			<LocationSection />
			<section className="py-10">
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
			</section>
		</div>
	);
}
