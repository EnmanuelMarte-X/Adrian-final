"use client";

import { useClient } from "@/contexts/clients/queries";
import { Button } from "@/components/ui/button";
import {
	ArrowLeftIcon,
	RefreshCwIcon,
	TriangleAlert,
	UserSearchIcon,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientDetails } from "@/components/dashboard/clients/ClientDetails";
import { use } from "react";
import { motion } from "motion/react";

export default function ClientDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { data: client, isLoading, isError } = useClient(id);

	if (isError) {
		return (
			<div className="flex flex-col w-full min-h-screen py-6 px-6 space-y-6">
				<header className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<Link href="/dashboard/products" className="mr-4">
							<Button variant="outline" size="icon">
								<ArrowLeftIcon className="size-4" />
							</Button>
						</Link>
						<h1 className="text-2xl font-bold">Detalles del cliente</h1>
					</div>
				</header>

				<div className="flex flex-col items-center justify-center min-h-[200px] text-destructive-foreground/70">
					<TriangleAlert className="size-12" />
					<p className="text-sm text-muted-foreground/70 text-center mt-2 max-w-[45ch] font-medium">
						Error al cargar el cliente. Por favor, verifica tu conexión a
						internet o intenta nuevamente más tarde.
					</p>
					<div className="flex flex-wrap gap-2 mt-4">
						<Button variant="outline" onClick={() => window.location.reload()}>
							<RefreshCwIcon className="mr-2 size-4" />
							Reintentar
						</Button>
						<Link href="/dashboard/clients">
							<Button>
								<ArrowLeftIcon className="mr-2 size-4" />
								Volver a Clientes
							</Button>
						</Link>
					</div>
				</div>
			</div>
		);
	}

	if ((!client || client === null) && !isLoading && !isError) {
		return (
			<div className="flex flex-col w-full min-h-screen py-6 px-6 space-y-6">
				<header className="flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<Link href="/dashboard/products" className="mr-4">
							<Button variant="outline" size="icon">
								<ArrowLeftIcon className="size-4" />
							</Button>
						</Link>
						<h1 className="text-2xl font-bold">Detalles del client</h1>
					</div>
				</header>

				<div className="flex flex-col items-center space-y-2 justify-center h-full max-w-[45ch] mx-auto text-center">
					<UserSearchIcon className="mr-2 size-8" />
					<h1 className="text-lg font-medium">Cliente no encontrado.</h1>
					<p className="text-sm text-muted-foreground">
						No se pudo encontrar información sobre el cliente. Por favor,
						verifica el ID del cliente o intenta nuevamente más tarde.
					</p>
					<Link href="/dashboard/clients">
						<Button>
							<ArrowLeftIcon className="mr-2 size-4 mt-4" />
							Volver a Clientes
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<motion.main
			className="flex-1 p-6"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4 }}
		>
			<motion.div
				className="mb-6"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<Button asChild variant="outline" size="sm">
					<Link href="/dashboard/clients">
						<ArrowLeftIcon className="mr-2 size-4" />
						Volver a Clientes
					</Link>
				</Button>
			</motion.div>

			<motion.div
				className="flex flex-col gap-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
			>
				{isLoading || !client ? (
					<div className="space-y-4">
						<Skeleton className="h-8 w-64" />
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<Skeleton className="h-48 w-full" />
							<Skeleton className="h-48 w-full" />
						</div>
					</div>
				) : (
					<ClientDetails client={client} />
				)}
			</motion.div>
		</motion.main>
	);
}
