"use client";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { OrderPaymentsList } from "./OrderPaymentsList";
import { BanknoteIcon } from "lucide-react";

interface OrderPaymentsSheetProps {
	orderId: string;
	children?: React.ReactNode;
}

export function OrderPaymentsSheet({ orderId, children }: OrderPaymentsSheetProps) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				{children ? (
					children
				) : (
					<Button variant="outline" size="sm">
						<BanknoteIcon className="size-4" />
						<span className="hidden sm:inline ml-1">Pagos</span>
					</Button>
				)}
			</SheetTrigger>
			<SheetContent className="w-full sm:max-w-3xl overflow-hidden flex flex-col">
				<SheetHeader className="pb-4 border-b">
					<SheetTitle className="flex items-center gap-2 text-xl">
						<BanknoteIcon className="size-5" />
						Pagos de la Factura
					</SheetTitle>
					<SheetDescription className="text-base">
						Historial de pagos registrados para esta factura.
					</SheetDescription>
				</SheetHeader>
				<div className="flex-1 overflow-y-auto py-4">
					<OrderPaymentsList orderId={orderId} />
				</div>
			</SheetContent>
		</Sheet>
	);
}