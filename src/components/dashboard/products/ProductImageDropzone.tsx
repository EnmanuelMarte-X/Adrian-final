import { useCallback, useState } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { X, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { maxProductImages, maxProductImagesSize } from "@/config/products";
import { toast } from "sonner";
import { useUploadMultipleImagesMutation, type ImageUploadResponse } from "@/contexts/images";

interface ProductImageDropzoneProps {
	onImagesChange: (imageUrls: string[]) => void;
	images: string[];
	disabled?: boolean;
}

export function ProductImageDropzone({
	onImagesChange,
	images,
	disabled,
}: ProductImageDropzoneProps) {
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
	const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

	const uploadMutation = useUploadMultipleImagesMutation({
		onSuccess: (responses) => {
			console.log('=== UPLOAD SUCCESS DEBUG ===');
			console.log('Respuestas recibidas:', responses);
			responses.forEach((r: ImageUploadResponse, index) => {
				console.log(`Imagen ${index + 1} - URL:`, r.url);
			});
			console.log('============================');
			
			const newImageUrls = [...images, ...responses.map((r: ImageUploadResponse) => r.url)];
			onImagesChange(newImageUrls);
			setIsUploading(false);
			setUploadProgress({});
			toast.success(`${responses.length} imagen(es) subida(s) exitosamente`);
		},
		onError: (error) => {
			setIsUploading(false);
			setUploadProgress({});
			toast.error(`Error al subir imágenes: ${error.message}`);
		},
	});

	const onDrop = useCallback(
		async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
			if (fileRejections.length > 0) {
				const error = fileRejections[0].errors[0];
				if (error.code === "file-too-large") {
					toast.error(
						`El archivo es demasiado grande. El tamaño máximo permitido es ${maxProductImagesSize}MB.`,
					);
				} else if (error.code === "file-invalid-type") {
					toast.error(
						"El tipo de archivo no es válido. Solo se permiten imágenes.",
					);
				} else if (error.code === "too-many-files") {
					toast.error(
						`Has alcanzado el máximo de ${maxProductImages} imágenes permitidas.`,
					);
				} else {
					toast.error(
						`Error al subir la imagen: "${error.code}", por favor intenta de nuevo.`,
					);
				}
				return;
			}

			const remainingSlots = maxProductImages - images.length;
			if (acceptedFiles.length > remainingSlots) {
				toast.error(
					`Solo puedes subir ${remainingSlots} imagen(es) más. Has alcanzado el máximo de ${maxProductImages} imágenes.`,
				);
				return;
			}

			setIsUploading(true);
			
			const progressMap: Record<string, number> = {};
			for (const file of acceptedFiles) {
				progressMap[file.name] = 0;
			}
			setUploadProgress(progressMap);

			try {
				await uploadMutation.mutateAsync(acceptedFiles);
			} catch (error) {
				console.error("Upload error:", error);
			}
		},
		[images, uploadMutation],
	);

	const removeImage = async (index: number) => {
		const imageUrl = images[index];
		console.log('Eliminando imagen:', imageUrl);
		
		setDeletingIndex(index);
		
		// Extraer la key del archivo desde la URL
		// Ejemplo: https://s3.jhensonsupply.com/content/archivo.jpg -> content/archivo.jpg
		const urlParts = imageUrl.split('/');
		const key = urlParts.slice(-2).join('/'); // Tomar las últimas 2 partes: content/archivo.jpg
		
		console.log('Key extraída para eliminación:', key);
		
		try {
			// Eliminar del servidor
			const res = await fetch('/api/images/delete', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ key }),
			});
			
			const data = await res.json();
			console.log('Respuesta del servidor:', data);
			
			if (!res.ok) {
				console.error('Error del servidor:', data);
				toast.error(data.error || 'Error al eliminar la imagen del servidor');
				return;
			}
			
			// Solo eliminar de la interfaz si se eliminó exitosamente del servidor
			const newImages = [...images];
			newImages.splice(index, 1);
			onImagesChange(newImages);
			toast.success("Imagen eliminada exitosamente");
			
		} catch (error) {
			console.error('Error eliminando imagen:', error);
			toast.error('Error de red al eliminar la imagen');
		} finally {
			setDeletingIndex(null);
		}
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".webp"],
		},
		disabled: images.length >= maxProductImages || isUploading || disabled,
		maxFiles: maxProductImages - images.length,
		maxSize: maxProductImagesSize * 1024 * 1024,
	});

	const isMaxFilesReached = images.length >= maxProductImages;

	return (
		<div
			data-disabled={disabled}
			className="w-full data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed"
		>
			{images.length > 0 && (
				<div className="mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
					{images.map((imageUrl, index) => (
						<div key={index} className="relative group">
							<img
								src={imageUrl}
								alt={`Imagen ${index + 1}`}
								className="w-full aspect-square object-cover rounded-md border"
								loading="lazy"
								onLoad={() => console.log('✅ Imagen cargada exitosamente:', imageUrl)}
								onError={(e) => {
									console.error('❌ Error cargando imagen:', imageUrl);
									console.error('Error details:', e);
								}}
							/>
							<Button
								variant="secondary"
								size="icon"
								className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/90 hover:bg-destructive text-destructive-foreground"
								onClick={async (e) => {
									e.stopPropagation();
									await removeImage(index);
								}}
								disabled={isUploading || deletingIndex === index}
							>
								{deletingIndex === index ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<X className="w-4 h-4" />
								)}
							</Button>
						</div>
					))}
				</div>
			)}

			{isUploading && Object.keys(uploadProgress).length > 0 && (
				<div className="mb-4 space-y-2">
					<p className="text-sm text-muted-foreground">Subiendo imágenes...</p>
					{Object.entries(uploadProgress).map(([filename, progress]) => (
						<div key={filename} className="space-y-1">
							<div className="flex justify-between text-xs">
								<span className="truncate">{filename}</span>
								<span>{progress}%</span>
							</div>
							<div className="w-full bg-secondary rounded-full h-2">
								<div
									className="bg-primary h-2 rounded-full transition-all duration-300"
									style={{ width: `${progress}%` }}
								/>
							</div>
						</div>
					))}
				</div>
			)}

			<div
				{...getRootProps()}
				className={cn(
					"flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 min-h-[120px] text-center cursor-pointer transition-colors",
					isDragActive ? "border-primary bg-secondary/30" : "border-input",
					(isMaxFilesReached || isUploading) && "cursor-not-allowed opacity-50",
				)}
			>
				<input {...getInputProps()} />
				
				{isUploading ? (
					<div className="flex flex-col items-center gap-2">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<p className="text-sm text-muted-foreground">
							Subiendo imágenes...
						</p>
					</div>
				) : isMaxFilesReached ? (
					<div className="flex flex-col items-center gap-2">
						<X className="h-8 w-8 text-destructive" />
						<p className="text-sm text-destructive">
							Has alcanzado el máximo de {maxProductImages} imágenes permitidas.
						</p>
					</div>
				) : isDragActive ? (
					<div className="flex flex-col items-center gap-2">
						<Upload className="h-8 w-8 text-primary" />
						<p className="text-sm">Suelta las imágenes aquí...</p>
					</div>
				) : (
					<div className="flex flex-col items-center gap-2">
						<Upload className="h-8 w-8 text-muted-foreground" />
						<p className="text-sm text-muted-foreground">
							Arrastra imágenes aquí, o haz clic para seleccionarlas
						</p>
						<p className="text-xs text-muted-foreground">
							Máx. {maxProductImages - images.length} imagen(es), {maxProductImagesSize}MB c/u
						</p>
						<p className="text-xs text-muted-foreground">
							Formatos: JPG, PNG, WebP
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
