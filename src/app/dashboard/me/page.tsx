"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "next-auth/react";
import { User, Mail, Shield, LogOut, UserCheck, Phone } from "lucide-react";
import { ROLE_PERMISSIONS } from "@/config/roles";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

function MePageContent() {
	const { user, isLoading } = useAuth();

	const handleSignOut = async () => {
		await signOut({ callbackUrl: "/auth/login" });
	};

	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	};

	const getRoleColor = (roleName: string) => {
		switch (roleName) {
			case "admin":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			case "manager":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
			case "seller":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "support":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
		}
	};

	if (isLoading) {
		return (
			<div className="max-w-4xl w-full px-10 py-6 mx-auto">
				<Card>
					<CardContent className="flex items-center justify-center h-64">
						<div className="text-center">
							<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
							<p className="mt-2 text-muted-foreground">Cargando perfil...</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="w-full px-10 py-6">
				<Card>
					<CardContent className="flex items-center justify-center h-64">
						<div className="text-center">
							<User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<p className="text-lg font-medium">No se pudo cargar el perfil</p>
							<p className="text-muted-foreground">
								Intenta refrescar la página
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="max-w-6xl w-full px-10 py-6">
			<div className="flex flex-col gap-6">
				<motion.div
					className="flex items-center justify-between py-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex items-center gap-4">
						<Avatar className="h-20 w-20">
							<AvatarImage
								src={user.avatar}
								alt={`${user.firstName} ${user.lastName}`}
							/>
							<AvatarFallback className="text-xl">
								{getInitials(user.firstName, user.lastName)}
							</AvatarFallback>
						</Avatar>
						<div>
							<h1 className="text-2xl font-bold">
								{user.firstName} {user.lastName}
							</h1>
							<p className="text-muted-foreground">@{user.username}</p>
						</div>
					</div>
					<Button
						variant="outline"
						onClick={handleSignOut}
						className="text-destructive-foreground"
					>
						<LogOut className="size-4" />
						Cerrar sesión
					</Button>
				</motion.div>

				<motion.div
					className="grid grid-cols-1 md:grid-cols-2 gap-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Shield className="h-5 w-5" />
								Roles y permisos
							</CardTitle>
							<CardDescription>
								Tus roles actuales en el sistema
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div
									key={user.role}
									className="flex items-center justify-between"
								>
									<Badge
										variant="secondary"
										className={getRoleColor(user.role)}
									>
										{user.role}
									</Badge>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
									{ROLE_PERMISSIONS[user.role]?.map((permission) => (
										<div
											key={permission}
											className="flex items-center gap-2 p-2 bg-muted/50 rounded-md"
										>
											<div className="size-2 min-w-2 bg-green-500 rounded-full" />
											<span className="text-xs font-medium">{permission}</span>
										</div>
									))}
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<UserCheck className="h-5 w-5" />
								Información de la sesión
							</CardTitle>
							<CardDescription>Detalles de tu sesión actual</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">ID de usuario</span>
									<span className="text-xs font-mono bg-muted px-2 py-1 rounded">
										{user.id}
									</span>
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Rol asignado</span>
									<span className="text-sm text-muted-foreground">
										{user.role}
									</span>
								</div>
								<Separator />
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">Permisos totales</span>
									<span className="text-sm text-muted-foreground">
										{ROLE_PERMISSIONS[user.role]?.length || 0} activos
									</span>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Card>
						<CardHeader>
							<CardTitle>Información de contacto</CardTitle>
							<CardDescription>
								Tu información de contacto disponible
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Mail className="size-4 text-muted-foreground" />
										<span className="text-sm font-medium">
											Correo electrónico
										</span>
									</div>
									<p className="text-sm text-muted-foreground ml-6">
										{user.email}
									</p>
								</div>

								{user.phone && (
									<div className="space-y-2">
										<div className="flex items-center gap-2">
											<Phone className="size-4 text-muted-foreground" />
											<span className="text-sm font-medium">Teléfono</span>
										</div>
										<p className="text-sm text-muted-foreground ml-6">
											{user.phone}
										</p>
									</div>
								)}

								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<User className="size-4 text-muted-foreground" />
										<span className="text-sm font-medium">
											Nombre de usuario
										</span>
									</div>
									<p className="text-sm text-muted-foreground ml-6">
										@{user.username}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}

export default function MePage() {
	return (
		<Suspense fallback={
			<div className="max-w-4xl w-full px-10 py-6 mx-auto">
				<Card>
					<CardContent className="flex items-center justify-center h-64">
						<Spinner className="size-8 text-primary" />
					</CardContent>
				</Card>
			</div>
		}>
			<MePageContent />
		</Suspense>
	);
}
