import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthErrorPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center text-red-600">
						Error de Autenticación
					</CardTitle>
					<CardDescription className="text-center">
						Ha ocurrido un error durante el proceso de autenticación
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-sm text-gray-600 text-center">
						Por favor, verifica tus credenciales e intenta de nuevo.
					</p>

					<div className="space-y-2">
						<Button asChild className="w-full">
							<Link href="/auth/login">Volver al Login</Link>
						</Button>

						<Button asChild variant="outline" className="w-full">
							<Link href="/">Ir al Inicio</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
