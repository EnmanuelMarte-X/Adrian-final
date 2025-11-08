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

export const GET = async (_request: NextRequest) => {
  try {
    const brands = await readBrands();
    return NextResponse.json({ brands });
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

    const brands = await readBrands();
    const newId = id && typeof id === "string" ? id : name;

    const exists = brands.find((c) => c.id === newId || c.name === name);
    if (exists) {
      return NextResponse.json({ error: "La marca ya existe" }, { status: 409 });
    }

    const newBrand = { id: newId, name };
    brands.push(newBrand);
    await writeBrands(brands);

    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    if (error instanceof APIError) return error.toNextResponse();
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
});
