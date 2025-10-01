/**
 * Ejemplos de uso del componente BarcodeScanner
 * 
 * Este componente permite buscar tanto productos por código de barras
 * como facturas por ID, con una interfaz unificada de pestañas.
 */

import { BarcodeScanner } from "./BarcodeScanner";
import type { ProductType } from "@/types/models/products";
import type { OrderTypeWithProducts } from "@/types/models/orders";
import { Button } from "@/components/ui/button";

// Ejemplo 1: Búsqueda básica de productos
export function BasicProductSearch() {
	const handleProductFound = (product: ProductType) => {
		console.log("Producto encontrado:", product);
		// Lógica para manejar el producto encontrado
	};

	return (
		<BarcodeScanner
			searchType="product"
			onProductFound={handleProductFound}
		/>
	);
}

// Ejemplo 2: Búsqueda básica de facturas
export function BasicOrderSearch() {
	const handleOrderFound = (order: OrderTypeWithProducts) => {
		console.log("Factura encontrada:", order);
		// Lógica para manejar la factura encontrada
	};

	return (
		<BarcodeScanner
			searchType="order"
			onOrderFound={handleOrderFound}
		/>
	);
}

// Ejemplo 3: Búsqueda dual (productos y facturas)
export function DualSearch() {
	const handleProductFound = (product: ProductType) => {
		console.log("Producto encontrado:", product);
		// Agregar producto al carrito, mostrar detalles, etc.
	};

	const handleOrderFound = (order: OrderTypeWithProducts) => {
		console.log("Factura encontrada:", order);
		// Mostrar detalles de la factura, reimpimir, etc.
	};

	return (
		<BarcodeScanner
			onProductFound={handleProductFound}
			onOrderFound={handleOrderFound}
		/>
	);
}

// Ejemplo 4: Con filtros personalizados para productos
export function FilteredProductSearch() {
	const productFilters = {
		brand: "Samsung",
		category: "Televisores",
	};

	const handleProductFound = (product: ProductType) => {
		console.log("Producto encontrado con filtros:", product);
	};

	return (
		<BarcodeScanner
			searchType="product"
			filters={productFilters}
			onProductFound={handleProductFound}
		/>
	);
}

// Ejemplo 5: Con trigger personalizado
export function CustomTriggerSearch() {
	const handleProductFound = (product: ProductType) => {
		console.log("Producto encontrado:", product);
	};

	const handleOrderFound = (order: OrderTypeWithProducts) => {
		console.log("Factura encontrada:", order);
	};

	return (
		<BarcodeScanner
			onProductFound={handleProductFound}
			onOrderFound={handleOrderFound}
		>
			<Button variant="secondary" size="lg">
				🔍 Buscar Producto o Factura
			</Button>
		</BarcodeScanner>
	);
}