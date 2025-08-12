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
import { Edit, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { DeleteOrderAlertDialog } from "./DeleteOrderAlertDialog";
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

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
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
					<DropdownMenuItem asChild onClick={handleEdit}>
						<Link href={`/dashboard/orders/edit/${order.orderId}`}>
							<Edit className="mr-2 size-4" />
							<span>Editar</span>
						</Link>
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
