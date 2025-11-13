import { NextResponse, type NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { APIError } from "@/contexts/shared/exceptions";

const FILE = path.join(process.cwd(), "config", "brands.json");

async function readBrands() {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as { id: string; name: string }[];
  } catch (err) {
    return [];
  }
}

export const GET = async (_request: NextRequest) => {
  try {
    const brands = await readBrands();
    return NextResponse.json({ brands });
  } catch (error) {
    if (error instanceof APIError) return error.toNextResponse();
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
};
