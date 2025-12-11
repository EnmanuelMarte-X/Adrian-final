"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	ArrowRightIcon,
	ShieldIcon,
	SparklesIcon,
	StarIcon,
	TruckIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
	return (
		<motion.section
			className="relative overflow-hidden pb-20 pt-10"
			initial={{ opacity: 0, y: -30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
		>
			<div className="container mx-auto max-w-7xl px-4">
				<div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
					<motion.div
						className="space-y-8"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.1 }}
					>
						<motion.div
							className="space-y-4"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.2 }}
						>
							<motion.div
								style={{ display: "inline-block" }}
								initial={{ opacity: 0, y: 20, scale: 0.8 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								transition={{ duration: 0.4, delay: 0.3 }}
							>
								<Badge
									variant="secondary"
									className="bg-primary/10 text-primary"
								>
									<SparklesIcon className="mr-2 h-4 w-4" />
										Productos de Belleza Para tu Cabello
								</Badge>
							</motion.div>
							<motion.h1
								className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 0.4 }}
							>
								Donde Tu <span className="text-brand">Belleza</span>
								<br />
								Es Real
							</motion.h1>
							<motion.p
								className="text-xl text-muted-foreground"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 0.5 }}
							>
								Descubre nuestra amplia gama de productos de belleza <br/>        
								para el cabello, incluyendo shampoos, tratamientos,
								acondicionadores, mascarillas y más. Calidad premium,
								precios competitivos y envío rápido.
							</motion.p>
						</motion.div>

						<div className="flex flex-col gap-4 sm:flex-row">
							<Button
								asChild
								size="lg"
								className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform"
								style={{ transition: "transform 0.2s" }}
							>
								<Link href="/products">
									Ver productos
									<ArrowRightIcon className="ml-2 h-5 w-5" />
								</Link>
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="transition-transform"
								style={{ transition: "transform 0.2s" }}
							>
								<Link href="/supply">Suplir mi tienda</Link>
							</Button>
						</div>
						<motion.div
							className="grid grid-cols-3 gap-6 pt-8"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.6, ease: "easeInOut" }}
						>
							<motion.div
								className="text-center"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 0.7, ease: "easeInOut" }}
							>
								<ShieldIcon className="mx-auto h-8 w-8 text-primary" />
								<p className="mt-2 text-sm font-medium">Suplidor Confiable</p>
							</motion.div>
							<motion.div
								className="text-center"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 0.8, ease: "easeInOut" }}
							>
								<TruckIcon className="mx-auto h-8 w-8 text-success" />
								<p className="mt-2 text-sm font-medium">Productos Premium</p>
							</motion.div>
							<motion.div
								className="text-center"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 0.9, ease: "easeInOut" }}
							>
								<StarIcon className="mx-auto h-8 w-8 text-warning" />
								<p className="mt-2 text-sm font-medium">+8k Clientes</p>
							</motion.div>
						</motion.div>
					</motion.div>

					<motion.div
						className="relative"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
					>
						<motion.div
							className="relative h-96 w-full overflow-hidden rounded-2xl bg-secondary shadow-2xl lg:h-[500px]"
							initial={{ scale: 0.95, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
						>
							<Image
								src="/productos-shampoo-belleza.jpg"
								alt="Productos de Belleza Para tu Cabello"
								fill
								className="object-cover text-center text-muted-foreground"
								priority
							/>
						</motion.div>
						<motion.div
							className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary/20 backdrop-blur-sm"
							initial={{ opacity: 0, scale: 0.8, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.5 }}
						/>
						<motion.div
							className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-brand/20 backdrop-blur-sm"
							initial={{ opacity: 0, scale: 0.8, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.6 }}
						/>
					</motion.div>
				</div>
			</div>
		</motion.section>
	);
}
