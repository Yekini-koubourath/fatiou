
import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const stockAdjustmentSchema = z.object({
  productId: z.string().min(1),
  quantityChange: z.number().int().refine(
    (value) => value !== 0,
    "Le changement doit être différent de 0"
  ),
  type: z.enum(["IN_RESTOCK", "OUT_SALE", "OUT_LOSS", "CORRECTION"]),
  reason: z.string().min(3, "Veuillez préciser le motif"),
});

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const movements = await db.getStockMovements();

    return NextResponse.json({ movements });
  } catch (error) {
    console.error("Erreur récupération stocks :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const parsed = stockAdjustmentSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const movement = await db.adjustStock({
      ...parsed.data,
      userEmail: user.email,
    });

    return NextResponse.json({
      success: true,
      movement: movement.movement,
      currentStock: movement.currentStock,
    });
  } catch (error) {
    console.error("Erreur ajustement stock :", error);

    const message =
      error instanceof Error ? error.message : "Erreur lors de l'ajustement";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
