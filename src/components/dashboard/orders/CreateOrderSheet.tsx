import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { PlusIcon, ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { CreateOrderForm } from "./CreateOrderForm";
import { OrderProductsForm } from "./OrderProductsForm";
import { OrderPaymentForm } from "./OrderPaymentForm";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { useCreateOrderMutation } from "@/contexts/orders/queries";
import type { OrderProduct, OrderType } from "@/types/models/orders";
import type { OrderProductWithDisplay } from "./OrderProductsForm";
import { motion, AnimatePresence } from "motion/react";
import useFormPersist from "react-hook-form-persist";
import { useSession } from "next-auth/react";
import type { PaymentMethod } from "@/types/models/paymentHistory";
import { isValidObjectId } from "@/lib/utils";

type OrderFormData = Omit<Partial<OrderType>, "buyerId" | "sellerId"> & {
	buyerId: string;
	sellerId: string;
	payment?: {
		method: PaymentMethod;
		amount: number;
		date: Date;
	};
};

const stepsHeader = {
	"order-info": {
		title: "Información de la factura",
	},
	"add-products": {
		title: "Agregar productos",
	},
	"payment-info": {
		title: "Información de pago",
	},
};

export function CreateOrderSheet({ children }: { children?: React.ReactNode }) {
	const { data: session } = useSession();
	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState<
		"order-info" | "add-products" | "payment-info"
	>("order-info");
	const [isHoveringSteps, setIsHoveringSteps] = useState(false);
	const [orderProducts, setOrderProducts] = useState<OrderProductWithDisplay[]>(
		[],
	);

	const form = useForm<OrderFormData>({
		defaultValues: {
			date: new Date(),
			buyerId: "",
			sellerId: session?.user.id,
			cfSequence: undefined,
			ncfSequence: undefined,
			products: [] as OrderProduct[],
		},
	});

	const { handleSubmit, reset, setValue, watch, getValues } = form;
	useFormPersist("order-form", { watch, setValue });

	const { mutateAsync: createOrder, isPending } = useCreateOrderMutation({
		onSuccess: () => {
			resetAll();
			setIsOpen(false);
		},
	});

	const resetAll = () => {
		setStep("order-info");
		setOrderProducts([]);
		reset();
	};

	const handleClose = () => {
		setIsOpen(false);
		resetAll();
	};

	const validateOrderInfo = (values: OrderFormData) => {
		if (!values.buyerId) {
			toast.error("Debe seleccionar un comprador");
			return false;
		}

		if (!values.sellerId) {
			setValue("sellerId", "000000000000000000000000");
		}

		if (!values.date) {
			toast.error("Debe ingresar una fecha válida");
			return false;
		}

		if (!isValidObjectId(values.buyerId)) {
			toast.error("El comprador debe ser un cliente válido.");
			return false;
		}

		if (!isValidObjectId(values.sellerId)) {
			toast.error("El vendedor debe ser un usuario válido.");
			return false;
		}

		return true;
	};

	const validateProducts = () => {
		if (!orderProducts || orderProducts.length === 0) {
			toast.error("Debe agregar al menos un producto a la factura");
			return false;
		}
		return true;
	};

	const validatePayment = (data: OrderFormData) => {
		if (!data.isCredit) {
			if (!data.payment) {
				toast.error(
					"Debe completar la información de pago para facturas que no son a crédito",
				);
				return false;
			}
			if (!data.payment.method) {
				toast.error("Debe seleccionar un método de pago");
				return false;
			}
			if (!data.payment.amount || data.payment.amount <= 0) {
				toast.error("Debe ingresar un monto de pago válido");
				return false;
			}
			if (!data.payment.date) {
				toast.error("Debe ingresar una fecha de pago");
				return false;
			}
		}
		return true;
	};

	const handleNextStep = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (step === "order-info") {
			if (validateOrderInfo(getValues())) {
				setStep("add-products");
			}
		} else if (step === "add-products") {
			if (validateProducts()) {
				const isCredit = getValues("isCredit");
				if (isCredit) {
					handleSubmit(onSubmit)();
				} else {
					setStep("payment-info");
				}
			}
		}
	};

	const handleBackStep = () => {
		if (step === "payment-info") {
			setStep("add-products");
		} else if (step === "add-products") {
			setStep("order-info");
		}
	};

	const isFirstStep = step === "order-info";
	const handleSheetOpenChange = (open: boolean) => setIsOpen(open);

	const handleProductsChange = (products: OrderProductWithDisplay[]) => {
		setOrderProducts(products);
		const orderProducts = products.map((p) => ({
			productId: p.productId,
			price: p.price,
			quantity: p.quantity,
			discount: p.discount || 0,
		}));

		setValue("products", orderProducts);
	};

	const onSubmit = async (data: OrderFormData) => {
		try {
			if (!validateProducts()) {
				return;
			}

			if (!validatePayment(data)) {
				return;
			}

			const latestOrderResponse = await fetch("/api/orders/latest-id");
			if (!latestOrderResponse.ok) {
				const errorText = await latestOrderResponse.text();
				toast.error(`No se pudo obtener el ID de la factura: ${errorText}`);
				return;
			}
			const { orderId: latestOrderId } = await latestOrderResponse.json();

			const { products, payment, ...restData } = data;
			const orderData = {
				...restData,
				products: products,
				orderId: latestOrderId,
				date: new Date(data.date || new Date()),
			};

			toast.promise(
				(async () => {
					const createdOrder = await createOrder(orderData as OrderType);

					if (!data.isCredit && payment && createdOrder) {
						const paymentData = {
							orderId: createdOrder._id || createdOrder.orderId.toString(),
							clientId: data.buyerId,
							amount: payment.amount,
							method: payment.method,
							date: new Date(payment.date),
						};

						const paymentResponse = await fetch("/api/payment-history", {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify(paymentData),
						});

						if (!paymentResponse.ok) {
							throw new Error("Error al registrar el pago");
						}
					}

					return createdOrder;
				})(),
				{
					loading: data.isCredit
						? "Creando factura..."
						: "Creando factura y registrando pago...",
					success: data.isCredit
						? "Factura creada exitosamente!"
						: "Factura y pago registrados exitosamente!",
					error: (error) => {
						console.error("Error creating order:", error);
						const message = error?.message || "Error desconocido";
						return `Error: ${message}`;
					},
				},
			);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Error desconocido";
			toast.error(`Error al procesar la información: ${errorMessage}`);
		}
	};

	return (
		<Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
			<SheetTrigger asChild>
				{children ? (
					children
				) : (
					<Button className="shadow-md">
						<PlusIcon className="size-4" /> Crear factura
					</Button>
				)}
			</SheetTrigger>
			<SheetContent className="sm:min-w-lg w-full overflow-y-auto">
				<SheetHeader className="pb-0">
					<SheetTitle>{stepsHeader[step].title}</SheetTitle>
					<SheetDescription>
						{step === "add-products"
							? watch("isCredit")
								? 'Agrega los productos de la factura y haz clic en "Crear factura" para finalizar.'
								: "Agrega los productos de la factura y continúa al paso de pago."
							: step === "order-info"
								? 'Ingresa la información básica de la nueva factura y haz clic en "Siguiente" para agregar productos.'
								: 'Como la factura no es a crédito, ingresa los detalles del pago y haz clic en "Crear factura".'}
					</SheetDescription>
					<motion.div
						className="grid gap-x-1 min-h-6 place-content-center mt-1"
						onMouseEnter={() => setIsHoveringSteps(true)}
						onMouseLeave={() => setIsHoveringSteps(false)}
						animate={{
							gridTemplateColumns: watch("isCredit")
								? "1fr 1fr"
								: "1fr 1fr 1fr",
						}}
						transition={{ duration: 0.4, ease: "easeInOut" }}
					>
						{(["order-info", "add-products", "payment-info"] as const).map(
							(stepKey) => {
								const isCredit = watch("isCredit");
								const shouldShow = stepKey !== "payment-info" || !isCredit;
								const isActive = step === stepKey;
								const isPassed =
									(stepKey === "order-info" &&
										(step === "add-products" || step === "payment-info")) ||
									(stepKey === "add-products" && step === "payment-info");

								return (
									<AnimatePresence key={stepKey} mode="popLayout">
										{shouldShow && (
											<motion.span
												layout
												initial={{ opacity: 0, scaleX: 0, scaleY: 0.5 }}
												animate={{
													opacity: 1,
													scaleX: 1,
													scaleY: 1,
													height: isHoveringSteps ? "1.5rem" : "0.25rem",
												}}
												exit={{ opacity: 0, scaleX: 0, scaleY: 0.5 }}
												transition={{ duration: 0.35, ease: "easeInOut" }}
												className={`flex items-center justify-center ${
													isActive
														? "bg-primary"
														: isPassed
															? "bg-primary/60"
															: "bg-muted"
												} ${
													stepKey === "order-info"
														? "rounded-l-full"
														: stepKey === "payment-info" ||
																(stepKey === "add-products" && isCredit)
															? "rounded-r-full"
															: ""
												} overflow-hidden relative`}
											>
												<AnimatePresence>
													{isHoveringSteps && (
														<motion.span
															initial={{ opacity: 0, y: 5 }}
															animate={{ opacity: 1, y: 0 }}
															exit={{ opacity: 0, y: -5 }}
															transition={{ duration: 0.15 }}
															className={`${
																isActive
																	? "text-primary-foreground font-medium"
																	: isPassed
																		? "text-white font-medium"
																		: "text-muted-foreground"
															} text-[0.68rem] absolute inset-0 flex items-center justify-center`}
														>
															{stepsHeader[stepKey].title}
														</motion.span>
													)}
												</AnimatePresence>
											</motion.span>
										)}
									</AnimatePresence>
								);
							},
						)}
					</motion.div>
				</SheetHeader>

				<FormProvider {...form}>
					<form
						id="create-order"
						className="grow"
						onSubmit={handleSubmit(onSubmit)}
					>
						<AnimatePresence mode="wait">
							<motion.div
								key={step}
								initial={{ opacity: 0, x: isFirstStep ? -20 : 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: isFirstStep ? -20 : 20 }}
								transition={{ duration: 0.2 }}
							>
								{step === "order-info" ? (
									<CreateOrderForm orderProducts={orderProducts} />
								) : step === "add-products" ? (
									<div className="px-5">
										<OrderProductsForm
											onProductsChange={handleProductsChange}
											initialProducts={orderProducts}
										/>
									</div>
								) : (
									<div className="px-5">
										<OrderPaymentForm orderProducts={orderProducts} />
									</div>
								)}
							</motion.div>
						</AnimatePresence>
					</form>
				</FormProvider>

				<SheetFooter className="grid grid-cols-2 gap-2 items-start mt-6">
					{step === "order-info" ? (
						<>
							<Button
								type="button"
								onClick={handleNextStep}
								className="flex items-center gap-2"
								form=""
							>
								Agregar productos <ArrowRight size={16} />
							</Button>
							<Button type="button" variant="ghost" onClick={handleClose}>
								Cancelar
							</Button>
						</>
					) : step === "add-products" ? (
						<>
							<Button
								type="button"
								onClick={handleNextStep}
								className="flex items-center gap-2"
								form=""
							>
								{getValues("isCredit") ? (
									<>
										{isPending && <Spinner className="w-4 h-4" />}
										{isPending ? "Creando factura..." : "Crear factura"}
									</>
								) : (
									<>
										Continuar <ArrowRight size={16} />
									</>
								)}
							</Button>
							<Button
								variant="outline"
								onClick={handleBackStep}
								className="flex items-center gap-2"
								type="button"
								disabled={isPending}
							>
								<ArrowLeft size={16} /> Atrás
							</Button>
						</>
					) : (
						<>
							<Button
								type="submit"
								disabled={isPending}
								className="flex items-center gap-2"
								form="create-order"
							>
								{isPending && <Spinner className="w-4 h-4" />}
								{isPending ? "Creando factura..." : "Crear factura"}
							</Button>
							<Button
								variant="outline"
								onClick={handleBackStep}
								className="flex items-center gap-2"
								type="button"
								disabled={isPending}
							>
								<ArrowLeft size={16} /> Atrás
							</Button>
						</>
					)}
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
