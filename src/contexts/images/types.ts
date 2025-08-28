export interface ImageUploadRequest {
	file: File;
	folder?: string;
	filename?: string;
}

export interface ImageUploadResponse {
	url: string;
	key: string;
	filename: string;
	size: number;
	mimetype: string;
}

export interface ImageDeleteRequest {
	key: string;
}

export interface ImageUploadProgress {
	loaded: number;
	total: number;
	percentage: number;
}

export interface ImageUploadOptions {
	onProgress?: (progress: ImageUploadProgress) => void;
	onSuccess?: (response: ImageUploadResponse) => void;
	onError?: (error: Error) => void;
}