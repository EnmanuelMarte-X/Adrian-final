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
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { Logo } from "@/components/logo";
import { useState } from "react";
import Link from "next/link";

const registerSchema = z
	.object({
		username: z
			.string()
			.min(3, "El nombre de usuario debe tener al menos 3 caracteres")
			.max(30, "El nombre de usuario no puede tener más de 30 caracteres")
			.regex(
				/^[a-zA-Z0-9_]+$/,
				"Solo se permiten letras, números y guión bajo",
			),
		email: z.string().email("Correo electrónico inválido"),
		password: z
			.string()
			.min(8, "La contraseña debe tener al menos 8 caracteres")
			.regex(/[A-Z]/, "Debe contener al menos una mayúscula")
			.regex(/[a-z]/, "Debe contener al menos una minúscula")
			.regex(/[0-9]/, "Debe contener al menos un número"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
	const { push } = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		mode: "onChange", // Validación en tiempo real
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const { isSubmitting } = form.formState;

	const onSubmit = async (data: RegisterFormData) => {
		setIsLoading(true);
		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: data.username,
					email: data.email,
					password: data.password,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				toast.error(result.error || "Error al registrar usuario");
				return;
			}

			toast.success("¡Registro exitoso! Redirigiendo al login...");
			setTimeout(() => {
				push("/auth/login");
			}, 1500);
		} catch (error) {
			toast.error("Error al conectar con el servidor");
			console.error("Error:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<motion.div
			className="flex items-center justify-center min-h-screen w-full p-6"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
		>
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="w-full max-w-md mx-auto"
			>
				<Form {...form}>
					<motion.form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4 w-full"
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
							<h1 className="text-3xl font-bold">Crear cuenta</h1>
						</motion.div>

						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.4 }}
						>
							<FormField
								control={form.control}
								name="username"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel>Nombre de usuario</FormLabel>
										<FormControl>
											<motion.div
												whileFocus={{ scale: 1.02 }}
												transition={{ duration: 0.2 }}
											>
												<Input placeholder="Nombre de usuario" {...field} />
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
							transition={{ duration: 0.5, delay: 0.55 }}
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
												<Input
													type="email"
													placeholder="Correo electrónico"
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
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.6 }}
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
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.55 }}
						>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel>Confirmar contraseña</FormLabel>
										<FormControl>
											<motion.div
												whileFocus={{ scale: 1.02 }}
												transition={{ duration: 0.2 }}
											>
												<Input
													type="password"
													placeholder="Confirmar contraseña"
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
									disabled={isSubmitting || isLoading}
								>
									{(isSubmitting || isLoading) && (
										<Spinner className="mr-2 size-4 animate-spin" />
									)}{" "}
									Crear cuenta
								</Button>
							</motion.div>
						</motion.div>

						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5, delay: 0.75 }}
							className="text-center text-sm text-muted-foreground"
						>
							¿Ya tienes cuenta?{" "}
							<Link
								href="/auth/login"
								className="text-primary hover:underline font-medium"
							>
								Inicia sesión aquí
							</Link>
						</motion.div>
					</motion.form>
				</Form>
			</motion.div>
		</motion.div>
	);
}
