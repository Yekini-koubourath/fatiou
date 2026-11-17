import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { DELIVERY_ZONES, isValidPhoneForCountry } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";

const orderSchema = z.object({
  customerName: z.string().min(2, "Veuillez entrer votre nom complet"),
  customerPhone: z.string().min(8, "Veuillez entrer un numéro de téléphone valide"),
  customerEmail: z.string().email("E-mail invalide").optional().or(z.literal("")),
  city: z.string().min(2, "Veuillez sélectionner ou préciser la ville"),
  district: z.string().min(2, "Veuillez indiquer votre quartier"),
  address: z.string().min(3, "Veuillez indiquer l'adresse ou des repères précis"),
  deliveryInstructions: z.string().optional(),
  deliveryZoneId: z.string().min(1, "Veuillez sélectionner une zone de livraison"),
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      productImage: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
    })
  ).min(1, "Le panier doit contenir au moins un article"),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Si admin, toutes les commandes ; si client, ses propres commandes
    if (user.role === "ADMIN") {
      const orders = await db.getOrders();
      return NextResponse.json({ orders });
    } else {
      const orders = await db.getOrdersByUserId(user.id);
      return NextResponse.json({ orders });
    }
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Déterminer les frais de zone officiels
    const zone = DELIVERY_ZONES.find((z) => z.id === data.deliveryZoneId) || {
      id: "autre-benin",
      country: "BJ" as const,
      name: "Autre ville du Bénin",
      fee: 5000,
    };

    if (!isValidPhoneForCountry(data.customerPhone, zone.country)) {
      return NextResponse.json(
        {
          error:
            zone.country === "CI"
              ? "Veuillez entrer un numéro de téléphone ivoirien valide (+225, 10 chiffres)."
              : "Veuillez entrer un numéro de téléphone valide au Bénin (+229).",
        },
        { status: 400 }
      );
    }

    // Vérifier les stocks en temps réel
    for (const item of data.items) {
      const product = await db.getProductById(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Le produit ${item.productName} n'existe plus.` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Stock insuffisant pour ${product.name}. Seulement ${product.stock} disponible(s).`,
          },
          { status: 400 }
        );
      }
    }

    const user = await getCurrentUser();

    // Créer la commande
    const order = await db.createOrder({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      city: data.city,
      district: data.district,
      address: data.address,
      deliveryInstructions: data.deliveryInstructions,
      deliveryZoneId: zone.id,
      deliveryZoneName: zone.name,
      deliveryFee: zone.fee,
      items: data.items,
      userId: user?.id,
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Impossible de créer la commande. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
