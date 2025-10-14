import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";
import type { PaymentHistoryType } from "@/types/models/paymentHistory";
import { paymentMethods } from "@/contexts/paymentHistory/payment-method";
import { DatePicker } from "@/components/ui/date-picker";
import { paymentMethodIcons, unknownPaymentMethodIcon } from "@/config/orders";
import { ClientSelect } from "../clients/ClientSelect";
import { OrderWithDebtSelect } from "../orders/OrderWithDebtSelect";
import { useEffect } from "react";

export function CreatePaymentForm() {
	const { control, register, setValue, watch, getValues } =
		useFormContext<PaymentHistoryType>();

	const watchedDate = watch("date");
	const watchedMethod = watch("method");

	const handleMethodChange = (value: string) => {
		setValue("method", value as PaymentHistoryType["method"]);
	};

	const handleDateChange = (date?: Date) => {
		setValue("date", date || new Date());
	};

	const _clientId = watch("clientId");
	const clientId = typeof _clientId === "string" ? _clientId : _clientId?._id;

	useEffect(() => {
		const currentOrderId = getValues("orderId");
		if (!currentOrderId) {
			return;
		}

		const order = getValues("orderId");
		if (order && clientId) {
			const isFromInvoiceSelection = order !== "";
			if (!isFromInvoiceSelection) {
				setValue("orderId", "");
				setValue("amount", 0);
			}
		}
	}, [clientId, setValue, getValues]);

	return (
		<div className="space-y-6 px-4">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2 w-full">
					<Label required htmlFor="orderId">
						Factura
					</Label>
					<Controller
						name="orderId"
						control={control}
						rules={{ required: "Debe seleccionar una factura" }}
						render={({ field }) => (
							<div className="space-y-1 w-full">
								<OrderWithDebtSelect
									className="w-full"
									value={String(field.value)}
									onChange={(order, remainingBalance) => {
										field.onChange(order?._id);
										if (order?.buyerId) {
											const buyerId =
												typeof order.buyerId === "string"
													? order.buyerId
													: order.buyerId._id;
											setValue("clientId", buyerId);
											setValue("amount", remainingBalance || 0);
										}
									}}
									filters={{ buyerId: clientId }}
									placeholder="Seleccionar factura con saldo pendiente"
								/>
							</div>
						)}
					/>
				</div>

				<div className="flex flex-col gap-y-2 w-full">
					<Label htmlFor="buyerId" required className="text-right">
						Cliente
					</Label>
					<Controller
						name="clientId"
						control={control}
						rules={{ required: "Debe seleccionar un cliente" }}
						render={({ field }) => (
							<div className="space-y-1 w-full">
								<ClientSelect
									className="w-full"
									value={String(field.value)}
									onChange={(client) => {
										field.onChange(client?._id);
										
										const currentOrderId = getValues("orderId");
										if (currentOrderId) {
											setValue("orderId", "");
											setValue("amount", 0);
										}
									}}
									placeholder="Seleccionar cliente"
								/>
							</div>
						)}
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label required htmlFor="amount">
						Monto
					</Label>
					<Input
						id="amount"
						type="number"
						step="0.01"
                        
						min="0"
						placeholder="Ingrese el monto a pagar"
						{...register("amount", {
							valueAsNumber: true,
							setValueAs: (v) => {
								// When empty string or null, return as-is (handled by RHF validation)
								if (v === "" || v === null || v === undefined) return v;
								const num = Number(v);
								if (Number.isNaN(num)) return v;
								// Round to 2 decimals
								return Math.round(num * 100) / 100;
							},
						})}
					/>
				</div>

				<div className="space-y-2">
					<Label required htmlFor="method">
						Método de Pago
					</Label>
					<Select value={watchedMethod} onValueChange={handleMethodChange}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Seleccionar método" />
						</SelectTrigger>
						<SelectContent>
							{paymentMethods.map((method) => (
								<SelectItem key={method.id} value={method.id}>
									{paymentMethodIcons[method.id] || unknownPaymentMethodIcon}
									{method.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2 col-span-2">
					<Label required htmlFor="date">
						Fecha del Pago
					</Label>
					<DatePicker
						classNames={{
							trigger: "w-full max-w-sm",
						}}
						format="PPPP"
						value={watchedDate}
						onValueChange={handleDateChange}
						placeholder="Seleccionar fecha"
					/>
				</div>
			</div>
		</div>
	);
}
