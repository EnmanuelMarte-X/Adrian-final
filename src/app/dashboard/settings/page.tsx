"use client";

import {
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
	SelectItem,
	SelectGroup,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import { ComingSoon } from "@/components/ui/coming-soon";
import { motion } from "motion/react";
import { Palette } from "lucide-react";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

function SettingsPageContent() {
	const { theme, setTheme } = useTheme();

	return (
		<main className="w-full px-10 py-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="space-y-6"
			>
				<div className="space-y-2">
					<p className="text-muted-foreground">
						Personaliza tu experiencia en la aplicación
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Palette className="h-5 w-5" />
							Tema de la aplicación
						</CardTitle>
						<CardDescription>
							Cambia el tema de la aplicación entre claro, oscuro o automático
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							<Select value={theme} onValueChange={setTheme}>
								<SelectTrigger className="w-[200px]">
									<SelectValue placeholder="Selecciona un tema" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="light">Claro</SelectItem>
										<SelectItem value="dark">Oscuro</SelectItem>
										<SelectItem value="system">Sistema</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Más ajustes</CardTitle>
						<CardDescription>
							Configuraciones adicionales estarán disponibles próximamente
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ComingSoon
							title="Próximamente más opciones."
							description="Estamos trabajando en más configuraciones como notificaciones, impuestos, unidades de medida y más."
							className="py-8"
						/>
					</CardContent>
				</Card>
			</motion.div>
		</main>
	);
}

export default function SettingsPage() {
	return (
		<Suspense fallback={
			<main className="w-full px-10 py-6">
				<div className="flex items-center justify-center h-64">
					<Spinner className="size-8 text-primary" />
				</div>
			</main>
		}>
			<SettingsPageContent />
		</Suspense>
	);
}
