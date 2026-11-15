import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const categorySchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères"),
  slug: z.string().min(2, "Le slug est requis"),
  description: z.string().min(5, "Description requise"),
  image: z.string().url("URL d'image valide requise"),
});

export async function GET() {
  try {
    const categories = await db.getCategories();
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé. Réservé aux administrateurs." }, { status: 403 });
    }

    const body = await request.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    // Dans notre store db
    const newCategory = {
      id: parsed.data.slug,
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description,
      image: parsed.data.image,
      productCount: 0,
    };

    return NextResponse.json({ success: true, category: newCategory }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la création de la catégorie" }, { status: 500 });
  }
}
