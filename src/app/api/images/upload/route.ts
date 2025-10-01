import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
	region: "auto",
	endpoint: process.env.R2_ENDPOINT,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
	"image/jpeg",
	"image/jpg", 
	"image/png",
	"image/webp",
	"image/gif"
];

export async function POST(request: NextRequest) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: "No autorizado" },
				{ status: 401 }
			);
		}

		const formData = await request.formData();
		const file = formData.get("file") as File;
		const customFilename = formData.get("filename") as string;

		if (!file) {
			return NextResponse.json(
				{ error: "No se proporcionó ningún archivo" },
				{ status: 400 }
			);
		}

		// Validate file size
		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{ error: `El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB` },
				{ status: 400 }
			);
		}

		// Validate file type
		if (!ALLOWED_TYPES.includes(file.type)) {
			return NextResponse.json(
				{ error: "Tipo de archivo no permitido. Solo se permiten imágenes." },
				{ status: 400 }
			);
		}

		// Generate unique filename
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
		const randomString = Math.random().toString(36).substring(2, 8);
		const extension = file.name.split('.').pop();
		const filename = customFilename || `${timestamp}-${randomString}.${extension}`;
		const key = `content/${filename}`;

		// Convert file to buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Upload to R2
		const uploadCommand = new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: key,
			Body: buffer,
			ContentType: file.type,
			ContentLength: file.size,
			Metadata: {
				originalName: file.name,
				uploadedBy: session.user.id,
				uploadedAt: new Date().toISOString(),
			},
		});

		await s3Client.send(uploadCommand);

		// Construct public URL
		const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
		
		console.log('=== URL CONSTRUCTION DEBUG ===');
		console.log('R2_PUBLIC_URL:', process.env.R2_PUBLIC_URL);
		console.log('key:', key);
		console.log('publicUrl construida:', publicUrl);
		console.log('===============================');

		const response = {
			url: publicUrl,
			key: key,
			filename: filename,
			size: file.size,
			mimetype: file.type,
		};

		return NextResponse.json(response);

	} catch (error) {
		console.error("Error uploading file to R2:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor al subir el archivo" },
			{ status: 500 }
		);
	}
}