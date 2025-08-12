import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { cn, getTotalPages } from "@/lib/utils";
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
import { useOrderById } from "@/contexts/orders/queries";
import { useOrdersForSelect } from "@/contexts/orders/orderSelectQueries";
import type { OrderType } from "@/types/models/orders";
import { TAX_PERCENTAGE } from "@/config/shop";
import type { OrderFilters } from "@/contexts/orders/types";

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

interface OrderSelectProps {
	value?: string;
	defaultValue?: string;
	onChange?: (order: OrderType | null) => void;
	className?: string;
	placeholder?: string;
	disabled?: boolean;
	filters?: OrderFilters;
}

export function OrderSelect({
	value,
	defaultValue,
	onChange,
	className,
	placeholder = "Seleccionar factura",
	disabled = false,
	filters = {},
}: OrderSelectProps) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
	const [page, setPage] = useState(1);

	const debouncedSearch = useDebounce(searchTerm, 300);
	const lastSearchRef = useRef<string>("");
	const accumulatedOrdersRef = useRef<OrderType[]>([]);

	const shouldResetPagination = debouncedSearch !== lastSearchRef.current;

	const queryPage = shouldResetPagination ? 1 : page;

	const { data, isLoading, error } = useOrdersForSelect({
		search: debouncedSearch,
		page: queryPage,
		limit: 20,
		_filters: filters,
	});

	const currentOrders = data?.orders || [];
	const total = data?.total || 0;
	const totalPages = getTotalPages(total, 20);
	const hasMore = queryPage < totalPages;

	const allOrders = useMemo(() => {
		if (shouldResetPagination) {
			lastSearchRef.current = debouncedSearch;
			accumulatedOrdersRef.current = currentOrders;
			return currentOrders;
		}

		if (queryPage === 1) {
			accumulatedOrdersRef.current = currentOrders;
			return currentOrders;
		}

		const newOrders = [...accumulatedOrdersRef.current, ...currentOrders];
		accumulatedOrdersRef.current = newOrders;
		return newOrders;
	}, [currentOrders, queryPage, shouldResetPagination, debouncedSearch]);

	useEffect(() => {
		if (shouldResetPagination && page !== 1) {
			setPage(1);
		}
	}, [shouldResetPagination, page]);

	const selectedOrderId = value || defaultValue;
	const { data: selectedOrderData } = useOrderById(selectedOrderId || "");

	useEffect(() => {
		if (selectedOrderId) {
			const order = allOrders.find((o) => o._id === selectedOrderId);
			if (order) {
				setSelectedOrder(order);
			} else if (selectedOrderData) {
				setSelectedOrder(selectedOrderData);
			}
		} else {
			setSelectedOrder(null);
		}
	}, [selectedOrderId, allOrders, selectedOrderData]);

	const handleSelect = useCallback(
		(order: OrderType) => {
			setSelectedOrder(order);
			onChange?.(order);
			setOpen(false);
		},
		[onChange],
	);

	const handleClear = useCallback(() => {
		setSelectedOrder(null);
		onChange?.(null);
	}, [onChange]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			setOpen(false);
		}
	}, []);

	const displayValue = useMemo(() => {
		if (selectedOrder) {
			const sellerName =
				typeof selectedOrder.sellerId === "object"
					? `${selectedOrder.sellerId.firstName} ${selectedOrder.sellerId.lastName}`.trim()
					: "Desconocido";
			return `Factura #${selectedOrder.orderId || selectedOrder._id} - ${sellerName}`;
		}
		return placeholder;
	}, [selectedOrder, placeholder]);

	const loadMore = useCallback(() => {
		if (hasMore && !isLoading) {
			setPage((prev) => prev + 1);
		}
	}, [hasMore, isLoading]);

	const handleScroll = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
			if (
				scrollHeight - scrollTop <= clientHeight * 1.2 &&
				hasMore &&
				!isLoading
			) {
				loadMore();
			}
		},
		[hasMore, isLoading, loadMore],
	);

	const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
		e.currentTarget.scrollTop += e.deltaY;
	}, []);

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
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
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
				<Command shouldFilter={false} onKeyDown={handleKeyDown}>
					<div className="flex items-center border-b px-3">
						<Search className="mr-2 size-4 shrink-0 opacity-50" />
						<input
							placeholder="Buscar por número de factura"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
						/>
					</div>
					<CommandList
						onScroll={handleScroll}
						onWheel={handleWheel}
						className="max-h-[300px]"
					>
						{error && (
							<div className="p-4 text-center text-sm text-destructive">
								{error.message || "An error occurred"}
							</div>
						)}

						{allOrders.length === 0 && !isLoading && !error && (
							<CommandEmpty>
								{debouncedSearch
									? "Factura no encontrada."
									: "Escribe para buscar en las facturas..."}
							</CommandEmpty>
						)}

						{allOrders.length > 0 && (
							<CommandGroup>
								{allOrders.map((order) => (
									<CommandItem
										key={order._id}
										value={order._id}
										onSelect={() => handleSelect(order)}
										className="cursor-pointer"
									>
										<div className="flex items-center justify-between w-full">
											<div className="flex items-center">
												<Check
													className={cn(
														"mr-2 size-4",
														selectedOrder?._id === order._id
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												<div>
													<div className="font-medium">
														Factura #{order.orderId || order._id}
														{typeof order.sellerId === "object" && (
															<span className="text-muted-foreground">
																{" "}
																-{" "}
																{`${order.sellerId.firstName} ${order.sellerId.lastName}`.trim()}
															</span>
														)}
													</div>
													<div className="text-xs text-muted-foreground">
														${calculateOrderTotal(order).toFixed(2)}
													</div>
												</div>
											</div>
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						)}

						{isLoading && (
							<div className="flex items-center justify-center py-4">
								<Loader2 className="size-4 animate-spin mr-2" />
								<span className="text-sm text-muted-foreground">
									{allOrders.length === 0
										? "Cargando facturas..."
										: "Cargando más facturas..."}
								</span>
							</div>
						)}

						{!hasMore && allOrders.length > 0 && !isLoading && (
							<div className="text-center py-2 text-xs text-muted-foreground border-t">
								{allOrders.length === 1
									? "1 factura encontrada"
									: `${allOrders.length} facturas encontradas`}
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
							Clear selection
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
