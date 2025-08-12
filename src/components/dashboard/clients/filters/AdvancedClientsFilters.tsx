import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	FilterIcon,
	XIcon,
	UserCheckIcon,
	UserXIcon,
	UsersIcon,
} from "lucide-react";
import { memo } from "react";
import type { UseQueryStateReturn } from "nuqs";
import type { ClientFilters } from "@/contexts/clients/types";

interface AdvancedClientsFiltersProps {
	filters: ClientFilters;
	documentType?: string;
	type?: string;
	isActive?: boolean | null;
	onClearFilters: () => void;
	documentTypeUrlSetter: UseQueryStateReturn<string | null, string>[1];
	typeUrlSetter: UseQueryStateReturn<string | null, string>[1];
	isActiveUrlSetter: UseQueryStateReturn<boolean | null, boolean>[1];
}

async function updateFilter<T>(
	value: T | undefined,
	urlSetter: (v: T | null) => Promise<unknown>,
) {
	await urlSetter(value == null || value === "" ? null : value);
}

function AdvancedClientsFiltersComponent({
	filters,
	documentType,
	type,
	isActive,
	documentTypeUrlSetter,
	typeUrlSetter,
	isActiveUrlSetter,
	onClearFilters,
}: AdvancedClientsFiltersProps) {
	const hasActiveFilters = Object.values(filters).some(
		(val) => val !== undefined,
	);

	const advancedFilterCount = Object.keys(filters).filter(
		(k) =>
			filters[k as keyof ClientFilters] !== undefined &&
			["documentType", "type", "isActive"].includes(k),
	).length;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="size-9 min-h-9 min-w-9 relative" variant="outline">
					<FilterIcon />
					{hasActiveFilters && advancedFilterCount > 0 && (
						<Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center">
							{advancedFilterCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<header className="flex flex-col gap-y-2 mb-5">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-bold">Filtros avanzados</h2>
						{hasActiveFilters && (
							<Button
								variant="ghost"
								size="sm"
								onClick={onClearFilters}
								className="h-8 px-2 max-w-[15ch]"
							>
								<XIcon className="size-4" /> Limpiar
							</Button>
						)}
					</div>
					<p className="text-xs text-muted-foreground">
						Busca de una manera más específica utilizando los filtros avanzados.
					</p>
				</header>
				<div className="flex flex-col gap-y-4 w-full">
					<div className="flex flex-col gap-y-2">
						<span className="text-sm font-medium">Tipo de documento</span>
						<Select
							value={documentType ?? ""}
							onValueChange={(v) => updateFilter(v, documentTypeUrlSetter)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Seleccionar tipo" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="cedula">Cédula</SelectItem>
								<SelectItem value="rnc">RNC</SelectItem>
								<SelectItem value="passport">Pasaporte</SelectItem>
								<SelectItem value="other">Otro</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-y-2">
						<span className="text-sm font-medium">Tipo de cliente</span>
						<Select
							value={type ?? ""}
							onValueChange={(v) => updateFilter(v, typeUrlSetter)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Seleccionar tipo" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="individual">Individual</SelectItem>
								<SelectItem value="company">Empresa</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-y-2">
						<span className="text-sm font-medium">Estado</span>
						<ToggleGroup
							id="client-status"
							type="single"
							value={
								isActive === null ? "both" : isActive ? "active" : "inactive"
							}
							onValueChange={(value) => {
								if (value === "active") isActiveUrlSetter(true);
								else if (value === "inactive") isActiveUrlSetter(false);
								else isActiveUrlSetter(null);
							}}
							className="w-full border border-muted bg-sidebar"
						>
							<ToggleGroupItem
								className="hover:text-foreground"
								value="inactive"
								aria-label="Toggle show inactive clients"
							>
								<UserXIcon className="ml-1 size-4" /> Inactivo
							</ToggleGroupItem>
							<ToggleGroupItem
								className="border-l hover:text-foreground"
								value="active"
								aria-label="Toggle show active clients"
							>
								<UserCheckIcon className="ml-1 size-4" /> Activo
							</ToggleGroupItem>
							<ToggleGroupItem
								className="border-l hover:text-foreground"
								value="both"
								aria-label="Toggle show all clients"
							>
								<UsersIcon className="ml-1 size-4" /> Ambos
							</ToggleGroupItem>
						</ToggleGroup>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

export const AdvancedClientsFilters = memo(AdvancedClientsFiltersComponent);
