"use client";

import { Badge } from "@/components/ui/badge";
import { ClientsActions } from "./ClientsActions";
import type { ClientType } from "@/types/models/clients";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Mail, FileText, Calendar, Phone, MapPin } from "lucide-react";

export function ClientCard({ client }: { client: ClientType }) {
	const documentTypeLabels: Record<string, string> = {
		cedula: "Cédula",
		rnc: "RNC",
		passport: "Pasaporte",
		other: "Otro",
	};

	const clientTypeLabels: Record<string, string> = {
		individual: "Individual",
		company: "Empresa",
	};

	return (
		<ClientsActions
			client={client}
			trigger={
				<button
					type="button"
					className="flex flex-col p-4 gap-y-4 bg-secondary rounded-lg shadow-md max-w-sm focus:outline-none focus:ring focus:ring-primary focus:ring-opacity-20 transition-transform transform aria-pressed:scale-95"
				>
					<div className="inline-flex justify-between gap-x-2">
						<div className="flex flex-col gap-y-2 items-start">
							<h3 className="font-medium text-start">{client.name}</h3>
							<p className="text-muted-foreground text-sm">
								{clientTypeLabels[client.type] || client.type}
							</p>
						</div>
						<div className="flex flex-col items-end gap-y-2">
							<Badge
								variant={client.isActive ? "default" : "destructive"}
								className="shrink-0"
							>
								{client.isActive ? "Activo" : "Inactivo"}
							</Badge>
							<div className="inline-flex text-nowrap gap-x-1 items-center text-[.8rem] text-muted-foreground">
								<FileText size={13} />
								{documentTypeLabels[client.documentType]}:{" "}
								{client.documentNumber}
							</div>
						</div>
					</div>

					<div className="flex gap-3 mt-3">
						<div className="inline-flex items-center text-muted-foreground gap-x-1">
							<Calendar className="size-3.5" />
							<p className="text-xs font-medium">
								{format(new Date(client.createdAt), "dd MMM yyyy", {
									locale: es,
								})}
							</p>
						</div>
						<div className="inline-flex items-center text-muted-foreground gap-x-1">
							<Mail className="size-3" />
							<p className="text-xs font-medium">
								{client.email || "No disponible"}
							</p>
						</div>
						<div className="inline-flex items-center text-muted-foreground gap-x-1">
							<Phone className="size-3" />
							<p className="text-xs font-medium">{client.phones.length}</p>
						</div>
						<div className="inline-flex items-center text-muted-foreground gap-x-1">
							<MapPin className="size-3" />
							<p className="text-xs font-medium">{client.addresses.length}</p>
						</div>
					</div>
				</button>
			}
		/>
	);
}
