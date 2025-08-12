import { useCallback } from "react";
import { type FileRejection, useDropzone } from "react-dropzone";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { maxProductImages, maxProductImagesSize } from "@/config/products";
import { toast } from "sonner";

interface ProductImageDropzoneProps {
	onImagesChange: (files: File[]) => void;
	images: File[];
	disabled?: boolean;
}

export function ProductImageDropzone({
	onImagesChange,
	images,
	disabled,
}: ProductImageDropzoneProps) {
	const onDrop = useCallback(
		(acceptedFiles: File[], fileRejections: FileRejection[]) => {
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
						`Error al subir la image: "${error.code}", por favor intenta de nuevo.`,
					);
				}
				return;
			}

			const newFiles = [...images, ...acceptedFiles].slice(0, maxProductImages);
			if (newFiles.length > maxProductImages) {
				toast.error(
					`Has alcanzado el máximo de ${maxProductImages} imágenes permitidas.`,
				);
			} else {
				onImagesChange(newFiles);
			}
		},
		[images, onImagesChange],
	);

	const removeImage = (index: number) => {
		const newFiles = [...images];
		newFiles.splice(index, 1);
		onImagesChange(newFiles);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".webp"],
		},
		disabled: images.length >= maxProductImages,
		maxFiles: maxProductImages,
		maxSize: maxProductImagesSize * 1024 * 1024, // Convert MB to bytes
	});

	const isMaxFilesReached = images.length >= maxProductImages;

	return (
		<div
			data-disabed={disabled}
			className="w-full data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed"
		>
			{images.length > 0 && (
				<div className="mb-4 grid grid-cols-5 gap-4">
					{images.map((file, index) => (
						<div key={index} className="relative group">
							<img
								src={URL.createObjectURL(file)}
								alt={`Preview ${index}`}
								className="w-full aspect-square object-cover rounded-md"
							/>
							<Button
								variant="secondary"
								size="icon"
								className="absolute top-1 right-1 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={(e) => {
									e.stopPropagation();
									removeImage(index);
								}}
							>
								<X className="w-4 h-4" />
							</Button>
							<p className="text-xs mt-1 truncate">{file.name}</p>
						</div>
					))}
				</div>
			)}
			<div
				{...getRootProps()}
				className={cn(
					"flex items-center justify-center border-2 border-dashed rounded-lg p-4 min-h-[120px] text-center cursor-pointer transition-colors",
					isDragActive ? "border-primary bg-secondary/30" : "border-input",
					isMaxFilesReached && "cursor-not-allowed opacity-50",
				)}
			>
				<input {...getInputProps()} />
				{isMaxFilesReached ? (
					<p className="text-red-500">
						Has alcanzado el máximo de imágenes permitidas.
					</p>
				) : isDragActive ? (
					<p>Suelta las imágenes aquí...</p>
				) : (
					<p className="max-w-[35ch] text-muted-foreground">
						Arrastra imágenes aquí, o haz click para seleccionarlas (máx.{" "}
						{maxProductImages} {maxProductImages > 1 ? "imagen" : "imágenes"},{" "}
						{maxProductImagesSize}MB c/u)
					</p>
				)}
			</div>
		</div>
	);
}
