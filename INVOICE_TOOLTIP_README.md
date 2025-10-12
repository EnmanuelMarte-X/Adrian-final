# Tooltip de Deuda por Factura

Esta funcionalidad agrega un tooltip interactivo en la tabla de facturas que muestra información detallada sobre el estado de pago de cada factura individual.

## ✨ Características

### 🎯 Información Mostrada
- **Total de la factura** - Monto total incluyendo impuestos
- **Monto pagado** - Cantidad ya pagada hacia esta factura específica
- **Monto pendiente** - Cuánto se debe todavía de esta factura
- **Estado de pago** - Indicador visual (Pagado/Pago parcial/Sin pagar)
- **Tipo de factura** - Crédito o contado
- **Número de pagos** - Cantidad de pagos registrados

### 🎨 Indicadores Visuales
Los iconos de las facturas ahora tienen códigos de color según el estado de pago:
- 🟢 **Verde** - Factura completamente pagada o de contado
- 🟡 **Amarillo** - Factura con pago parcial
- 🔴 **Rojo** - Factura sin pagar

### 📍 Ubicación
El tooltip aparece al hacer hover sobre el monto total en la tabla de facturas (`/dashboard/orders`).

## 🏗️ Archivos Creados/Modificados

### Nuevos Archivos
1. **`src/lib/invoice-utils.ts`** - Utilidades para cálculos de facturas y pagos
2. **`src/components/dashboard/orders/InvoiceDebtTooltip.tsx`** - Componente del contenido del tooltip
3. **`src/components/dashboard/orders/InvoiceTotalCell.tsx`** - Componente de la celda con indicador de estado

### Archivos Modificados
1. **`src/components/dashboard/orders/OrdersTable.tsx`** - Integración del tooltip en la tabla

## 🔧 Funciones Principales

### `calculateInvoiceTotal(order: OrderType): number`
Calcula el total de una factura incluyendo impuestos y descuentos.

### `calculateTotalPaid(payments: PaymentHistoryType[]): number`
Calcula cuánto se ha pagado de una factura específica.

### `calculateInvoiceOwing(order: OrderType, payments: PaymentHistoryType[]): number`
Calcula cuánto se debe de una factura específica.

### `getInvoicePaymentStatus(order: OrderType, payments: PaymentHistoryType[]): "paid" | "partial" | "unpaid"`
Determina el estado de pago de una factura.

## 💡 Ejemplo de Uso

```tsx
import { InvoiceDebtTooltipContent } from './InvoiceDebtTooltip';
import { calculateInvoiceOwing } from '@/lib/invoice-utils';

// En un componente
const owingAmount = calculateInvoiceOwing(order, payments);
console.log(`Se debe: ${owingAmount}`);
```

## 🚀 Beneficios

1. **Transparencia Total** - Los usuarios pueden ver exactamente cuánto se debe por cada factura
2. **Información Instantánea** - No necesita navegar a otra página para ver el detalle
3. **Indicadores Visuales** - Fácil identificación del estado de pago de un vistazo
4. **Mejor UX** - Tooltip responsivo y carga bajo demanda

## 🔄 Consideraciones de Rendimiento

- Los tooltips cargan la información de pagos solo cuando se hace hover
- Utiliza React Query para cache automático de datos
- Skeleton loading para mejor experiencia de usuario
- Cálculos optimizados para evitar re-renders innecesarios

## 🎯 Casos de Uso Resueltos

- ✅ Ver cuánto se debe de una factura específica sin salir de la tabla
- ✅ Identificar rápidamente facturas con pagos pendientes
- ✅ Distinguir entre facturas de contado y crédito
- ✅ Monitorear el progreso de pagos parciales
- ✅ Validar el estado de pago de facturas de un vistazo