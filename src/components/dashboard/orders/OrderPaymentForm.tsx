import { Label } from "@/components/ui/label";
import { Controller, useFormContext } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { paymentMethods } from "@/contexts/paymentHistory/payment-method";
import { AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TAX_PERCENTAGE } from "@/config/shop";
import type { PaymentMethod } from "@/types/models/paymentHistory";
import { useMemo, useEffect } from "react";

type OrderFormData = {
	buyerId: string;
	sellerId: string;
	date: Date;
	isCredit: boolean;
	cfSequence?: number;
	ncfSequence?: number;
	products: Array<{
		productId: string;
		price: number;
		quantity: number;
		discount?: number;
	}>;
	payment?: {
		method: PaymentMethod;
		amount: number;
		date: Date;
	};
};

interface OrderPaymentFormProps {
	orderProducts: Array<{
		productId: string;
		price: number;
		quantity: number;
		discount?: number;
	}>;
}

export function OrderPaymentForm({ orderProducts }: OrderPaymentFormProps) {
	const {
		control,
		formState: { errors },
		setValue,
		watch,
	} = useFormContext<OrderFormData>();

	const paymentAmount = watch("payment.amount");

	const totals = useMemo(() => {
		const subtotal = orderProducts.reduce((acc, product) => {
			const productTotal = product.price * product.quantity;
			const discountAmount = productTotal * ((product.discount || 0) / 100);
			return acc + (productTotal - discountAmount);
		}, 0);

		const taxes = subtotal * TAX_PERCENTAGE;
		const total = subtotal + taxes;

		return {
			subtotal: subtotal.toFixed(2),
			taxes: taxes.toFixed(2),
			total: total.toFixed(2),
			totalNumber: total,
		};
	}, [orderProducts]);

	// Set default payment amount when totals change
	useEffect(() => {
		if (totals.totalNumber > 0 && !paymentAmount) {
			setValue("payment.amount", totals.totalNumber);
		}
	}, [totals.totalNumber, paymentAmount, setValue]);

	return (
		<div className="space-y-4 border-t pt-4 mt-4">
			<div className="space-y-2">
				<h3 className="text-lg font-medium">Información de pago</h3>
				<p className="text-sm text-muted-foreground">
					Como esta factura no es a crédito, debe registrar el pago.
				</p>
			</div>

			<div className="bg-muted/50 rounded-lg p-4 space-y-2">
				<h4 className="font-medium text-sm">Resumen de la factura</h4>
				<div className="space-y-1 text-sm">
					<div className="flex justify-between">
						<span>Subtotal:</span>
						<span>RD$ {totals.subtotal}</span>
					</div>
					<div className="flex justify-between">
						<span>Impuestos ({(TAX_PERCENTAGE * 100).toFixed(0)}%):</span>
						<span>RD$ {totals.taxes}</span>
					</div>
					<hr className="border-border" />
					<div className="flex justify-between font-medium">
						<span>Total:</span>
						<span>RD$ {totals.total}</span>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="paymentMethod" required>
						Método de pago
					</Label>
					<Controller
						name="payment.method"
						control={control}
						rules={{ required: "Debe seleccionar un método de pago" }}
						render={({ field }) => (
							<div className="space-y-1">
								<Select
									value={field.value || ""}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										className={cn(
											"w-full",
											errors.payment?.method && "border-destructive",
										)}
									>
										<SelectValue placeholder="Seleccionar método" />
									</SelectTrigger>
									<SelectContent>
										{paymentMethods.map((method) => (
											<SelectItem key={method.id} value={method.id}>
												{method.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.payment?.method && (
									<p className="text-xs text-destructive flex items-center gap-1">
										<AlertCircleIcon className="h-3 w-3" />
										{errors.payment.method.message}
									</p>
								)}
							</div>
						)}
					/>
				</div>

				<div className="flex flex-col gap-y-2">
					<Label htmlFor="paymentAmount" required>
						Monto pagado
					</Label>
					<Controller
						name="payment.amount"
						control={control}
						rules={{
							required: "El monto es requerido",
							min: {
								value: 0.01,
								message: "El monto debe ser mayor a 0",
							},
							max: {
								value: totals.totalNumber,
								message: "El monto no puede ser mayor al total",
							},
						}}
						render={({ field }) => (
							<div className="space-y-1">
								<Input
									id="paymentAmount"
									type="number"
									step="0.01"
									min="0.01"
									max={totals.totalNumber}
									placeholder="0.00"
									value={field.value || ""}
									onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
									className={cn(errors.payment?.amount && "border-destructive")}
								/>
								{errors.payment?.amount && (
									<p className="text-xs text-destructive flex items-center gap-1">
										<AlertCircleIcon className="h-3 w-3" />
										{errors.payment.amount.message}
									</p>
								)}
							</div>
						)}
					/>
				</div>

				<div className="flex flex-col gap-y-2 sm:col-span-2">
					<Label htmlFor="paymentDate" required>
						Fecha de pago
					</Label>
					<Controller
						name="payment.date"
						control={control}
						rules={{ required: "La fecha de pago es requerida" }}
						defaultValue={new Date()}
						render={({ field }) => (
							<div className="space-y-1">
								<Input
									id="paymentDate"
									type="datetime-local"
									value={
										field.value
											? new Date(field.value).toISOString().slice(0, 16)
											: ""
									}
									onChange={(e) => field.onChange(new Date(e.target.value))}
									className={cn(
										"max-w-[280px]",
										errors.payment?.date && "border-destructive",
									)}
								/>
								{errors.payment?.date && (
									<p className="text-xs text-destructive flex items-center gap-1">
										<AlertCircleIcon className="h-3 w-3" />
										{errors.payment.date.message}
									</p>
								)}
							</div>
						)}
					/>
				</div>
			</div>
		</div>
	);
}
