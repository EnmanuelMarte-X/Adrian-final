# Images Context

Este contexto proporciona funcionalidad para subir, listar y eliminar imágenes usando Cloudflare R2.

## Configuración

### Variables de Entorno

Agrega las siguientes variables a tu archivo `.env.local`:

```bash
# Cloudflare R2 Configuration
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=jheson-supply-images
R2_PUBLIC_URL=https://your-custom-domain.com
```

### Instalación de Dependencias

```bash
npm install @aws-sdk/client-s3
# o
pnpm add @aws-sdk/client-s3
```

## Uso

### Hooks Disponibles

#### `useUploadImageMutation`
Sube una sola imagen a R2.

```tsx
import { useUploadImageMutation } from "@/contexts/images";

const uploadMutation = useUploadImageMutation({
  onProgress: (progress) => {
    console.log(`Progreso: ${progress.percentage}%`);
  },
  onSuccess: (response) => {
    console.log("Imagen subida:", response.url);
  },
  onError: (error) => {
    console.error("Error:", error.message);
  },
});

// Usar
const file = event.target.files[0];
uploadMutation.mutate({
  file,
  folder: "products", // opcional
  filename: "custom-name.jpg" // opcional
});
```

#### `useUploadMultipleImagesMutation`
Sube múltiples imágenes a R2.

```tsx
import { useUploadMultipleImagesMutation } from "@/contexts/images";

const uploadMutation = useUploadMultipleImagesMutation({
  onSuccess: (responses) => {
    console.log(`${responses.length} imágenes subidas`);
    responses.forEach(response => {
      console.log("URL:", response.url);
    });
  },
  onError: (error) => {
    console.error("Error:", error.message);
  },
});

// Usar
const files = Array.from(event.target.files);
uploadMutation.mutate(files);
```

#### `useDeleteImageMutation`
Elimina una imagen de R2.

```tsx
import { useDeleteImageMutation } from "@/contexts/images";

const deleteMutation = useDeleteImageMutation({
  onSuccess: () => {
    console.log("Imagen eliminada");
  },
  onError: (error) => {
    console.error("Error:", error.message);
  },
});

// Usar
deleteMutation.mutate({ key: "products/image-name.jpg" });
```

#### `useImagesQuery`
Lista imágenes de un folder específico.

```tsx
import { useImagesQuery } from "@/contexts/images";

const { data: images, isLoading, error } = useImagesQuery("products");

if (isLoading) return <div>Cargando...</div>;
if (error) return <div>Error: {error.message}</div>;

return (
  <div>
    {images?.map((image) => (
      <img key={image.key} src={image.url} alt={image.filename} />
    ))}
  </div>
);
```

### Componente ProductImageDropzone

Un componente completo para subir imágenes con drag & drop:

```tsx
import { useState } from "react";
import { ProductImageDropzone } from "@/components/dashboard/products/ProductImageDropzone";

export function MyComponent() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <ProductImageDropzone 
      images={images} 
      onImagesChange={setImages}
      disabled={false} // opcional
    />
  );
}
```

## API Routes

### POST `/api/images/upload`
Sube una imagen a R2.

**Body:** FormData con:
- `file`: El archivo de imagen
- `folder`: (opcional) Carpeta donde guardar
- `filename`: (opcional) Nombre personalizado

**Response:**
```json
{
  "url": "https://your-domain.com/folder/filename.jpg",
  "key": "folder/filename.jpg",
  "filename": "filename.jpg",
  "size": 12345,
  "mimetype": "image/jpeg"
}
```

### DELETE `/api/images/delete`
Elimina una imagen de R2.

**Body:**
```json
{
  "key": "folder/filename.jpg"
}
```

### GET `/api/images`
Lista imágenes de R2.

**Query Parameters:**
- `folder`: (opcional) Filtrar por carpeta

**Response:**
```json
[
  {
    "url": "https://your-domain.com/folder/filename.jpg",
    "key": "folder/filename.jpg",
    "filename": "filename.jpg",
    "size": 12345,
    "lastModified": "2023-01-01T00:00:00.000Z"
  }
]
```

## Configuración de Cloudflare R2

1. Crear un bucket en Cloudflare R2
2. Configurar un dominio personalizado para acceso público
3. Crear API tokens con permisos de lectura/escritura
4. Configurar CORS si es necesario

## Limitaciones

- Tamaño máximo de archivo: 5MB (configurable en la API)
- Tipos permitidos: JPEG, PNG, WebP, GIF
- Máximo de imágenes por producto: Definido en `@/config/products`

## Ejemplo Completo

Ver `ImageUploadExample.tsx` para un ejemplo completo de implementación.