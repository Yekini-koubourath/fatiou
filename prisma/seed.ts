
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  INITIAL_PRODUCTS,
  CATEGORIES,
  STORE_SETTINGS,
} from "../lib/data";

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("La variable DIRECT_URL est absente du fichier .env");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Début du seed Fxxtyschop...");

  // 1. Vérifier les informations de l'administrateur
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminName = process.env.ADMIN_NAME?.trim() || "Administrateur Fxxtyschop";
  const adminPhone = process.env.ADMIN_PHONE?.trim();

  if (!adminEmail || !adminPassword || adminPassword.length < 12) {
    throw new Error(
      "Configure ADMIN_EMAIL et ADMIN_PASSWORD (minimum 12 caractères) dans .env."
    );
  }

  // 2. Créer ou mettre à jour le compte administrateur
  console.log("Configuration du compte administrateur...");

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin && existingAdmin.role !== "ADMIN") {
    throw new Error(
      "Cette adresse existe déjà avec un rôle client. Choisis une autre adresse ADMIN_EMAIL."
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      phone: adminPhone || null,
      passwordHash,
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      name: adminName,
      phone: adminPhone || null,
      passwordHash,
      role: "ADMIN",
    },
  });

  // 3. Créer les catégories
  console.log("Création des catégories...");

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
      },
      create: {
        id: `cat-${cat.slug}`,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        image: cat.image,
      },
    });
  }

  // 4. Créer les produits
  console.log("Création des produits...");

  for (const prod of INITIAL_PRODUCTS) {
    const category = await prisma.category.findUnique({
      where: { slug: prod.category },
    });

    if (!category) {
      throw new Error(`Catégorie introuvable pour le produit : ${prod.name}`);
    }

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        brand: prod.brand,
        categoryId: category.id,
        description: prod.description,
        shortDescription: prod.shortDescription ?? null,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice ?? null,
        stock: prod.stock,
        lowStockThreshold: prod.lowStockThreshold ?? 3,
        images: prod.images,
        specs: prod.specs as any,
        isFeatured: prod.isFeatured ?? false,
        isNew: prod.isNew ?? false,
        rating: prod.rating ?? 5,
        reviewCount: prod.reviewCount ?? 0,
      },
      create: {
        id: prod.id,
        slug: prod.slug,
        name: prod.name,
        brand: prod.brand,
        categoryId: category.id,
        description: prod.description,
        shortDescription: prod.shortDescription ?? null,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice ?? null,
        stock: prod.stock,
        lowStockThreshold: prod.lowStockThreshold ?? 3,
        images: prod.images,
        specs: prod.specs as any,
        isFeatured: prod.isFeatured ?? false,
        isNew: prod.isNew ?? false,
        rating: prod.rating ?? 5,
        reviewCount: prod.reviewCount ?? 0,
      },
    });
  }

  // 5. Enregistrer les paramètres de la boutique
  console.log("Configuration des paramètres...");

  for (const [key, value] of Object.entries(STORE_SETTINGS)) {
    await prisma.storeSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: {
        key,
        value: String(value),
      },
    });
  }

  console.log("Seed terminé avec succès !");
  console.log(`Administrateur : ${adminEmail}`);
  console.log(`Catégories : ${CATEGORIES.length}`);
  console.log(`Produits : ${INITIAL_PRODUCTS.length}`);
}

main()
  .catch((error) => {
    console.error("Erreur pendant le seed :", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
