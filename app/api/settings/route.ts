import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const settings = await db.getSettings();
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const updates = await request.json();
    const settings = await db.updateSettings(updates);

    return NextResponse.json({ success: true, settings });
  } catch {
    return NextResponse.json({ error: "Erreur de mise à jour des paramètres" }, { status: 500 });
  }
}
