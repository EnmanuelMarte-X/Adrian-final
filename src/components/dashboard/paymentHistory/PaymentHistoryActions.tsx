"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PaymentHistoryType } from "@/types/models/paymentHistory";
import {
	EllipsisIcon,
	FileTextIcon,
	PrinterIcon,
	Trash2Icon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuthorization } from "@/hooks/use-auth";
import { DeletePaymentHistoryAlertDialog } from "./DeletePaymentHistoryAlertDialog";

export function PaymentHistoryActions({
	paymentHistory,
	trigger,
}: {
	paymentHistory: PaymentHistoryType;
	trigger?: React.ReactNode;
}) {
	const [deleteOpen, setDeleteOpen] = useState(false);
	const { isAdmin } = useAuthorization();

	const handlePrint = () => {
		const printUrl = `/voucher/${paymentHistory?._id}`;
		window.open(printUrl, "_blank", "width=800,height=600");
	};

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		setDeleteOpen(true);
	};

	return (
		<>
			{(isAdmin  && paymentHistory._id) && (
				<DeletePaymentHistoryAlertDialog
					paymentId={paymentHistory._id}
					isOpen={deleteOpen}
					onOpenChange={setDeleteOpen}
				/>
			)}

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					{trigger ? (
						trigger
					) : (
						<Button variant="ghost">
							<EllipsisIcon className="size-4" />
						</Button>
					)}
				</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Acciones</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handlePrint}>
					<PrinterIcon className="mr-2 size-4" />
					<span>Ver recibo</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<Link
					href={`/dashboard/orders/${typeof paymentHistory.orderId === "string" ? paymentHistory.orderId : paymentHistory.orderId?._id}`}
				>
					<DropdownMenuItem>
						<FileTextIcon className="mr-2 size-4" />
						<span>Ver factura</span>
					</DropdownMenuItem>
				</Link>
				{isAdmin && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleDelete} variant="destructive">
							<Trash2Icon className="mr-2 size-4" />
							<span>Eliminar</span>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
		</>
	);
}
