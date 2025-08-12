"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import type { ClientType } from "@/types/models/clients";
import { useInfiniteClients, useClient } from "@/contexts/clients/queries";

interface ClientSelectProps {
	value?: string;
	defaultValue?: string;
	onChange?: (client: ClientType | null) => void;
	className?: string;
	placeholder?: string;
	disabled?: boolean;
}

export function ClientSelect({
	value,
	defaultValue,
	onChange,
	className,
	placeholder = "Seleccionar cliente",
	disabled = false,
}: ClientSelectProps) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);

	const debouncedSearch = useDebounce(searchTerm, 300);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useInfiniteClients({ name: debouncedSearch });

	const { data: selectedClientData } = useClient(
		(value || defaultValue) && !selectedClient
			? value || defaultValue
			: undefined,
	);

	const clients = useMemo(() => {
		return data?.pages.flatMap((page) => page.clients) || [];
	}, [data]);

	useEffect(() => {
		const clientId = value || defaultValue;
		if (clientId) {
			const client = clients.find((c) => c._id === clientId);
			if (client) {
				setSelectedClient(client);
			} else if (selectedClientData) {
				setSelectedClient(selectedClientData);
			}
		} else {
			setSelectedClient(null);
		}
	}, [value, defaultValue, clients, selectedClientData]);

	const handleSelect = useCallback(
		(client: ClientType) => {
			setSelectedClient(client);
			onChange?.(client);
			setOpen(false);
			setSearchTerm("");
		},
		[onChange],
	);

	const handleClear = useCallback(() => {
		setSelectedClient(null);
		onChange?.(null);
		setSearchTerm("");
	}, [onChange]);

	const getClientContactInfo = useCallback((client: ClientType) => {
		if (client.documentNumber && client.documentType) {
			return `${client.documentType}: ${client.documentNumber}`;
		}

		const primaryPhone = client.phones?.find((p) => p.isPrimary)?.number;
		if (primaryPhone) {
			return `Tel: ${primaryPhone}`;
		}

		const anyPhone = client.phones?.[0]?.number;
		if (anyPhone) {
			return `Tel: ${anyPhone}`;
		}

		if (client.email) {
			return `Email: ${client.email}`;
		}

		return client.type;
	}, []);

	const displayValue = useMemo(() => {
		if (selectedClient) {
			if (!selectedClient.name)
				return `Cliente sin nombre - ${getClientContactInfo(selectedClient)}`;
			return `${selectedClient.name} - ${getClientContactInfo(selectedClient)}`;
		}
		return placeholder;
	}, [selectedClient, placeholder, getClientContactInfo]);

	const handleScroll = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
			if (
				scrollHeight - scrollTop <= clientHeight * 1.2 &&
				hasNextPage &&
				!isFetchingNextPage &&
				!isLoading
			) {
				fetchNextPage();
			}
		},
		[hasNextPage, isFetchingNextPage, isLoading, fetchNextPage],
	);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			setOpen(false);
			setSearchTerm("");
		}
	}, []);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					// biome-ignore lint/a11y/useSemanticElements: its a trigger for the combobox
					role="combobox"
					aria-expanded={open}
					className={cn("justify-between", className)}
					disabled={disabled}
				>
					<span className="truncate">{displayValue}</span>
					<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[400px] p-0" align="start">
				<Command shouldFilter={false} onKeyDown={handleKeyDown}>
					<div className="flex items-center border-b px-3">
						<Search className="mr-2 size-4 shrink-0 opacity-50" />
						<input
							placeholder="Buscar clientes por nombre..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
							// biome-ignore lint/a11y/noAutofocus: when the combobox is opened for general the user type, it should focus on the input
							autoFocus
						/>
					</div>
					<CommandList onScroll={handleScroll} className="max-h-[300px]">
						{error && (
							<div className="p-4 text-center text-sm text-destructive">
								{error.message || "Error desconocido"}
							</div>
						)}

						{clients.length === 0 && !isLoading && !error && (
							<CommandEmpty>
								{debouncedSearch
									? "No se encontraron clientes."
									: "Escribe para buscar clientes..."}
							</CommandEmpty>
						)}

						{clients.length > 0 && (
							<CommandGroup>
								{clients.map((client) => (
									<CommandItem
										key={client._id}
										value={client._id}
										onSelect={() => handleSelect(client)}
										className="cursor-pointer"
									>
										<div className="flex items-center justify-between w-full">
											<div className="flex items-center">
												<Check
													className={cn(
														"mr-2 size-4",
														selectedClient?._id === client._id
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												<div>
													<div className="font-medium">{client.name}</div>
													<div className="text-xs text-muted-foreground">
														<span className="capitalize">{client.type}</span>
														{" • "}
														<span>{getClientContactInfo(client)}</span>
													</div>
												</div>
											</div>
											{client.debt && client.debt > 0 && (
												<div className="text-right">
													<div className="text-xs text-destructive font-medium">
														Deuda: ${client.debt.toFixed(2)}
													</div>
												</div>
											)}
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						)}

						{(isLoading || isFetchingNextPage) && (
							<div className="flex items-center justify-center py-4">
								<Loader2 className="size-4 animate-spin mr-2" />
								<span className="text-sm text-muted-foreground">
									{clients.length === 0
										? "Cargando clientes..."
										: "Cargando más clientes..."}
								</span>
							</div>
						)}

						{!hasNextPage &&
							clients.length > 0 &&
							!isLoading &&
							!isFetchingNextPage && (
								<div className="text-center py-2 text-xs text-muted-foreground border-t">
									{clients.length === 1
										? "1 cliente encontrado"
										: `${clients.length} clientes encontrados`}
								</div>
							)}
					</CommandList>
				</Command>
				{selectedClient && (
					<div className="border-t p-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleClear}
							className="w-full text-xs"
						>
							Limpiar selección
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
