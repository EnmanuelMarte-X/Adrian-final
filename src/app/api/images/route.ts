import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
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

export async function GET(request: NextRequest) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json(
				{ error: "No autorizado" },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);
		const folder = searchParams.get("folder");

		// List objects from R2
		const listCommand = new ListObjectsV2Command({
			Bucket: process.env.R2_BUCKET_NAME!,
			Prefix: folder ? `${folder}/` : undefined,
			MaxKeys: 1000, // Limit to 1000 objects
		});

		const response = await s3Client.send(listCommand);

		const images = response.Contents?.map((object) => ({
			url: `${process.env.R2_PUBLIC_URL}/${object.Key}`,
			key: object.Key,
			filename: object.Key?.split('/').pop() || '',
			size: object.Size || 0,
			lastModified: object.LastModified,
		})) || [];

		return NextResponse.json(images);

	} catch (error) {
		console.error("Error listing files from R2:", error);
		return NextResponse.json(
			{ error: "Error interno del servidor al listar los archivos" },
			{ status: 500 }
		);
	}
}