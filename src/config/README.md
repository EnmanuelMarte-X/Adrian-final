# Configuración de Jhenson Supply

Este directorio contiene toda la configuración centralizada de la empresa Jhenson Supply, incluyendo información de contacto, ubicaciones, documentos fiscales y más.

## Archivos de Configuración

### `siteConfig.ts`
Configuración principal del sitio web con toda la información de la empresa:
- Información básica (nombre, URL, descripción)
- Datos de contacto (emails, teléfonos)
- Información legal (RNC, nombre comercial)
- Direcciones y ubicaciones
- Horarios de atención
- Enlaces de redes sociales
- Configuración de facturación

### `company.ts`
Configuración específica de la empresa y funciones helper:
- Información consolidada de la empresa
- Configuración para recibos y facturas
- Funciones para obtener información formateada
- Datos para comprobantes de pago

### `locations.ts`
Configuración de ubicaciones y contacto:
- Ubicaciones físicas (principal y alternativa)
- Configuración del mapa de Google Maps
- Información detallada de contacto por departamentos
- Redes sociales

### `documents.ts`
Configuración para documentos fiscales:
- Plantillas para recibos de órdenes
- Plantillas para recibos de crédito  
- Plantillas para comprobantes de pago
- Configuración de NCF (Numeración de Comprobantes Fiscales)
- Funciones para generar documentos

### `index.ts`
Archivo principal que exporta todas las configuraciones y proporciona acceso rápido.

## Uso

### Importar configuraciones específicas
```typescript
import { siteConfig } from '@/config/siteConfig';
import { companyConfig, getCompanyInfo } from '@/config/company';
import { locationsConfig, getContactDetails } from '@/config/locations';
import { documentsConfig, formatNCF } from '@/config/documents';
```

### Usar el archivo índice (recomendado)
```typescript
import { 
  siteConfig, 
  quickAccess, 
  getCompanyInfo,
  getOrderReceiptConfig 
} from '@/config';

// Acceso rápido a información común
const companyName = quickAccess.companyName;
const mainPhone = quickAccess.mainPhone;
const mainEmail = quickAccess.generalEmail;
```

### Funciones helper útiles

#### Información de la empresa
```typescript
import { getCompanyInfo } from '@/config';

const companyInfo = getCompanyInfo();
// { name: "Jhenson Supply", rnc: "132145399", phone: "+1 (849) 863-6444", ... }
```

#### Información para recibos
```typescript
import { getReceiptFooter } from '@/config';

const receiptFooter = getReceiptFooter();
// { companyName: "JHENSON SUPPLY", rnc: "RNC: 132145399", ... }
```

#### Generar NCF
```typescript
import { formatNCF } from '@/config';

const ncf = formatNCF(123); // "B01000000123"
```

#### Configuración de documentos
```typescript
import { getOrderReceiptConfig, getDocumentFooter } from '@/config';

const orderConfig = getOrderReceiptConfig();
const footer = getDocumentFooter('order');
```

## Información de la Empresa

### Datos Generales
- **Nombre**: Jhenson Supply
- **Nombre Comercial**: JHENSON SUPPLY
- **RNC**: 132145399
- **Sitio Web**: https://jhensonsupply.com

### Contacto
- **Teléfono Principal**: +1 (849) 863-6444
- **Email General**: info@jhensonsupply.com
- **Email Facturas**: facturas@jhensonsupply.com

### Direcciones
- **Principal**: Calle Santa Lucía No. 15, Val. del Este, SDE
- **Alternativa**: C. 12 113, Santo Domingo Este 11509

### Horarios
- **Lunes - Viernes**: 8:00 AM - 6:00 PM
- **Sábados**: 8:00 AM - 4:00 PM
- **Domingos**: Cerrado

### Redes Sociales
- **Instagram**: https://www.instagram.com/jhensonsupply/
- **Facebook**: https://www.facebook.com/jhensonsupply/

## Actualizar Información

Para actualizar cualquier información de la empresa:

1. Modifica el archivo `siteConfig.ts` con los nuevos datos
2. Los demás archivos se actualizarán automáticamente usando las referencias
3. Si necesitas agregar nueva funcionalidad, modifica los archivos helper correspondientes

## Migración de Código Existente

Si encuentras código hardcodeado con información de la empresa, reemplázalo usando estas configuraciones:

```typescript
// ❌ Antes (hardcodeado)
const companyName = "Jhenson Supply";
const rnc = "132145399";

// ✅ Después (usando configuración)
import { quickAccess } from '@/config';
const companyName = quickAccess.companyName;
const rnc = quickAccess.rnc;
```
