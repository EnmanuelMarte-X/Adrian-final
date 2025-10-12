import { useState, useEffect, useCallback, useMemo } from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import type { OrderType } from "@/types/models/orders";
import { TAX_PERCENTAGE } from "@/config/shop";
import type { OrderFilters } from "@/contexts/orders/types";
import { currencyFormat } from "@/config/formats";

const calculateOrderTotal = (order: OrderType): number => {
	const subtotal =
		order?.products?.reduce((total, product) => {
			return total + product.price * product.quantity;
		}, 0) ?? 0;
	const totalDiscount =
		order?.products?.reduce((totalDiscount, product) => {
			return totalDiscount + (product.discount || 0);
		}, 0) ?? 0;
	const tax = subtotal * TAX_PERCENTAGE;
	const total = subtotal - totalDiscount + tax;
	return total;
};

interface OrderWithDebt {
	order: OrderType;
	remainingBalance: number;
}

interface OrderWithDebtSelectProps {
	value?: string;
	defaultValue?: string;
	onChange?: (order: OrderType | null, remainingBalance?: number) => void;
	className?: string;
	placeholder?: string;
	disabled?: boolean;
	filters?: OrderFilters;
}

export function OrderWithDebtSelect({
	value,
	defaultValue,
	onChange,
	className,
	placeholder = "Seleccionar factura",
	disabled = false,
	filters = {},
}: OrderWithDebtSelectProps) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [ordersWithDebt, setOrdersWithDebt] = useState<OrderWithDebt[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedOrder, setSelectedOrder] = useState<OrderWithDebt | null>(null);

	const debouncedSearch = useDebounce(searchTerm, 300);

	// Cargar facturas con saldo pendiente
	const loadOrdersWithDebt = useCallback(async () => {
		setIsLoading(true);
		try {
			// Primero obtener todas las órdenes
			const params = new URLSearchParams();
			params.set("page", "1");
			params.set("limit", "1000"); // Obtener todas para poder filtrar

			if (filters.buyerId) {
				params.set("filters", JSON.stringify({ buyerId: filters.buyerId }));
			}

			if (debouncedSearch?.trim()) {
				// Para la búsqueda, usamos un parámetro específico
				params.set("search", debouncedSearch.trim());
			}

			const ordersResponse = await fetch(`/api/orders?${params.toString()}`);
			
			if (!ordersResponse.ok) {
				throw new Error('Failed to fetch orders');
			}

			const { data: orders } = await ordersResponse.json();

			// Para cada orden, obtener los pagos y calcular el saldo pendiente
			const ordersWithDebtPromises = orders.map(async (order: OrderType) => {
				try {
					const paymentsResponse = await fetch(`/api/payment-history/order/${order._id}`);
					const payments = paymentsResponse.ok ? await paymentsResponse.json() : [];
					
					const orderTotal = calculateOrderTotal(order);
					const totalPaid = payments.reduce((acc: number, payment: any) => acc + payment.amount, 0);
					const remainingBalance = Math.max(0, orderTotal - totalPaid);

					return {
						order,
						remainingBalance
					};
				} catch (error) {
					console.error(`Error fetching payments for order ${order._id}:`, error);
					// Si falla obtener los pagos, asumir que toda la factura está pendiente
					return {
						order,
						remainingBalance: calculateOrderTotal(order)
					};
				}
			});

			const allOrdersWithDebt = await Promise.all(ordersWithDebtPromises);
			
			// Filtrar solo las que tienen saldo pendiente
			const filteredOrders = allOrdersWithDebt.filter(item => item.remainingBalance > 0);
			
			setOrdersWithDebt(filteredOrders);
		} catch (error) {
			console.error('Error loading orders with debt:', error);
			setOrdersWithDebt([]);
		} finally {
			setIsLoading(false);
		}
	}, [filters, debouncedSearch]);

	useEffect(() => {
		loadOrdersWithDebt();
	}, [loadOrdersWithDebt]);

	// Manejar la selección inicial basada en value o defaultValue
	useEffect(() => {
		const targetValue = value || defaultValue;
		if (targetValue && ordersWithDebt.length > 0) {
			const found = ordersWithDebt.find(item => item.order._id === targetValue);
			setSelectedOrder(found || null);
		} else {
			setSelectedOrder(null);
		}
	}, [value, defaultValue, ordersWithDebt]);

	const handleSelect = useCallback(
		(orderWithDebt: OrderWithDebt) => {
			setSelectedOrder(orderWithDebt);
			onChange?.(orderWithDebt.order, orderWithDebt.remainingBalance);
			setOpen(false);
			setSearchTerm("");
		},
		[onChange],
	);

	const handleClear = useCallback(() => {
		setSelectedOrder(null);
		onChange?.(null);
		setSearchTerm("");
	}, [onChange]);

	const displayValue = useMemo(() => {
		if (selectedOrder) {
			return `Factura #${selectedOrder.order.orderId || selectedOrder.order._id} - ${currencyFormat.format(selectedOrder.remainingBalance)} pendiente`;
		}
		return placeholder;
	}, [selectedOrder, placeholder]);

	const handleOpenChange = useCallback((newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			setSearchTerm("");
		}
	}, []);

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("justify-between", className)}
					disabled={disabled}
				>
					<span className="truncate">{displayValue}</span>
					<ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[400px] p-0" align="start">
				<Command shouldFilter={false}>
					<div className="flex items-center border-b px-3">
						<Search className="mr-2 size-4 shrink-0 opacity-50" />
						<input
							placeholder="Buscar por número de factura"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
					<CommandList className="max-h-[300px]">
						{ordersWithDebt.length === 0 && !isLoading && (
							<CommandEmpty>
								{debouncedSearch
									? "No se encontraron facturas con saldo pendiente."
									: "No hay facturas con saldo pendiente."}
							</CommandEmpty>
						)}

						{ordersWithDebt.length > 0 && (
							<div className="p-1">
								{ordersWithDebt.map((orderWithDebt) => (
								<div
									key={orderWithDebt.order._id}
									onClick={() => handleSelect(orderWithDebt)}
									className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground"
								>
										<div className="flex items-center justify-between w-full">
											<div className="flex items-center">
												<Check
													className={cn(
														"mr-2 size-4",
														selectedOrder?.order._id === orderWithDebt.order._id
															? "opacity-100"
															: "opacity-0",
													)}
												/>
													<div>
														<div className="font-medium">
															Factura #{orderWithDebt.order.orderId || orderWithDebt.order._id}
															{typeof orderWithDebt.order.sellerId === "object" && (
																<span className="text-muted-foreground">
																	{" "}
																	-{" "}
																	{`${orderWithDebt.order.sellerId.firstName} ${orderWithDebt.order.sellerId.lastName}`.trim()}
																</span>
															)}
														</div>
														<div className="text-xs text-muted-foreground opacity-70">
															{currencyFormat.format(orderWithDebt.remainingBalance)}
														</div>
													</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{isLoading && (
							<div className="flex items-center justify-center py-4">
								<Loader2 className="size-4 animate-spin mr-2" />
								<span className="text-sm text-muted-foreground">
									Calculando saldos pendientes...
								</span>
							</div>
						)}

						{!isLoading && ordersWithDebt.length > 0 && (
							<div className="text-center py-2 text-xs text-muted-foreground border-t">
								{ordersWithDebt.length === 1
									? "1 factura con saldo pendiente"
									: `${ordersWithDebt.length} facturas con saldo pendiente`}
							</div>
						)}
					</CommandList>
				</Command>
				{selectedOrder && (
					<div className="border-t p-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleClear}
							className="w-full text-xs"
						>
							Limpiar selección
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}