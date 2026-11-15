import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = (await db.getProductById(id)) || (await db.getProductBySlug(id));

    if (!product) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé. Réservé aux administrateurs." }, { status: 403 });
    }

    const { id } = await params;
    const updates = await request.json();

    const updated = await db.updateProduct(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé. Réservé aux administrateurs." }, { status: 403 });
    }

    const { id } = await params;
    const success = await db.deleteProduct(id);

    if (!success) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
