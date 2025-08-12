import { GenericFilterBadges } from "../shared/GenericFilterBadges";
import type { ClientFilters } from "@/contexts/clients/types";
import {
	UserIcon,
	FileTextIcon,
	CreditCardIcon,
	BuildingIcon,
	MailIcon,
	CheckCircleIcon,
	XCircleIcon,
} from "lucide-react";

interface ClientFilterBadgesProps {
	filters: ClientFilters;
	onRemoveFilter: (key: keyof ClientFilters) => void;
	fixedKeys?: (keyof ClientFilters)[];
}

export function ClientFilterBadges({
	filters,
	onRemoveFilter,
	fixedKeys = [],
}: ClientFilterBadgesProps) {
	const filterConfigs = [
		{
			key: "name" as keyof ClientFilters,
			label: "Nombre",
			icon: <UserIcon className="size-3" />,
		},
		{
			key: "documentNumber" as keyof ClientFilters,
			label: "Documento",
			icon: <FileTextIcon className="size-3" />,
		},
		{
			key: "documentType" as keyof ClientFilters,
			label: "Tipo de documento",
			icon: <CreditCardIcon className="size-3" />,
			formatValue: (value: unknown) => {
				const docTypes: Record<string, string> = {
					cedula: "Cédula",
					rnc: "RNC",
					passport: "Pasaporte",
					other: "Otro",
				};
				return docTypes[value as string] || String(value);
			},
		},
		{
			key: "type" as keyof ClientFilters,
			label: "Tipo de cliente",
			icon: <BuildingIcon className="size-3" />,
			formatValue: (value: unknown) => {
				const clientTypes: Record<string, string> = {
					individual: "Individual",
					company: "Empresa",
				};
				return clientTypes[value as string] || String(value);
			},
		},
		{
			key: "email" as keyof ClientFilters,
			label: "Email",
			icon: <MailIcon className="size-3" />,
		},
		{
			key: "isActive" as keyof ClientFilters,
			label: "Estado",
			icon: undefined, // Se asigna dinámicamente
			formatValue: (value: unknown) => {
				return value ? "Activo" : "Inactivo";
			},
		},
	];

	const enhancedConfigs = filterConfigs.map((config) => {
		if (config.key === "isActive") {
			const isActive = filters.isActive;
			return {
				...config,
				icon: isActive ? (
					<CheckCircleIcon className="size-3" />
				) : (
					<XCircleIcon className="size-3" />
				),
			};
		}
		return config;
	});

	return (
		<GenericFilterBadges
			filters={filters as Record<string, unknown>}
			onRemoveFilter={onRemoveFilter as (key: string) => void}
			fixedKeys={fixedKeys as string[]}
			filterConfigs={enhancedConfigs}
		/>
	);
}
