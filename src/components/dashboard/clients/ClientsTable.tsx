"use client";

import type {
	ColumnDef,
	PaginationState,
	SortingState,
} from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useClients } from "@/contexts/clients/queries";
import type { Dispatch, SetStateAction } from "react";
import { DataPagination } from "@/components/ui/data-pagination";
import { ClientsActions } from "./ClientsActions";
import {
	cn,
	formatNationalId,
	getInitials,
	getTotalPages,
	getUnsetValue,
} from "@/lib/utils";
import type { ClientFilters } from "@/contexts/clients/types";
import { ClientCard } from "./ClientCard";
import Link from "next/link";
import type { ClientType } from "@/types/models/clients";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useSidebar } from "@/components/ui/sidebar";
import { currencyFormat } from "@/config/formats";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const columns: ColumnDef<ClientType>[] = [
	{
		accessorKey: "name",
		header: "Nombre",
		enableColumnFilter: true,
		enableSorting: true,
		enableResizing: true,
		cell: ({ row }) => {
			const client = row.original;
			return (
				<div className="flex items-center gap-2 pl-2">
					<Avatar className="h-8 w-8">
						<AvatarFallback className="text-xs text-muted-foreground">
							{getInitials(client?.name)}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						{client?.name && client?.documentNumber ? (
							<>
								<Link
									href={`/dashboard/clients/${client?._id}`}
									className="font-medium text-primary hover:underline"
								>
									<div className="font-medium text-sm truncate max-w-[120px]">
										{client.name}
									</div>
								</Link>
								<div className="text-xs text-muted-foreground">
									{client.documentNumber}
								</div>
							</>
						) : client?.name ? (
							<Link
								href={`/dashboard/clients/${client?._id}`}
								className="font-medium text-primary hover:underline"
							>
								<div className="font-medium text-sm truncate max-w-[120px]">
									{client.name}
								</div>
							</Link>
						) : client?.documentNumber ? (
							<Link
								href={`/dashboard/clients/${client?._id}`}
								className="font-medium text-primary hover:underline"
							>
								<div className="text-xs text-muted-foreground">
									{client.documentNumber}
								</div>
							</Link>
						) : (
							<div className="font-medium text-sm text-muted-foreground">
								N/A
							</div>
						)}
					</div>
				</div>
			);
		},
	},
	{
		accessorKey: "documentNumber",
		header: "Número de documento",
		enableColumnFilter: true,
		enableSorting: true,
		cell: ({ row }) => {
			return (
				<div className="font-medium max-w-[12ch] truncate">
					{formatNationalId(
						row.original.documentNumber,
						row.original.documentType,
					) || "No asignado."}
				</div>
			);
		},
	},
	{
		accessorKey: "type",
		header: "Tipo de cliente",
		enableColumnFilter: true,
		enableSorting: true,
		cell: ({ row }) => {
			const clientTypeLabels: Record<string, string> = {
				individual: "Individual",
				company: "Empresa",
			};

			return (
				<div className="font-medium max-w-[25ch] truncate">
					{clientTypeLabels[row.original.type] || row.original.type}
				</div>
			);
		},
	},
	{
		accessorKey: "debt",
		header: "Deuda",
		enableColumnFilter: true,
		enableSorting: true,
		cell: ({ row }) => {
			return (
				<div
					className={cn("font-medium max-w-[12ch] truncate", {
						"text-muted-foreground":
							!row.original.debt || row.original.debt === 0,
						"text-success-foreground":
							row.original.debt && row.original.debt > 0,
						"text-destructive-foreground":
							row.original.debt && row.original.debt < 0,
					})}
				>
					{currencyFormat.format(row.original.debt ?? 0)}
				</div>
			);
		},
	},
	{
		id: "phones",
		header: "Teléfonos",
		enableColumnFilter: true,
		enableSorting: false,
		cell: ({ row }) => {
			const phones = row.original.phones
				.map((phone) => phone.number)
				.join(", ");
			return <div className="max-w-[20ch] truncate">{phones}</div>;
		},
	},
	{
		accessorKey: "email",
		header: "Correo electrónico",
		enableColumnFilter: true,
		enableSorting: true,
		cell: ({ row }) => {
			return (
				<div
					className={cn("font-medium max-w-[25ch] truncate", {
						"text-muted-foreground text-sm": !row.original.email,
					})}
				>
					{getUnsetValue(row.original.email, "N/A")}
				</div>
			);
		},
	},
	{
		accessorKey: "_id",
		header: "Fecha de creación",
		enableSorting: true,
		cell: ({ row }) => {
			const date = row.original.createdAt;

			return (
				<div className="font-medium truncate">
					{format(new Date(date), "dd MMM yyyy", { locale: es })}
				</div>
			);
		},
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => <ClientsActions client={row.original} />,
	},
];

export function ClientsTable({
	pagination,
	setPagination,
	sorting,
	setSorting,
	filters,
}: {
	pagination: PaginationState;
	setPagination: Dispatch<SetStateAction<PaginationState>>;
	sorting: SortingState;
	setSorting: Dispatch<SetStateAction<SortingState>>;
	filters: ClientFilters;
}) {
	const sortParams = sorting.map((sort) => ({
		field: sort.id,
		order: sort.desc ? "desc" : "asc",
	}));

	const { data, isLoading } = useClients({
		pagination: {
			page: pagination.pageIndex,
			limit: pagination.pageSize,
		},
		sort: sortParams,
		filters,
	});

	const totalPages = getTotalPages(data?.total, pagination.pageSize);

	const handlePageChange = (pageIndex: number) => {
		setPagination((prev) => ({ ...prev, pageIndex }));
	};

	const { isMobile, state } = useSidebar();
	const isMinInnerWidth =
		isMobile ||
		(state === "expanded" &&
			typeof window !== "undefined" &&
			window.innerWidth < 1380) ||
		(state === "collapsed" &&
			typeof window !== "undefined" &&
			window.innerWidth < 1170);

	return (
		<section
			className={cn("flex flex-col rounded-lg overflow-hidden max-w-full", {
				"border bg-card": !isMinInnerWidth,
				"space-y-4": isMinInnerWidth,
			})}
		>
			{isMinInnerWidth ? (
				<>
					{data?.clients && data.clients.length > 0 ? (
						data.clients.map((client) => (
							<ClientCard key={client._id} client={client} />
						))
					) : (
						<span className="text-muted-foreground text-center">
							No se encontraron clientes.
						</span>
					)}
				</>
			) : (
				<DataTable
					columns={columns}
					data={data?.clients ?? []}
					rowCount={data?.total ?? 0}
					pagination={pagination}
					onPaginationChange={setPagination}
					sorting={sorting}
					onSortingChange={setSorting}
					enableSorting
					isLoading={isLoading}
				/>
			)}
			<div
				className={cn("flex items-center justify-between px-4 py-2", {
					"bg-secondary": !isMinInnerWidth,
				})}
			>
				{totalPages > 1 && !isMinInnerWidth && (
					<DataPagination
						totalPages={totalPages}
						currentPage={pagination.pageIndex}
						onPageChange={handlePageChange}
					/>
				)}
				<span
					className={cn("text-muted-foreground text-xs lg:text-nowrap", {
						"animate-pulse": isLoading || isLoading,
					})}
				>
					{`Mostrando ${data?.clients?.length ?? 0} clientes de ${data?.total ?? 0} totales.`}
				</span>
			</div>
		</section>
	);
}
