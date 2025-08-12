"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type OnChangeFn,
	type PaginationState,
	useReactTable,
	type SortingState,
	type ColumnFiltersState,
	getSortedRowModel,
	getFilteredRowModel,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ArrowDownIcon,
	ArrowDownUpIcon,
	ArrowUpIcon,
	SearchXIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isLoading?: boolean;
	rowCount: number;
	pagination: PaginationState;
	onPaginationChange: OnChangeFn<PaginationState>;
	sorting?: SortingState;
	onSortingChange?: OnChangeFn<SortingState>;
	columnFilters?: ColumnFiltersState;
	onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
	enableSorting?: boolean;
	enableColumnFilters?: boolean;
	onRowClick?: (row: TData) => void;
	onRowHover?: (row: TData) => void;
	classNames?: Partial<{
		row: string;
		cell: string;
		header: string;
	}>;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	isLoading,
	rowCount,
	pagination,
	onPaginationChange,
	sorting = [],
	onSortingChange,
	columnFilters = [],
	onColumnFiltersChange,
	enableSorting = false,
	enableColumnFilters = false,
	onRowClick,
	onRowHover,
	classNames = {},
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		rowCount,
		getCoreRowModel: getCoreRowModel(),
		state: {
			pagination,
			sorting,
			columnFilters,
		},
		onPaginationChange,
		onSortingChange,
		onColumnFiltersChange,
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
		enableMultiSort: true,
		enableSorting,
		enableColumnFilters,
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<div
			data-loading={isLoading}
			style={{
				scrollbarWidth: "thin",
			}}
			className="data-[loading=true]:pointer-events-none data-[loading=true]:animate-pulse relative"
		>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead
										key={header.id}
										className={cn(
											"bg-secondary",
											header.column.getCanSort()
												? "cursor-pointer select-none"
												: "",
											classNames.header,
										)}
										onClick={
											header.column.getCanSort()
												? header.column.getToggleSortingHandler()
												: undefined
										}
									>
										<div className="flex items-center gap-2">
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}

											{header.column.getCanSort() && (
												<div>
													{header.column.getIsSorted() === "asc" ? (
														<ArrowUpIcon className="size-3 text-primary" />
													) : header.column.getIsSorted() === "desc" ? (
														<ArrowDownIcon className="size-3 text-primary" />
													) : (
														<div className="flex flex-col">
															<ArrowDownUpIcon className="size-3 opacity-50" />
														</div>
													)}
												</div>
											)}
										</div>
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
								className={cn(classNames.row)}
								onClick={(e) => {
									if ((e.target as HTMLElement).closest("button")) return;
									onRowClick?.(row.original);
								}}
								onMouseEnter={() => onRowHover?.(row.original)}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id} className={cn(classNames.cell)}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow className="hover:bg-transparent">
							<TableCell colSpan={columns.length} className="h-24 text-center">
								<div className="flex flex-col gap-y-4 p-6 text-muted-foreground items-center justify-center">
									{isLoading ? (
										<Spinner className="size-10 min-w-10 min-h-10" />
									) : (
										<>
											<SearchXIcon className="size-8 min-h-8 min-w-8" />
											<span className="text-muted-foreground">
												No se encontraron resultados.
											</span>
										</>
									)}
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
