"use client";

import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ClientType } from "@/types/models/clients";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ClientsActions } from "./ClientsActions";
import {
	User,
	Mail,
	FileText,
	Phone,
	MapPin,
	CalendarDays,
	ClipboardList,
} from "lucide-react";

interface ClientDetailsProps {
	client: ClientType;
}

export function ClientDetails({ client }: ClientDetailsProps) {
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

	const phoneTypeLabels: Record<string, string> = {
		mobile: "Móvil",
		work: "Trabajo",
		home: "Casa",
		other: "Otro",
	};

	return (
		<>
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">{client.name}</h1>
					<p className="text-muted-foreground">
						{documentTypeLabels[client.documentType]}: {client.documentNumber}
					</p>
				</div>
				<ClientsActions client={client} />
			</div>

			<Tabs defaultValue="info" className="w-full">
				<TabsList>
					<TabsTrigger value="info">Información</TabsTrigger>
					<TabsTrigger value="phones">Teléfonos</TabsTrigger>
					<TabsTrigger value="addresses">Direcciones</TabsTrigger>
				</TabsList>

				<TabsContent value="info" className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Card>
							<CardHeader>
								<CardTitle>Información básica</CardTitle>
								<CardDescription>Datos principales del cliente</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-2">
									<User className="size-4 text-muted-foreground" />
									<span className="font-medium">Tipo de cliente:</span>
									<span>{clientTypeLabels[client.type]}</span>
								</div>

								<div className="flex items-center gap-2">
									<Mail className="size-4 text-muted-foreground" />
									<span className="font-medium">Correo electrónico:</span>
									<span>{client.email || "No disponible"}</span>
								</div>

								<div className="flex items-center gap-2">
									<FileText className="size-4 text-muted-foreground" />
									<span className="font-medium">Documento:</span>
									<span>
										{documentTypeLabels[client.documentType]}:{" "}
										{client.documentNumber}
									</span>
								</div>

								<div className="flex items-center gap-2">
									<span className="font-medium">Estado:</span>
									<Badge variant={client.isActive ? "default" : "destructive"}>
										{client.isActive ? "Activo" : "Inactivo"}
									</Badge>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Fechas</CardTitle>
								<CardDescription>Información temporal</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-2">
									<CalendarDays className="size-4 text-muted-foreground" />
									<span className="font-medium">Fecha de creación:</span>
									<span>
										{format(new Date(client.createdAt), "PPP", { locale: es })}
									</span>
								</div>

								<div className="flex items-center gap-2">
									<CalendarDays className="size-4 text-muted-foreground" />
									<span className="font-medium">Última actualización:</span>
									<span>
										{format(new Date(client.updatedAt), "PPP", { locale: es })}
									</span>
								</div>
							</CardContent>
						</Card>

						{client.notes && (
							<Card className="md:col-span-2">
								<CardHeader>
									<CardTitle>Notas</CardTitle>
									<CardDescription>Información adicional</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="flex items-start gap-2">
										<ClipboardList className="size-4 text-muted-foreground mt-1" />
										<p className="whitespace-pre-line">{client.notes}</p>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</TabsContent>

				<TabsContent value="phones">
					<Card>
						<CardHeader>
							<CardTitle>Teléfonos</CardTitle>
							<CardDescription>
								{client.phones.length === 0
									? "No hay teléfonos registrados"
									: `${client.phones.length} teléfono(s) registrado(s)`}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{client.phones.map((phone, index) => (
									<div
										key={index}
										className="flex items-center p-3 border rounded-md relative"
									>
										<div className="flex-1 flex items-center gap-2">
											<Phone className="size-4 text-muted-foreground" />
											<span className="font-medium">
												{phoneTypeLabels[phone.type]}:
											</span>
											<span>{phone.number}</span>
										</div>
										{phone.isPrimary && (
											<Badge variant="outline">Principal</Badge>
										)}
									</div>
								))}
								{client.phones.length === 0 && (
									<p className="text-center text-muted-foreground">
										No hay teléfonos registrados para este cliente.
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="addresses">
					<Card>
						<CardHeader>
							<CardTitle>Direcciones</CardTitle>
							<CardDescription>
								{client.addresses.length === 0
									? "No hay direcciones registradas"
									: `${client.addresses.length} dirección(es) registrada(s)`}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{client.addresses.map((address, index) => (
									<div
										key={index}
										className="p-3 border rounded-md relative"
									>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
											<div className="flex items-center gap-2">
												<MapPin className="size-4 text-muted-foreground" />
												<span className="font-medium">Calle:</span>
												<span>{address.street}</span>
											</div>

											<div className="flex items-center gap-2">
												<span className="font-medium">Ciudad:</span>
												<span>{address.city}</span>
											</div>

											<div className="flex items-center gap-2">
												<span className="font-medium">Provincia:</span>
												<span>{address.state}</span>
											</div>

											<div className="flex items-center gap-2">
												<span className="font-medium">Código Postal:</span>
												<span>{address.zipCode}</span>
											</div>

											<div className="flex items-center gap-2">
												<span className="font-medium">País:</span>
												<span>{address.country}</span>
											</div>

											{address.isPrimary && (
												<div className="flex items-center">
													<Badge variant="outline">Dirección principal</Badge>
												</div>
											)}
										</div>
									</div>
								))}
								{client.addresses.length === 0 && (
									<p className="text-center text-muted-foreground">
										No hay direcciones registradas para este cliente.
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</>
	);
}
