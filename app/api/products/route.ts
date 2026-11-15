import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

const productSchema = z.object({
  name: z.string().min(2, "Nom du produit requis"),
  brand: z.string().min(1, "Marque requise"),
  category: z.enum(["smartphones", "laptops", "tablets", "accessoires"]),
  description: z.string().min(5, "Description requise"),
  price: z.number().positive("Le prix doit être positif"),
  compareAtPrice: z.number().optional(),
  stock: z.number().int().min(0, "Le stock ne peut être négatif"),
  images: z.array(z.string().min(1, "Image requise")).min(1, "Au moins une image requise"),
  specs: z.record(z.string(), z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isNew: z.boolean().optional(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const query = searchParams.get("q") || undefined;

    const products = await db.getProducts({ category, brand, query });
    return NextResponse.json({ products });
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
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    // Générer un slug lisible
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const newProduct = await db.createProduct({
      slug,
      name: data.name,
      brand: data.brand,
      category: data.category,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice,
      stock: data.stock,
      images: data.images,
      specs: data.specs || {},
      isFeatured: data.isFeatured ?? false,
      isNew: data.isNew ?? true,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Impossible de créer le produit" }, { status: 500 });
  }
}
