import { NextResponse, type NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { withAdminOnly } from "@/contexts/auth/middlewares";
import { APIError } from "@/contexts/shared/exceptions";

const FILE = path.join(process.cwd(), "config", "categories.json");

async function readCategories() {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    return JSON.parse(raw) as { id: string; name: string }[];
  } catch (err) {
    return [];
  }
}

async function writeCategories(data: { id: string; name: string }[]) {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const PUT = withAdminOnly()(async (request: NextRequest) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Id faltante" }, { status: 400 });

    const body = await request.json();
    const { name, newId } = body as { name?: string; newId?: string };

    const categories = await readCategories();
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) return NextResponse.json({ error: "No encontrada" }, { status: 404 });

    // Update fields
    if (name) categories[idx].name = name;
    if (newId) categories[idx].id = newId;

    await writeCategories(categories);

    return NextResponse.json(categories[idx]);
  } catch (error) {
    if (error instanceof APIError) return error.toNextResponse();
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});

export const DELETE = withAdminOnly()(async (request: NextRequest) => {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    if (!id) return NextResponse.json({ error: "Id faltante" }, { status: 400 });

    const categories = await readCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (filtered.length === categories.length)
      return NextResponse.json({ error: "No encontrada" }, { status: 404 });

    await writeCategories(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof APIError) return error.toNextResponse();
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});
