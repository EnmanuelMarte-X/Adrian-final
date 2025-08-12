"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ClientType } from "@/types/models/clients";
import { Phone, Mail, FileText, MapPin } from "lucide-react";
import { documentTypeLabels } from "@/contexts/clients/document-types";

interface ClientCardViewProps {
	client: ClientType;
}

export function ClientCardView({ client }: ClientCardViewProps) {
	const primaryPhone = client.phones.find((phone) => phone.isPrimary);
	const primaryAddress = client.addresses.find((address) => address.isPrimary);

	return (
		<Card>
			<CardContent className="p-6">
				<div className="flex justify-between items-start mb-4">
					<h3 className="text-xl font-bold">{client.name}</h3>
					<Badge variant={client.isActive ? "default" : "destructive"}>
						{client.isActive ? "Activo" : "Inactivo"}
					</Badge>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					<div className="flex items-center gap-2">
						<FileText className="size-4 text-muted-foreground" />
						<span className="text-sm text-muted-foreground">
							{documentTypeLabels[client.documentType]}:
						</span>
						<span className="text-sm font-medium">{client.documentNumber}</span>
					</div>

					{client.email && (
						<div className="flex items-center gap-2">
							<Mail className="size-4 text-muted-foreground" />
							<span className="text-sm font-medium max-w-[200px] truncate">
								{client.email}
							</span>
						</div>
					)}

					{primaryPhone && (
						<div className="flex items-center gap-2">
							<Phone className="size-4 text-muted-foreground" />
							<span className="text-sm font-medium">{primaryPhone.number}</span>
						</div>
					)}

					{primaryAddress && (
						<div className="flex items-center gap-2">
							<MapPin className="size-4 text-muted-foreground" />
							<span className="text-sm font-medium max-w-[200px] truncate">
								{primaryAddress.street}, {primaryAddress.city}
							</span>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
