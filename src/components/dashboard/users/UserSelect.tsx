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
import type { UserType } from "@/types/models/users";
import { useInfiniteUsers, useUserById } from "@/contexts/users/queries";

interface UserSelectProps {
	value?: string;
	defaultValue?: string;
	onChange?: (user: UserType | null) => void;
	className?: string;
	placeholder?: string;
	disabled?: boolean;
}

export function UserSelect({
	value,
	defaultValue,
	onChange,
	className,
	placeholder = "Seleccionar usuario",
	disabled = false,
}: UserSelectProps) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

	const debouncedSearch = useDebounce(searchTerm, 300);

	// Use the infinite query from React Query
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
	} = useInfiniteUsers(debouncedSearch);

	// Use the existing query to fetch selected user if not in current data
	const { data: selectedUserData } = useUserById(
		(value || defaultValue) && !selectedUser
			? value || defaultValue
			: undefined,
	);

	// Flatten all pages into a single array
	const users = useMemo(() => {
		return data?.pages.flatMap((page) => page.data) || [];
	}, [data]);

	// Find selected user when value changes or users load
	useEffect(() => {
		const userId = value || defaultValue;
		if (userId) {
			// First check in current users
			const user = users.find((u) => u._id === userId);
			if (user) {
				setSelectedUser(user);
			} else if (selectedUserData) {
				// Use the user fetched by the individual query
				setSelectedUser(selectedUserData);
			}
		} else {
			setSelectedUser(null);
		}
	}, [value, defaultValue, users, selectedUserData]);

	const handleSelect = useCallback(
		(user: UserType) => {
			setSelectedUser(user);
			onChange?.(user);
			setOpen(false);
			setSearchTerm("");
		},
		[onChange],
	);

	const handleClear = useCallback(() => {
		setSelectedUser(null);
		onChange?.(null);
		setSearchTerm("");
	}, [onChange]);

	const displayValue = useMemo(() => {
		if (selectedUser) {
			return `${selectedUser.firstName} ${selectedUser.lastName}`;
		}
		return placeholder;
	}, [selectedUser, placeholder]);

	const getUserContactInfo = useCallback((user: UserType) => {
		if (user.phone) {
			return `Tel: ${user.phone}`;
		}

		if (user.email) {
			return `Email: ${user.email}`;
		}

		return `@${user.username}`;
	}, []);

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
							placeholder="Buscar usuarios por nombre..."
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

						{users.length === 0 && !isLoading && !error && (
							<CommandEmpty>
								{debouncedSearch
									? "No se encontraron usuarios."
									: "Escribe para buscar usuarios..."}
							</CommandEmpty>
						)}

						{users.length > 0 && (
							<CommandGroup>
								{users.map((user) => (
									<CommandItem
										key={user._id}
										value={user._id}
										onSelect={() => handleSelect(user)}
										className="cursor-pointer"
									>
										<div className="flex items-center justify-between w-full">
											<div className="flex items-center">
												<Check
													className={cn(
														"mr-2 size-4",
														selectedUser?._id === user._id
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												<div>
													<div className="font-medium">
														{`${user.firstName} ${user.lastName}`}
													</div>
													<div className="text-xs text-muted-foreground">
														<span>@{user.username}</span>
														{" • "}
														<span>{getUserContactInfo(user)}</span>
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="text-xs text-muted-foreground">
													{user.roles.at(0)?.name || "Sin rol"}
												</div>
												{user.lastLogin && (
													<div className="text-xs text-muted-foreground">
														Último acceso:{" "}
														{new Date(user.lastLogin).toLocaleDateString()}
													</div>
												)}
											</div>
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						)}

						{(isLoading || isFetchingNextPage) && (
							<div className="flex items-center justify-center py-4">
								<Loader2 className="size-4 animate-spin mr-2" />
								<span className="text-sm text-muted-foreground">
									{users.length === 0
										? "Cargando usuarios..."
										: "Cargando más usuarios..."}
								</span>
							</div>
						)}

						{!hasNextPage &&
							users.length > 0 &&
							!isLoading &&
							!isFetchingNextPage && (
								<div className="text-center py-2 text-xs text-muted-foreground border-t">
									{users.length === 1
										? "1 usuario encontrado"
										: `${users.length} usuarios encontrados`}
								</div>
							)}
					</CommandList>
				</Command>
				{selectedUser && (
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
