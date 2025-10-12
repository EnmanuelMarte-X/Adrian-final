import React from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Trash2, CopyIcon, BanknoteIcon, PrinterIcon } from "lucide-react";
import { toast } from "sonner";
import { tryCatch } from "@/lib/utils";
import Link from "next/link";
import { DeleteOrderAlertDialog } from "./DeleteOrderAlertDialog";
import { OrderPaymentsSheet } from "./OrderPaymentsSheet";
import type { OrderType } from "@/types/models/orders";
import { useAuthorization } from "@/hooks/use-auth";

export function OrdersActions({
	order,
	trigger,
}: { order: OrderType; trigger?: React.ReactNode }) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
	const { isAdmin } = useAuthorization();

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsDeleteDialogOpen(true);
	};

	const handleViewDetails = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const handlePrint = (e: React.MouseEvent) => {
		e.stopPropagation();
		const printUrl = `/recipient/${order._id}`;
		window.open(printUrl, "_blank", "width=800,height=600");
	};

	const handleCopyId = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (!order._id) {
			toast.error("No se pudo copiar el ID: ID no disponible.");
			return;
		}
		console.log("Copiando ID de la orden:", order._id);
		tryCatch(navigator.clipboard.writeText(order._id));
		toast.info("ID copiado en el portapapeles.");
	};

	return (
		<>
			{isAdmin && (
				<DeleteOrderAlertDialog
					isOpen={isDeleteDialogOpen}
					onOpenChange={setIsDeleteDialogOpen}
					orderId={order.orderId}
				/>
			)}

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					{trigger ? (
						trigger
					) : (
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="size-4" />
						</Button>
					)}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Acciones</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link
							href={`/dashboard/orders/${order._id}`}
							onClick={handleViewDetails}
						>
							<Eye className="mr-2 size-4" />
							<span>Ver detalles</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={handleCopyId}>
						<CopyIcon className="mr-2 size-4" />
						<span>Copiar ID</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<OrderPaymentsSheet orderId={order._id || ""}>
						<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
							<BanknoteIcon className="mr-2 size-4" />
							<span>Ver pagos</span>
						</DropdownMenuItem>
					</OrderPaymentsSheet>
					<DropdownMenuItem onClick={handlePrint}>
						<PrinterIcon className="mr-2 size-4" />
						<span>Imprimir</span>
					</DropdownMenuItem>
					{isAdmin && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleDelete} variant="destructive">
								<Trash2 className="mr-2 size-4" />
								<span>Eliminar</span>
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
