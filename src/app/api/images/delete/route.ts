import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
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

export async function DELETE(request: NextRequest) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: "No autorizado" },
				{ status: 401 }
			);
		}

		const body = await request.json();
		const { key } = body;

		if (!key) {
			return NextResponse.json(
				{ error: "Se requiere la clave del archivo" },
				{ status: 400 }
			);
		}

		// Delete from R2
		const deleteCommand = new DeleteObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: key,
		});

		await s3Client.send(deleteCommand);

		return NextResponse.json({ 
			success: true, 
			message: "Archivo eliminado exitosamente" 
		});

	} catch (error) {
		console.error("Error deleting file from R2:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor al eliminar el archivo" },
			{ status: 500 }
		);
	}
}