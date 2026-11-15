import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { ProductCard } from "@/components/product/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await db.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Produits similaires de la même catégorie
  const allProducts = await db.getProducts({ category: product.category });
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Fil d'Ariane (Breadcrumbs) */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto py-2">
        <Link href="/" className="hover:text-[#512264] shrink-0">
          Accueil
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-400" />
        <Link href="/boutique" className="hover:text-[#512264] shrink-0">
          Boutique
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-400" />
        <Link
          href={`/boutique?category=${product.category}`}
          className="hover:text-[#512264] shrink-0 capitalize"
        >
          {product.categoryLabel || product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gray-400" />
        <span className="text-gray-900 font-bold truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Vue Détaillée */}
      <ProductDetailView product={product} />

      {/* Produits Similaires */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-[#F37021] uppercase tracking-wider">
                Recommandations
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mt-1">
                Produits Similaires dans la Catégorie
              </h2>
            </div>
            <Link
              href={`/boutique?category=${product.category}`}
              className="text-xs font-bold text-[#512264] hover:text-[#F37021] transition-colors inline-flex items-center gap-1"
            >
              <span>Voir tout</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Bouton retour */}
      <div className="pt-6">
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#512264] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l&apos;ensemble du catalogue</span>
        </Link>
      </div>
    </div>
  );
}
