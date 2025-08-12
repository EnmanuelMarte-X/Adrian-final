import { BoxesIcon, CalendarDaysIcon, PackageSearch } from "lucide-react";
import { getDateFromObjectId } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface StorageInfoCardProps {
	storage?: {
		_id: string;
		name: string;
		productsCount: number;
		order: number;
	};
	isLoading: boolean;
}

export function StorageInfoCard({ storage, isLoading }: StorageInfoCardProps) {
	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Información del almacén</CardTitle>
					<CardDescription>Detalles y estadísticas</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<Skeleton className="h-8 w-full" />
						<div className="space-y-3">
							<Skeleton className="h-16 w-full" />
							<Skeleton className="h-16 w-full" />
							<Skeleton className="h-16 w-full" />
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!storage) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Información del almacén</CardTitle>
					<CardDescription>Detalles y estadísticas</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="p-8 text-center">
						<p className="text-muted-foreground">
							No se encontró información del almacén
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Información del almacén</CardTitle>
				<CardDescription>Detalles y estadísticas</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex justify-between items-center border-b pb-2">
						<h1 className="text-xl font-bold">{storage.name}</h1>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<p className="text-muted-foreground text-sm cursor-help">
										ID: {storage._id?.substring(0, 6)}
									</p>
								</TooltipTrigger>
								<TooltipContent>
									<p>{storage._id}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					<div className="space-y-3">
						<div className="flex flex-col p-3 bg-secondary/40 rounded-md border shadow-sm">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<CalendarDaysIcon className="size-5 text-primary" />
									<span className="font-medium">Fecha de creación</span>
								</div>
								<time
									dateTime={getDateFromObjectId(storage._id)?.toISOString()}
								>
									{getDateFromObjectId(storage._id)
										? formatDate(
												getDateFromObjectId(storage._id) as Date,
												"dd/MM/yyyy",
											)
										: "Fecha desconocida"}
								</time>
							</div>
						</div>

						<div className="flex flex-col p-3 bg-secondary/40 rounded-md border shadow-sm">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<BoxesIcon className="size-5 text-primary" />
									<span className="font-medium">Total Productos</span>
								</div>
								<span className="text-lg font-medium">
									{storage.productsCount}
								</span>
							</div>
						</div>

						<div className="flex flex-col p-3 bg-secondary/40 rounded-md border shadow-sm">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<PackageSearch className="size-5 text-primary" />
									<span className="font-medium">Factura</span>
								</div>
								<span className="text-lg font-medium">{storage.order + 1}</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
