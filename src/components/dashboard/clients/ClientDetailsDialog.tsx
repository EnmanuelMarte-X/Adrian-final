"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { ClientBasicInfo } from "@/types/models/clients";
import { Building, User as UserIcon, Mail, IdCard } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { getInitials } from "@/lib/utils";

interface ClientDetailsDialogProps {
	clientId: string;
	children?: React.ReactNode;
	clientInfo?: ClientBasicInfo;
	triggerLabel?: string;
	title?: string;
}

export function ClientDetailsDialog({
	children,
	clientInfo,
	triggerLabel = "Ver detalles",
	title = "Detalles del cliente",
}: ClientDetailsDialogProps) {
	const [open, setOpen] = useState(false);

	const getDocumentTypeLabel = (type: string) => {
		const labels = {
			cedula: "Cédula",
			rnc: "RNC",
			passport: "Pasaporte",
			other: "Otro",
		};
		return labels[type as keyof typeof labels] || type;
	};

	const getClientTypeIcon = (type: string) => {
		return type === "company" ? Building : UserIcon;
	};

	const renderClientInfo = () => {
		if (!clientInfo) {
			return (
				<div className="flex flex-col items-center py-8">
					<UserIcon className="h-16 w-16 text-muted-foreground mb-4" />
					<p className="text-muted-foreground text-center">
						No se encontró información del cliente.
					</p>
				</div>
			);
		}

		const ClientTypeIcon = getClientTypeIcon(clientInfo.type);

		return (
			<div className="flex flex-col gap-6 py-4">
				<div className="flex items-center gap-4">
					<Avatar className="h-16 w-16">
						<AvatarFallback>{getInitials(clientInfo.name)}</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<h3 className="text-xl font-semibold">{clientInfo.name}</h3>
						<div className="flex items-center gap-2 mt-1">
							<ClientTypeIcon className="h-3 w-3 text-muted-foreground" />
							<Badge variant="outline" className="text-xs">
								{clientInfo.type === "company" ? "Empresa" : "Individual"}
							</Badge>
						</div>
					</div>
				</div>

				<div className="grid gap-4">
					{clientInfo.email && (
						<div className="flex items-center gap-2">
							<Mail className="size-4 text-muted-foreground" />
							<span>{clientInfo.email}</span>
						</div>
					)}

					<div className="flex items-center gap-2">
						<IdCard className="size-4 text-muted-foreground" />
						<span>
							{getDocumentTypeLabel(clientInfo.documentType)}:{" "}
							{clientInfo.documentNumber}
						</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children || <Button variant="outline">{triggerLabel}</Button>}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>
						Información detallada del cliente
					</DialogDescription>
				</DialogHeader>
				{renderClientInfo()}
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						Cerrar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
