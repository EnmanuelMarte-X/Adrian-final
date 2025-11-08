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
    // If file missing or invalid, return empty array (caller can decide)
    return [];
  }
}

async function writeCategories(data: { id: string; name: string }[]) {
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export const GET = async (_request: NextRequest) => {
  try {
    const categories = await readCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    if (error instanceof APIError) return error.toNextResponse();
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
};

export const POST = withAdminOnly()(async (request) => {
  try {
    const body = await request.json();
    const { id, name } = body as { id?: string; name: string };

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }

    const categories = await readCategories();
    const newId = id && typeof id === "string" ? id : name;

    const exists = categories.find((c) => c.id === newId || c.name === name);
    if (exists) {
      return NextResponse.json({ error: "La categoría ya existe" }, { status: 409 });
    }

    const newCat = { id: newId, name };
    categories.push(newCat);
    await writeCategories(categories);

    return NextResponse.json(newCat, { status: 201 });
  } catch (error) {
    if (error instanceof APIError) return error.toNextResponse();
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});
