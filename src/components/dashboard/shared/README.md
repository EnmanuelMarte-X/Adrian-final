# BarcodeScanner Component

Un componente React versátil que permite buscar tanto productos por código de barras como facturas por ID, proporcionando una interfaz unificada con pestañas.

## Características

- ✅ Búsqueda de productos por código de barras
- ✅ Búsqueda de facturas por ID
- ✅ Interfaz de pestañas para alternar entre tipos de búsqueda
- ✅ Soporte para filtros de productos personalizados
- ✅ Callbacks para manejar resultados encontrados
- ✅ Trigger personalizable
- ✅ Estados de carga y error
- ✅ Animaciones suaves con Framer Motion
- ✅ Diseño responsive

## Props

| Prop | Tipo | Descripción | Por defecto |
|------|------|-------------|-------------|
| `children` | `React.ReactNode` | Elemento trigger personalizado | Botón por defecto |
| `filters` | `ProductFilters` | Filtros para búsqueda de productos | `{}` |
| `onProductFound` | `(product: ProductType) => void` | Callback cuando se encuentra un producto | - |
| `onOrderFound` | `(order: OrderTypeWithProducts) => void` | Callback cuando se encuentra una factura | - |
| `searchType` | `"product" \| "order"` | Tipo de búsqueda por defecto | `"product"` |

## Tipos de SearchType

- `"product"`: Inicia con la pestaña de búsqueda de productos activa
- `"order"`: Inicia con la pestaña de búsqueda de facturas activa

## Ejemplos de Uso

### Búsqueda Básica de Productos

```tsx
import { BarcodeScanner } from "@/components/dashboard/shared/BarcodeScanner";

function ProductSearch() {
  const handleProductFound = (product) => {
    console.log("Producto encontrado:", product);
    // Agregar al carrito, mostrar detalles, etc.
  };

  return (
    <BarcodeScanner
      searchType="product"
      onProductFound={handleProductFound}
    />
  );
}
```

### Búsqueda Básica de Facturas

```tsx
function OrderSearch() {
  const handleOrderFound = (order) => {
    console.log("Factura encontrada:", order);
    // Mostrar detalles, reimprimir, etc.
  };

  return (
    <BarcodeScanner
      searchType="order"
      onOrderFound={handleOrderFound}
    />
  );
}
```

### Búsqueda Dual (Productos y Facturas)

```tsx
function DualSearch() {
  const handleProductFound = (product) => {
    // Lógica para productos
  };

  const handleOrderFound = (order) => {
    // Lógica para facturas
  };

  return (
    <BarcodeScanner
      onProductFound={handleProductFound}
      onOrderFound={handleOrderFound}
    />
  );
}
```

### Con Filtros Personalizados

```tsx
function FilteredSearch() {
  const productFilters = {
    brand: "Samsung",
    category: "Televisores",
  };

  return (
    <BarcodeScanner
      searchType="product"
      filters={productFilters}
      onProductFound={(product) => console.log(product)}
    />
  );
}
```

### Con Trigger Personalizado

```tsx
function CustomTriggerSearch() {
  return (
    <BarcodeScanner onProductFound={handleProduct}>
      <Button variant="secondary" size="lg">
        🔍 Buscar Producto o Factura
      </Button>
    </BarcodeScanner>
  );
}
```

## Estados del Componente

El componente maneja automáticamente los siguientes estados:

- **Carga**: Muestra un spinner mientras busca
- **Error**: Muestra mensaje de error si la búsqueda falla
- **No encontrado**: Mensaje cuando no hay resultados
- **Encontrado**: Muestra la tarjeta con detalles del resultado

## Funcionalidades

### Para Productos
- Muestra información completa del producto
- Indica stock disponible
- Muestra precios (retail y wholesale)
- Enlace a detalles del producto

### Para Facturas
- Muestra información de la orden
- Indica si es crédito o contado
- Muestra total y cantidad de productos
- Información del cliente
- Enlace a detalles de la factura

## Dependencias

- `@tanstack/react-query` - Para manejo de datos
- `framer-motion` - Para animaciones
- `sonner` - Para notificaciones toast
- `lucide-react` - Para iconos
- Componentes UI personalizados

## Notas Técnicas

- Utiliza hooks personalizados para queries de API
- Implementa debouncing automático en las búsquedas
- Soporte para navegación por teclado (Enter para buscar)
- Limpieza automática de estado al cerrar el diálogo