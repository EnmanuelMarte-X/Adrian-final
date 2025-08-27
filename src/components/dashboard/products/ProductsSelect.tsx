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
import type { ProductStorageType, ProductType } from "@/types/models/products";

interface ProductsSelectProps {
	value?: string;
	defaultValue?: string;
	onChange?: (product: ProductType | null) => void;
	className?: string;
	placeholder?: string;
	disabled?: boolean;
}

const useInfiniteProducts = (search: string) => {
	const [products, setProducts] = useState<ProductType[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	const [error, setError] = useState<string | null>(null);

	const loadProducts = useCallback(
		async (searchTerm: string, pageNum: number, reset = false) => {
			setIsLoading(true);
			setError(null);

			try {
				const params = new URLSearchParams({
					page: pageNum.toString(),
					limit: "20",
				});

				if (searchTerm.trim()) {
					params.append("name", searchTerm.trim());
				}

				const response = await fetch(`/api/products?${params.toString()}`);

				if (!response.ok) {
					throw new Error(`Error ${response.status}: ${response.statusText}`);
				}

				const data = await response.json();

				if (reset) {
					setProducts(data.data || []);
				} else {
					setProducts((prev) => [...prev, ...(data.data || [])]);
				}

				// Calculate if there are more pages
				const totalPages = Math.ceil((data.total || 0) / 20);
				setHasMore(pageNum < totalPages);
			} catch (error) {
				console.error("Error loading products:", error);
				setError(error instanceof Error ? error.message : "Error desconocido");
				if (reset) {
					setProducts([]);
				}
				setHasMore(false);
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	useEffect(() => {
		setPage(1);
		setHasMore(true);
		loadProducts(search, 1, true);
	}, [search, loadProducts]);

	const loadMore = useCallback(() => {
		if (!isLoading && hasMore) {
			const nextPage = page + 1;
			setPage(nextPage);
			loadProducts(search, nextPage, false);
		}
	}, [isLoading, hasMore, page, search, loadProducts]);

	return { products, isLoading, hasMore, loadMore, error };
};

export function ProductsSelect({
	value,
	defaultValue,
	onChange,
	className,
	placeholder = "Seleccionar producto...",
	disabled = false,
}: ProductsSelectProps) {
	const [open, setOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
		null,
	);

	const debouncedSearch = useDebounce(searchTerm, 300);
	const { products, isLoading, hasMore, loadMore, error } =
		useInfiniteProducts(debouncedSearch);

	useEffect(() => {
		const productId = value || defaultValue;
		if (productId) {
			const product = products.find((p) => p._id === productId);
			if (product) {
				setSelectedProduct(product);
			} else if (products.length === 0 && !isLoading) {
				fetch(`/api/products/${productId}`)
					.then((res) => (res.ok ? res.json() : null))
					.then((data) => {
						if (data) {
							setSelectedProduct(data);
						}
					})
					.catch(console.error);
			}
		} else {
			setSelectedProduct(null);
		}
	}, [value, defaultValue, products, isLoading]);

	const handleSelect = useCallback(
		(product: ProductType) => {
			setSelectedProduct(product);
			onChange?.(product);
			setOpen(false);
			setSearchTerm("");
		},
		[onChange],
	);

	const handleClear = useCallback(() => {
		setSelectedProduct(null);
		onChange?.(null);
		setSearchTerm("");
	}, [onChange]);

	const displayValue = useMemo(() => {
		if (selectedProduct) {
			return `${selectedProduct.name} - $${selectedProduct.retailPrice.toFixed(2)}`;
		}
		return placeholder;
	}, [selectedProduct, placeholder]);

	// Handle scroll to load more products
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

	// Handle keyboard navigation
	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			setOpen(false);
			setSearchTerm("");
		}
	}, []);

	return (
		<Popover open={open} onOpenChange={setOpen}>
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
							placeholder="Buscar productos por nombre..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
							// biome-ignore lint/a11y/noAutofocus: <explanation>
							autoFocus
						/>
					</div>
					<CommandList onScroll={handleScroll} className="max-h-[300px]">
						{error && (
							<div className="p-4 text-center text-sm text-destructive">
								{error}
							</div>
						)}

						{products.length === 0 && !isLoading && !error && (
							<CommandEmpty>
								{debouncedSearch
									? "No se encontraron productos."
									: "Escribe para buscar productos..."}
							</CommandEmpty>
						)}

						{products.length > 0 && (
							<CommandGroup>
								{products.map((product) => (
									<CommandItem
										key={product._id}
										value={product._id}
										onSelect={() => handleSelect(product)}
										className="cursor-pointer"
									>
										<div className="flex items-center justify-between w-full">
											<div className="flex items-center">
												<Check
													className={cn(
														"mr-2 size-4",
														selectedProduct?._id === product._id
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												<div>
													<div className="font-medium">{product.name}</div>
													<div className="text-xs text-muted-foreground">
														Stock: {product.locations?.reduce(
																		(sum: number, location: ProductStorageType) =>
																			sum + (location.stock || 0),
																		0,
																	) || 0}
														{product.category && ` • ${product.category}`}
													</div>
												</div>
											</div>
											<div className="text-right">
												<div className="font-medium">
													${product.retailPrice.toFixed(2)}
												</div>
												{product.wholesalePrice &&
													product.wholesalePrice !== product.retailPrice && (
														<div className="text-xs text-muted-foreground">
															Mayor: ${product.wholesalePrice.toFixed(2)}
														</div>
													)}
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
									{products.length === 0
										? "Cargando productos..."
										: "Cargando más productos..."}
								</span>
							</div>
						)}

						{!hasMore && products.length > 0 && !isLoading && (
							<div className="text-center py-2 text-xs text-muted-foreground border-t">
								{products.length === 1
									? "1 producto encontrado"
									: `${products.length} productos encontrados`}
							</div>
						)}
					</CommandList>
				</Command>
				{selectedProduct && (
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
