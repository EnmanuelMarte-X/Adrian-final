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
	} = useFormContext<OrderFormData>();

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

	// Set payment amount equal to total automatically
	useEffect(() => {
		if (totals.totalNumber > 0) {
			setValue("payment.amount", totals.totalNumber);
		}
	}, [totals.totalNumber, setValue]);

		return (
			<div className="space-y-3 border-t pt-3 mt-3">
				<h3 className="text-base font-medium">Información de pago</h3>				<div className="bg-muted/30 rounded p-3 space-y-1">
					<h4 className="font-medium text-xs">Resumen</h4>
					<div className="space-y-0.5 text-xs">
						<div className="flex justify-between">
							<span>Subtotal:</span>
							<span>RD$ {totals.subtotal}</span>
						</div>
						<div className="flex justify-between">
							<span>ITBIS:</span>
							<span>RD$ {totals.taxes}</span>
						</div>
						<div className="flex justify-between font-medium border-t pt-1">
							<span>Total:</span>
							<span>RD$ {totals.total}</span>
						</div>
					</div>
				</div>				<div className="grid grid-cols-2 gap-3">
					<div className="flex flex-col gap-y-1">
						<Label htmlFor="paymentMethod" className="text-xs" required>
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
											"w-full h-8 text-xs",
											errors.payment?.method && "border-destructive",
										)}
									>
										<SelectValue placeholder="Seleccionar" />
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
											? new Date(field.value.getTime() - field.value.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
											: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
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
