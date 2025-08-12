"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteClientMutation } from "@/contexts/clients/queries";
import { MoreHorizontal, Pencil, Trash, Eye, FileTextIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { ClientType } from "@/types/models/clients";
import { EditClientSheet } from "./EditClientSheet";
import { useAuthorization } from "@/hooks/use-auth";
import Link from "next/link";

interface ClientsActionsProps {
	client: ClientType;
	trigger?: React.ReactNode;
}

export function ClientsActions({ client, trigger }: ClientsActionsProps) {
	const router = useRouter();
	const [openEditDialog, setOpenEditDialog] = useState(false);
	const { isAdmin } = useAuthorization();

	const deleteClientMutation = useDeleteClientMutation(client._id, {
		onSuccess: () => {
			toast.success("Cliente eliminado", {
				description: "El cliente ha sido eliminado correctamente.",
			});
		},
		onError: () => {
			toast.error("Error al eliminar cliente", {
				description: "No se pudo eliminar el cliente. Intente nuevamente.",
			});
		},
	});

	const handleView = () => {
		router.push(`/dashboard/clients/${client._id}`);
	};

	const handleDelete = () => {
		deleteClientMutation.mutate();
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					{trigger || (
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Abrir menú</span>
							<MoreHorizontal className="size-4" />
						</Button>
					)}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Acciones</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleView}>
						<Eye className="mr-2 size-4" />
						<span>Ver detalles</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<Link href={`/dashboard/orders?buyerId=${client._id}`}>
						<DropdownMenuItem>
							<FileTextIcon className="mr-2 size-4" />
							<span>Ver facturas</span>
						</DropdownMenuItem>
					</Link>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => setOpenEditDialog(true)}>
						<Pencil className="mr-2 size-4" />
						<span>Editar</span>
					</DropdownMenuItem>
					{isAdmin && (
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<DropdownMenuItem
									onSelect={(e) => {
										e.preventDefault();
									}}
									className="text-destructive-foreground"
								>
									<Trash className="mr-2 size-4 text-destructive-foreground" />
									<span>Eliminar</span>
								</DropdownMenuItem>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>
										¿Está seguro de eliminar este cliente?
									</AlertDialogTitle>
									<AlertDialogDescription>
										Esta acción no se puede deshacer. El cliente será eliminado
										permanentemente de la base de datos.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancelar</AlertDialogCancel>
									<AlertDialogAction
										className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
										onClick={handleDelete}
									>
										Eliminar
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<EditClientSheet
				client={client}
				open={openEditDialog}
				onOpenChange={setOpenEditDialog}
			/>
		</>
	);
}
