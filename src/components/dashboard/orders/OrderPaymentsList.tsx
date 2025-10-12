"use client";

import { usePaymentHistoryByOrderId } from "@/contexts/paymentHistory/queries";
import { 
	Table, 
	TableBody, 
	TableCell, 
	TableHead, 
	TableHeader, 
	TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
	MoreHorizontal,
	PrinterIcon,
	Trash2Icon,
	CreditCard,
	AlertCircle,
	BanknoteIcon
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { dateFormat, currencyFormat } from "@/config/formats";
import { useDeletePaymentHistoryMutation } from "@/contexts/paymentHistory/queries";
import { toast } from "sonner";
import { useAuthorization } from "@/hooks/use-auth";
import type { PaymentHistoryType } from "@/types/models/paymentHistory";

interface OrderPaymentsListProps {
	orderId: string;
}

const PaymentMethodBadge = ({ method }: { method: string }) => {
	const getMethodConfig = (method: string) => {
		switch (method) {
			case "cash":
				return { 
					label: "Efectivo", 
					variant: "default" as const, 
					icon: BanknoteIcon,
					className: "bg-green-500 text-white hover:bg-green-600"
				};
			case "card":
				return { 
					label: "Tarjeta", 
					variant: "secondary" as const, 
					icon: CreditCard,
					className: "bg-blue-100 text-blue-800 hover:bg-blue-200"
				};
			case "transfer":
				return { 
					label: "Transferencia", 
					variant: "outline" as const, 
					icon: CreditCard,
					className: "bg-purple-100 text-purple-800 hover:bg-purple-200"
				};
			default:
				return { 
					label: method, 
					variant: "outline" as const, 
					icon: CreditCard,
					className: "bg-gray-100 text-gray-800 hover:bg-gray-200"
				};
		}
	};

	const config = getMethodConfig(method);
	const Icon = config.icon;

	return (
		<Badge variant={config.variant} className={`gap-1.5 px-2.5 py-1 font-medium ${config.className}`}>
			<Icon className="size-3.5" />
			{config.label}
		</Badge>
	);
};

const PaymentActions = ({ payment }: { payment: PaymentHistoryType }) => {
	const { isAdmin } = useAuthorization();
	
	const { mutateAsync: deletePayment, isPending } = useDeletePaymentHistoryMutation(
		payment._id || "",
		{
			onSuccess: () => {
				toast.success("Pago eliminado exitosamente");
			},
			onError: () => {
				toast.error("Error al eliminar el pago");
			},
		}
	);

	const handlePrint = () => {
		const printUrl = `/voucher/${payment._id}`;
		window.open(printUrl, "_blank", "width=800,height=600");
	};

	const handleDelete = () => {
		if (window.confirm("¿Estás seguro de que deseas eliminar este pago?")) {
			deletePayment();
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Abrir menú</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Acciones</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handlePrint}>
					<PrinterIcon className="mr-2 size-4" />
					<span>Ver recibo</span>
				</DropdownMenuItem>
				{isAdmin && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem 
							onClick={handleDelete} 
							className="text-destructive"
							disabled={isPending}
						>
							<Trash2Icon className="mr-2 size-4" />
							<span>Eliminar</span>
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export function OrderPaymentsList({ orderId }: OrderPaymentsListProps) {
	const { data: payments, isLoading, isError } = usePaymentHistoryByOrderId(orderId);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center p-12 min-h-[200px]">
				<Spinner className="size-8 mb-3" />
				<span className="text-muted-foreground">Cargando pagos...</span>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-center min-h-[200px]">
				<div className="p-3 bg-destructive/10 rounded-full mb-4">
					<AlertCircle className="size-8 text-destructive" />
				</div>
				<h3 className="font-semibold text-lg mb-2">Error al cargar los pagos</h3>
				<p className="text-muted-foreground text-sm">
					No se pudieron cargar los pagos de esta factura.
				</p>
			</div>
		);
	}

	if (!payments || payments.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-12 text-center min-h-[200px]">
				<div className="p-3 bg-muted rounded-full mb-4">
					<CreditCard className="size-8 text-muted-foreground" />
				</div>
				<h3 className="font-semibold text-lg mb-2">No hay pagos registrados</h3>
				<p className="text-muted-foreground text-sm">
					Esta factura aún no tiene pagos registrados.
				</p>
			</div>
		);
	}

	const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

	return (
		<div className="space-y-6">
			{/* Header con estadísticas */}
			<div className="text-center space-y-2">
				<h3 className="text-xl font-semibold">Pagos registrados</h3>
				<div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
					<span>{payments.length} pago{payments.length !== 1 ? "s" : ""}</span>
					<span className="hidden sm:inline">•</span>
					<span className="font-medium text-foreground">
						Total pagado: {currencyFormat.format(totalPaid)}
					</span>
				</div>
			</div>

			{/* Lista de pagos para móvil */}
			<div className="sm:hidden space-y-3 px-2">
				{payments.map((payment) => (
					<div key={payment._id} className="bg-card border rounded-lg p-4 space-y-3">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<div className="font-medium">
									{dateFormat(new Date(payment.date), "PP")}
								</div>
								<div className="text-xs text-muted-foreground">
									{dateFormat(new Date(payment.date), "p")}
								</div>
							</div>
							<PaymentActions payment={payment} />
						</div>
						<div className="flex items-center justify-between">
							<PaymentMethodBadge method={payment.method} />
							<div className="text-lg font-semibold">
								{currencyFormat.format(payment.amount)}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Tabla para desktop */}
			<div className="hidden sm:block px-4">
				<div className="border rounded-lg overflow-hidden mx-auto max-w-4xl">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted/50">
								<TableHead className="font-semibold">Fecha</TableHead>
								<TableHead className="font-semibold">Método</TableHead>
								<TableHead className="text-right font-semibold">Monto</TableHead>
								<TableHead className="w-[50px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{payments.map((payment) => (
								<TableRow key={payment._id} className="hover:bg-muted/30">
									<TableCell>
										<div className="space-y-1">
											<div className="font-medium">
												{dateFormat(new Date(payment.date), "PP")}
											</div>
											<div className="text-xs text-muted-foreground">
												{dateFormat(new Date(payment.date), "p")}
											</div>
										</div>
									</TableCell>
									<TableCell>
										<PaymentMethodBadge method={payment.method} />
									</TableCell>
									<TableCell className="text-right font-semibold text-lg">
										{currencyFormat.format(payment.amount)}
									</TableCell>
									<TableCell>
										<PaymentActions payment={payment} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}