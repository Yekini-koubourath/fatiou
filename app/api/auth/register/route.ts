import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "La création de comptes clients est désactivée." },
    { status: 403 }
  );
}