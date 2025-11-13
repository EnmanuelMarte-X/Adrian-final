import { NextResponse } from "next/server";

export async function PUT() {
  return NextResponse.json({ error: "No disponible" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "No disponible" }, { status: 405 });
}
