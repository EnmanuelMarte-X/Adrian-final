import { NextResponse, type NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { withAdminOnly } from "@/contexts/auth/middlewares";
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

async function writeBrands(data: { id: string; name: string }[]) {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const PUT = withAdminOnly()(async (request: NextRequest) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Id faltante" }, { status: 400 });

    const body = await request.json();
    const { name, newId } = body as { name?: string; newId?: string };

    const brands = await readBrands();
    const idx = brands.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

    if (name) brands[idx].name = name;
    if (newId) brands[idx].id = newId;

    await writeBrands(brands);

    return NextResponse.json(brands[idx]);
  } catch (error) {
    if (error instanceof APIError) return error.toNextResponse();
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});

export const DELETE = withAdminOnly()(async (request: NextRequest) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Id faltante" }, { status: 400 });

    const brands = await readBrands();
    const filtered = brands.filter((c) => c.id !== id);
    if (filtered.length === brands.length)
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });

    await writeBrands(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof APIError) return error.toNextResponse();
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});
