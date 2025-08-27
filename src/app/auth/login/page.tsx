"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { use } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Spinner } from "@/components/ui/spinner";
import { Logo } from "@/components/logo";

const loginSchema = z.object({
	email: z.string().email("Correo electrónico inválido"),
	password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

const errorMessages: Record<string, string> = {
	CredentialsSignin: "Correo o contraseña incorrectos.",

	OAuthSignin: "No se pudo iniciar sesión con el proveedor.",
	OAuthCallback: "Error al procesar la respuesta del proveedor.",
	OAuthCreateAccount: "No se pudo crear la cuenta desde el proveedor.",
	OAuthAccountNotLinked: "La cuenta del proveedor no está vinculada.",

	EmailCreateAccount: "No se pudo crear la cuenta de correo electrónico.",
	EmailSignInError: "Error al enviar el correo de inicio de sesión.",
	Verification: "El vínculo de verificación es inválido o ha expirado.",

	MissingCSRF: "Error de seguridad (CSRF), inténtalo de nuevo.",
	AccessDenied: "Acceso denegado.",

	Configuration: "Error de configuración del servidor.",
	AdapterError: "Error en el adaptador de la base de datos.",
	CallbackRouteError: "Ha ocurrido un error durante el inicio de sesión.",
	SessionTokenError: "Error al generar la sesión.",
	UnsupportedStrategy:
		"Configuración no soportada: ninguna estrategia definida.",
	MissingAuthorize:
		"Falta la función authorize en el proveedor de credenciales.",
	MissingAdapter: "Falta el adaptador para guardar usuarios o sesiones.",
	MissingAdapterMethods: "Faltan métodos en el adaptador.",
	MissingSecret: "Falta la configuración del secreto (NEXTAUTH_SECRET).",
	MissingWebAuthnAutocomplete:
		"WebAuthn requiere campo de autocompletar adecuado.",
	UntrustedHost: "Host no confiable, revisa la configuración de trustHost.",

	default:
		"Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.",
};

export default function Login({
	params,
}: { params: Promise<{ callbackUrl?: string }> }) {
	const { callbackUrl = "/dashboard" } = use(params);
	const { push } = useRouter();

	const form = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const { isSubmitting } = form.formState;

	const onSubmit = async (data: { email: string; password: string }) => {
		const res = await signIn("credentials", {
			email: data.email,
			password: data.password,
			redirect: false,
		});

		if (res?.ok) {
			push(callbackUrl);
		} else {
			console.log("Login error:", res);
			const errorKey = res?.error || "default";
			const message = errorMessages[errorKey] || errorMessages.default;
			toast.error(message);
		}
	};

	return (
		<motion.div
			className="flex items-center justify-center h-screen w-full"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="w-full px-6"
			>
				<Form {...form}>
					<motion.form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 sm:w-96 w-full"
						initial={{ scale: 0.95 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.4, delay: 0.2 }}
					>
						<motion.div
							className="flex flex-col items-center justify-center text-center mb-6"
							initial={{ y: -10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.3 }}
						>
							<Logo width={256} height={256} className="size-16 mb-4" />

							<span className="text-muted-foreground font-bold">
								Jhenson Supply
							</span>
							<h1 className="text-3xl font-bold">Iniciar sesión</h1>
						</motion.div>

						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel>Correo electrónico</FormLabel>
										<FormControl>
											<motion.div
												whileFocus={{ scale: 1.02 }}
												transition={{ duration: 0.2 }}
											>
												<Input placeholder="Correo electrónico" {...field} />
											</motion.div>
										</FormControl>
										<AnimatePresence mode="wait">
											{fieldState.error && (
												<motion.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													transition={{ duration: 0.2 }}
												>
													<FormMessage />
												</motion.div>
											)}
										</AnimatePresence>
									</FormItem>
								)}
							/>
						</motion.div>

						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.5 }}
						>
							<FormField
								control={form.control}
								name="password"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel>Contraseña</FormLabel>
										<FormControl>
											<motion.div
												whileFocus={{ scale: 1.02 }}
												transition={{ duration: 0.2 }}
											>
												<Input
													type="password"
													placeholder="Contraseña"
													{...field}
												/>
											</motion.div>
										</FormControl>
										<AnimatePresence mode="wait">
											{fieldState.error && (
												<motion.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													transition={{ duration: 0.2 }}
												>
													<FormMessage />
												</motion.div>
											)}
										</AnimatePresence>
									</FormItem>
								)}
							/>
						</motion.div>

						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.6 }}
						>
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								transition={{ duration: 0.2 }}
							>
								<Button
									type="submit"
									className="inline-flex w-full"
									disabled={isSubmitting}
								>
									{isSubmitting && (
										<Spinner className="mr-2 size-4 animate-spin" />
									)}{" "}
									Iniciar sesión
								</Button>
							</motion.div>
						</motion.div>
					</motion.form>
				</Form>
			</motion.div>
		</motion.div>
	);
}
