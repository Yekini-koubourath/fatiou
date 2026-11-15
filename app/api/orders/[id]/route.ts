import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { OrderStatus } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const order = (await db.getOrderById(id)) || (await db.getOrderByNumber(id));

    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé. Réservé aux administrateurs." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const status = body.status as OrderStatus;

    if (!status) {
      return NextResponse.json({ error: "Statut manquant" }, { status: 400 });
    }

    const updated = await db.updateOrderStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
