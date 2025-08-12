import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Controller,
	type ControllerRenderProps,
	useFormContext,
} from "react-hook-form";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import { HelpCircleIcon, XIcon, RefreshCwIcon } from "lucide-react";
import {
	useLatestOrderId,
	useLatestCfSequence,
	useLatestNcfSequence,
} from "@/contexts/orders/queries";
import { ClientSelect } from "@/components/dashboard/clients/ClientSelect";

import type { OrderType } from "@/types/models/orders";
import { Spinner } from "@/components/ui/spinner";
import { DatePicker } from "@/components/ui/date-picker";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import type { ClientType } from "@/types/models/clients";
import { useEffect, useState, useRef } from "react";
import { OrderPaymentForm } from "./OrderPaymentForm";
import type { PaymentMethod } from "@/types/models/paymentHistory";
import { motion, AnimatePresence } from "motion/react";

type OrderFormData = Omit<Partial<OrderType>, "buyerId" | "sellerId"> & {
	buyerId: string;
	sellerId: string;
	payment?: {
		method: PaymentMethod;
		amount: number;
		date: Date;
	};
};

export type OrderProductWithDisplay = {
	productId: string;
	price: number;
	quantity: number;
	discount?: number;
	displayName: string;
	displayPrice: number;
};

interface CreateOrderFormProps {
	orderProducts?: OrderProductWithDisplay[];
}

