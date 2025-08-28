import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query";
import type { 
	ImageUploadRequest, 
	ImageUploadResponse, 
	ImageDeleteRequest,
	ImageUploadOptions 
} from "./types";

export const useUploadImageMutation = (options?: ImageUploadOptions) =>
	useMutation({
		mutationFn: async (data: ImageUploadRequest): Promise<ImageUploadResponse> => {
			const formData = new FormData();
			formData.append("file", data.file);
			
			if (data.folder) {
				formData.append("folder", data.folder);
			}
			
			if (data.filename) {
				formData.append("filename", data.filename);
			}

			return new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();

				// Track upload progress
				xhr.upload.addEventListener("progress", (event) => {
					if (event.lengthComputable && options?.onProgress) {
						const progress = {
							loaded: event.loaded,
							total: event.total,
							percentage: Math.round((event.loaded / event.total) * 100),
						};
						options.onProgress(progress);
					}
				});

				xhr.addEventListener("load", () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						try {
							const response = JSON.parse(xhr.responseText);
							resolve(response);
						} catch {
							reject(new Error("Invalid JSON response"));
						}
					} else {
						reject(new Error(`Upload failed with status: ${xhr.status}`));
					}
				});

				xhr.addEventListener("error", () => {
					reject(new Error("Network error during upload"));
				});

				xhr.open("POST", "/api/images/upload");
				xhr.send(formData);
			});
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["images"] });
			options?.onSuccess?.(data);
		},
		onError: (error) => {
			options?.onError?.(error instanceof Error ? error : new Error("Upload failed"));
		},
	});

export const useUploadMultipleImagesMutation = (options?: {
	onSuccess?: (data: ImageUploadResponse[]) => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (files: File[]): Promise<ImageUploadResponse[]> => {
			const uploadPromises = files.map(async (file) => {
				const formData = new FormData();
				formData.append("file", file);

				const response = await fetch("/api/images/upload", {
					method: "POST",
					body: formData,
				});

				if (!response.ok) {
					throw new Error(`Failed to upload ${file.name}: ${response.status}`);
				}

				return response.json();
			});

			return Promise.all(uploadPromises);
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["images"] });
			options?.onSuccess?.(data);
		},
		onError: (error) => {
			options?.onError?.(error instanceof Error ? error : new Error("Upload failed"));
		},
	});

export const useDeleteImageMutation = (options?: {
	onSuccess?: () => void;
	onError?: (error: Error) => void;
}) =>
	useMutation({
		mutationFn: async (data: ImageDeleteRequest) => {
			const response = await fetch("/api/images/delete", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`Failed to delete image: ${response.status}`);
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["images"] });
			options?.onSuccess?.();
		},
		onError: (error) => {
			options?.onError?.(error instanceof Error ? error : new Error("Delete failed"));
		},
	});

export const useImagesQuery = (folder?: string) =>
	useQuery({
		queryKey: ["images", folder],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (folder) {
				params.set("folder", folder);
			}

			const response = await fetch(`/api/images?${params.toString()}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch images: ${response.status}`);
			}

			const data = await response.json();
			return data as ImageUploadResponse[];
		},
	});