export function CreateOrderForm({ orderProducts = [] }: CreateOrderFormProps) {
	const {
		control,
		setValue,
		watch,
		resetField,
		formState: { errors },
	} = useFormContext<OrderFormData>();

	const {
		data: latestOrderId,
		isLoading: isLoadingOrderId,
		error: orderIdError,
	} = useLatestOrderId();
	const {
		data: latestCfSequence,
		isLoading: isLoadingCfSequence,
		error: cfSequenceError,
	} = useLatestCfSequence();
	const {
		data: latestNcfSequence,
		isLoading: isLoadingNcfSequence,
		error: ncfSequenceError,
	} = useLatestNcfSequence();

	const isCredit = watch("isCredit");
	const cfSequenceValue = watch("cfSequence");
	const ncfSequenceValue = watch("ncfSequence");

	const [activeSequenceType, setActiveSequenceType] = useState<
		"cf" | "ncf" | null
	>(null);
	const [hasManuallyCleared, setHasManuallyCleared] = useState(false);
	const cfOnChangeRef = useRef<((value: number | undefined) => void) | null>(
		null,
	);
	const ncfOnChangeRef = useRef<((value: number | undefined) => void) | null>(
		null,
	);

	useEffect(() => {
		if (
			!hasManuallyCleared &&
			!activeSequenceType &&
			!cfSequenceValue &&
			!ncfSequenceValue
		) {
			if (latestCfSequence) {
				setValue("cfSequence", latestCfSequence);
				setActiveSequenceType("cf");
			} else if (latestNcfSequence) {
				setValue("ncfSequence", latestNcfSequence);
				setActiveSequenceType("ncf");
			}
		}
	}, [
		latestCfSequence,
		latestNcfSequence,
		activeSequenceType,
		cfSequenceValue,
		ncfSequenceValue,
		setValue,
		hasManuallyCleared,
	]);

	const clearAllSequences = () => {
		setHasManuallyCleared(true);
		if (cfOnChangeRef.current) cfOnChangeRef.current(undefined);
		if (ncfOnChangeRef.current) ncfOnChangeRef.current(undefined);
		resetField("cfSequence");
		resetField("ncfSequence");
		setValue("cfSequence", undefined);
		setValue("ncfSequence", undefined);
		setActiveSequenceType(null);
	};

	const handleLoadCfSequence = () => {
		if (latestCfSequence) {
			setValue("cfSequence", latestCfSequence);
			setValue("ncfSequence", undefined);
			setActiveSequenceType("cf");
			setHasManuallyCleared(false);
		}
	};

	const handleLoadNcfSequence = () => {
		if (latestNcfSequence) {
			setValue("ncfSequence", latestNcfSequence);
			setValue("cfSequence", undefined);
			setActiveSequenceType("ncf");
			setHasManuallyCleared(false);
		}
	};

	const handleCfSequenceChange = (value: number | undefined) => {
		if (value) {
			setValue("ncfSequence", undefined);
			setActiveSequenceType("cf");
		} else if (!ncfSequenceValue) {
			setActiveSequenceType(null);
		}
	};

	const handleNcfSequenceChange = (value: number | undefined) => {
		if (value) {
			setValue("cfSequence", undefined);
			setActiveSequenceType("ncf");
		} else if (!cfSequenceValue) {
			setActiveSequenceType(null);
		}
	};

	const handleClientSelect =
		(field: ControllerRenderProps<OrderFormData, "buyerId">) =>
		(client: ClientType | null) => {
			field.onChange(client ? client._id : "");
		};

	return (
		<div className="flex flex-col grow">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-5">
				<div className="flex flex-col gap-y-2">
					<Label htmlFor="orderId" required className="text-right">
						Id de la factura
						<Tooltip>
							<TooltipTrigger asChild>
								<HelpCircleIcon className="size-4 text-muted-foreground ml-1" />
							</TooltipTrigger>
							<TooltipContent>
								<p className="max-w-[25ch]">
									Este campo es <strong>generado automáticamente</strong> según
									la ultima factura. No se puede editar.
								</p>
							</TooltipContent>
						</Tooltip>
					</Label>
					<div className="flex items-center">
						<Input
							id="orderId"
							value={
								isLoadingOrderId ? "Cargando..." : latestOrderId || "Error"
							}
							readOnly
							disabled
							required
							className={orderIdError ? "border-destructive" : ""}
						/>
						{isLoadingOrderId && <Spinner className="ml-2" />}
					</div>
					{orderIdError && (
						<Alert variant="destructive" className="mt-2">
							<AlertCircleIcon className="size-4" />
							<AlertDescription>
								Error al cargar el ID de factura. Verifique la conexión.
							</AlertDescription>
						</Alert>
					)}
				</div>

				<div className="flex flex-col gap-y-2 sm:col-span-2">
					<Label htmlFor="date" required className="text-right">
						Fecha
					</Label>
					<Controller
						name="date"
						control={control}
						rules={{ required: "La fecha es requerida" }}
						defaultValue={new Date()}
						render={({ field: { value, onChange } }) => (
							<div className="space-y-1">
								<DatePicker
									value={value}
									format="PPPP"
									onValueChange={onChange}
									placeholder="Seleccionar fecha"
									className={cn(errors.date && "border-destructive")}
								/>
								{errors.date && (
									<p className="text-xs text-destructive flex items-center gap-1">
										<AlertCircleIcon className="h-3 w-3" />
										{errors.date.message}
									</p>
								)}
							</div>
						)}
					/>
				</div>

				<div className="flex flex-col gap-y-2 sm:col-span-2">
					<Label htmlFor="buyerId" required className="text-right">
						Cliente
					</Label>
					<Controller
						name="buyerId"
						control={control}
						rules={{ required: "Debe seleccionar un cliente" }}
						render={({ field }) => (
							<div className="space-y-1">
								<ClientSelect
									value={field.value}
									onChange={handleClientSelect(field)}
									className={cn(
										"w-full max-w-[280px]",
										errors.buyerId && "border-destructive",
									)}
								/>
								{errors.buyerId && (
									<p className="text-xs text-destructive flex items-center gap-1">
										<AlertCircleIcon className="h-3 w-3" />
										{errors.buyerId.message}
									</p>
								)}
							</div>
						)}
					/>
				</div>

				<div className="flex flex-col gap-y-2">
					<div className="flex items-center justify-between">
						<Label htmlFor="cfSequence" className="text-right">
							Secuencia CF
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<HelpCircleIcon className="size-4 text-muted-foreground ml-1" />
									</TooltipTrigger>
									<TooltipContent>
										<p className="max-w-[30ch]">
											Número de secuencia para Comprobante Fiscal. Solo se puede
											usar una secuencia a la vez.
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</Label>
						{latestCfSequence && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleLoadCfSequence}
								disabled={isLoadingCfSequence}
								className="flex items-center gap-1 h-8 px-2"
							>
								<RefreshCwIcon className="h-3 w-3" />
								Cargar
							</Button>
						)}
					</div>
					<Controller
						name="cfSequence"
						control={control}
						rules={{
							validate: (value) => {
								if (value !== undefined && value !== null && value < 1) {
									return "Debe ser un número mayor a 0";
								}
								return true;
							},
						}}
						render={({ field: { value, onChange } }) => {
							cfOnChangeRef.current = onChange;

							return (
								<div className="space-y-1">
									<div className="relative">
										<Input
											id="cfSequence"
											type="number"
											value={value || ""}
											placeholder={
												isLoadingCfSequence
													? "Cargando..."
													: activeSequenceType === "ncf"
														? "Deshabilitado (NCF activo)"
														: "Ej: 001"
											}
											min="1"
											disabled={
												isLoadingCfSequence || activeSequenceType === "ncf"
											}
											className={cn(
												errors.cfSequence && "border-destructive",
												activeSequenceType === "ncf" &&
													"bg-muted cursor-not-allowed",
												(value || value === 0) && "pr-8",
											)}
											onChange={(e) => {
												const newValue = e.target.value
													? Number(e.target.value)
													: undefined;
												onChange(newValue);
												handleCfSequenceChange(newValue);
											}}
										/>
										{isLoadingCfSequence && (
											<Spinner className="absolute right-2 top-1/2 transform -translate-y-1/2" />
										)}
										{(value || value === 0) && !isLoadingCfSequence && (
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													clearAllSequences();
												}}
												className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
											>
												<XIcon className="h-3 w-3" />
											</Button>
										)}
									</div>
									{errors.cfSequence && (
										<p className="text-xs text-destructive flex items-center gap-1">
											<AlertCircleIcon className="h-3 w-3" />
											{errors.cfSequence.message}
										</p>
									)}
									{cfSequenceError && (
										<p className="text-xs text-yellow-600 flex items-center gap-1">
											<AlertCircleIcon className="h-3 w-3" />
											Error al cargar secuencia
										</p>
									)}
								</div>
							);
						}}
					/>
				</div>

				<div className="flex flex-col gap-y-2">
					<div className="flex items-center justify-between">
						<Label htmlFor="ncfSequence" className="text-right">
							Secuencia NCF
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<HelpCircleIcon className="size-4 text-muted-foreground ml-1" />
									</TooltipTrigger>
									<TooltipContent>
										<p className="max-w-[30ch]">
											Número de secuencia para Número de Comprobante Fiscal.
											Solo se puede usar una secuencia a la vez.
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</Label>
						{latestNcfSequence && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={handleLoadNcfSequence}
								disabled={isLoadingNcfSequence}
								className="flex items-center gap-1 h-8 px-2"
							>
								<RefreshCwIcon className="h-3 w-3" />
								Cargar
							</Button>
						)}
					</div>
					<Controller
						name="ncfSequence"
						control={control}
						rules={{
							validate: (value) => {
								if (value !== undefined && value !== null && value < 1) {
									return "Debe ser un número mayor a 0";
								}
								return true;
							},
						}}
						render={({ field: { value, onChange } }) => {
							ncfOnChangeRef.current = onChange;

							return (
								<div className="space-y-1">
									<div className="relative">
										<Input
											id="ncfSequence"
											type="number"
											value={value || ""}
											placeholder={
												isLoadingNcfSequence
													? "Cargando..."
													: activeSequenceType === "cf"
														? "Deshabilitado (CF activo)"
														: "Ej: 001"
											}
											min="1"
											disabled={
												isLoadingNcfSequence || activeSequenceType === "cf"
											}
											className={cn(
												errors.ncfSequence && "border-destructive",
												activeSequenceType === "cf" &&
													"bg-muted cursor-not-allowed",
												(value || value === 0) && "pr-8",
											)}
											onChange={(e) => {
												const newValue = e.target.value
													? Number(e.target.value)
													: undefined;
												onChange(newValue);
												handleNcfSequenceChange(newValue);
											}}
										/>
										{isLoadingNcfSequence && (
											<Spinner className="absolute right-2 top-1/2 transform -translate-y-1/2" />
										)}
										{(value || value === 0) && !isLoadingNcfSequence && (
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													clearAllSequences();
												}}
												className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
											>
												<XIcon className="h-3 w-3" />
											</Button>
										)}
									</div>
									{errors.ncfSequence && (
										<p className="text-xs text-destructive flex items-center gap-1">
											<AlertCircleIcon className="h-3 w-3" />
											{errors.ncfSequence.message}
										</p>
									)}
									{ncfSequenceError && (
										<p className="text-xs text-yellow-600 flex items-center gap-1">
											<AlertCircleIcon className="h-3 w-3" />
											Error al cargar secuencia
										</p>
									)}
								</div>
							);
						}}
					/>
				</div>
				<div className="flex flex-col gap-y-2 sm:col-span-2 mt-4">
					<Label htmlFor="orderId" required className="text-right">
						Factura a crédito
					</Label>
					<div className="flex items-center">
						<FormField
							control={control}
							name="isCredit"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
									<div className="space-y-0.5">
										<FormLabel>Factura a crédito</FormLabel>
										<FormDescription>
											Determina si la factura se puede pagar a crédito.
										</FormDescription>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</div>
				</div>

				{/* Payment Form - Only show when not on credit */}
				<AnimatePresence mode="wait">
					{!isCredit && orderProducts.length > 0 && (
						<motion.div
							className="sm:col-span-2"
							initial={{ opacity: 0, height: 0, marginTop: 0 }}
							animate={{
								opacity: 1,
								height: "auto",
								marginTop: "1rem",
								transition: {
									duration: 0.4,
									ease: "easeInOut",
									opacity: { delay: 0.1 },
								},
							}}
							exit={{
								opacity: 0,
								height: 0,
								marginTop: 0,
								transition: {
									duration: 0.3,
									ease: "easeInOut",
								},
							}}
						>
							<motion.div
								initial={{ y: 20, opacity: 0 }}
								animate={{
									y: 0,
									opacity: 1,
									transition: {
										delay: 0.2,
										duration: 0.3,
									},
								}}
								exit={{ y: -20, opacity: 0 }}
							>
								<OrderPaymentForm orderProducts={orderProducts} />
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
