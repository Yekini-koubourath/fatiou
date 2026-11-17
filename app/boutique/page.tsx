import React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { db } from "@/lib/db";
import { SlidersHorizontal, Search, RefreshCw, X } from "lucide-react";

interface BoutiquePageProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    q?: string;
    sort?: string;
    promos?: string;
    inStock?: string;
  }>;
}

export default async function BoutiquePage({ searchParams }: BoutiquePageProps) {
  const params = await searchParams;
  const currentCategory = params.category || "all";
  const currentBrand = params.brand || "all";
  const searchQuery = params.q || "";
  const currentSort = params.sort || "recommended";
  const onlyPromos = params.promos === "true";
  const onlyInStock = params.inStock === "true";

  // Récupérer les produits
  let products = await db.getProducts({
    category: currentCategory,
    brand: currentBrand,
    query: searchQuery,
    inStock: onlyInStock,
  });

  // Filtrer promotions si demandé
  if (onlyPromos) {
    products = products.filter(
      (p) => p.compareAtPrice && p.compareAtPrice > p.price
    );
  }

  // Trier les produits
  if (currentSort === "price-asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (currentSort === "newest") {
    products.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  const categories = [
    { id: "all", label: "Toutes les catégories" },
    { id: "smartphones", label: "Smartphones" },
    { id: "laptops", label: "Ordinateurs Portables" },
    { id: "tablets", label: "Tablettes & iPad" },
    { id: "accessoires", label: "Accessoires & Audio" },
  ];

  const brands = [
    { id: "all", label: "Toutes les marques" },
    { id: "Apple", label: "Apple" },
    { id: "Samsung", label: "Samsung" },
    { id: "HP", label: "HP" },
    { id: "Dell", label: "Dell" },
    { id: "Anker", label: "Anker" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* En-tête de la Boutique */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Catalogue Produits High-Tech
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {products.length} appareil{products.length > 1 ? "s" : ""} disponible
              {products.length > 1 ? "s" : ""} avec livraison au Bénin et en Côte d&apos;Ivoire
            </p>
          </div>

          {/* Recherche rapide */}
          <form method="GET" action="/boutique" className="relative max-w-md w-full">
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Rechercher par modèle, marque..."
              className="w-full pl-10 pr-24 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            {currentCategory !== "all" && (
              <input type="hidden" name="category" value={currentCategory} />
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 px-3 py-1 bg-[#512264] text-white text-xs font-bold rounded-lg hover:bg-[#6B21A8] transition-colors"
            >
              Filtrer
            </button>
          </form>
        </div>

        {/* Filtres actifs / Tags */}
        {(currentCategory !== "all" || currentBrand !== "all" || searchQuery || onlyPromos || onlyInStock) && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-xs">
            <span className="font-semibold text-gray-500">Filtres appliqués :</span>
            {currentCategory !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-100 text-[#512264] font-medium">
                Catégorie : {categories.find((c) => c.id === currentCategory)?.label || currentCategory}
                <Link href={`/boutique?brand=${currentBrand}&sort=${currentSort}`} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {currentBrand !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-100 text-[#512264] font-medium">
                Marque : {currentBrand}
                <Link href={`/boutique?category=${currentCategory}&sort=${currentSort}`} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {onlyPromos && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-100 text-[#F37021] font-bold">
                Promotions actives
                <Link href={`/boutique?category=${currentCategory}&brand=${currentBrand}&sort=${currentSort}`} className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-200 text-gray-800 font-medium">
                &ldquo;{searchQuery}&rdquo;
                <Link href="/boutique" className="hover:text-red-500">
                  <X className="w-3 h-3" />
                </Link>
              </span>
            )}
            <Link
              href="/boutique"
              className="text-[#F37021] hover:underline font-bold ml-2 inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Réinitialiser
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Colonne Filtres Latérale */}
        <aside className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-6">
            <div className="flex items-center gap-2 font-black text-gray-900 pb-3 border-b border-gray-100 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-[#512264]" />
              <span>Filtrer les Produits</span>
            </div>

            {/* Par Catégorie */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                Catégorie
              </h4>
              <ul className="space-y-1.5 text-sm">
                {categories.map((cat) => {
                  const isActive = currentCategory === cat.id;
                  return (
                    <li key={cat.id}>
                      <Link
                        href={`/boutique?category=${cat.id}&brand=${currentBrand}&sort=${currentSort}`}
                        className={`block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-[#512264] text-white font-bold"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {cat.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Par Marque */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                Marque
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {brands.map((b) => {
                  const isActive = currentBrand === b.id;
                  return (
                    <Link
                      key={b.id}
                      href={`/boutique?category=${currentCategory}&brand=${b.id}&sort=${currentSort}`}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-[#F37021] text-white font-bold"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {b.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Promotions & Disponibilité */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <Link
                href={`/boutique?category=${currentCategory}&brand=${currentBrand}&promos=${onlyPromos ? "false" : "true"}&sort=${currentSort}`}
                className={`flex items-center justify-between p-2 rounded-lg text-xs font-bold transition-colors ${
                  onlyPromos ? "bg-orange-100 text-[#F37021]" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>⚡ En promotion seulement</span>
                <span className="text-xs">{onlyPromos ? "✓" : ""}</span>
              </Link>

              <Link
                href={`/boutique?category=${currentCategory}&brand=${currentBrand}&inStock=${onlyInStock ? "false" : "true"}&sort=${currentSort}`}
                className={`flex items-center justify-between p-2 rounded-lg text-xs font-bold transition-colors ${
                  onlyInStock ? "bg-emerald-50 text-emerald-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>📦 En stock uniquement</span>
                <span className="text-xs">{onlyInStock ? "✓" : ""}</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Grille des Produits */}
        <div className="lg:col-span-3 space-y-6">
          {/* Barre de tri */}
          <div className="bg-white px-4 py-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span>Affichage de <strong>{products.length}</strong> résultat{products.length > 1 ? "s" : ""}</span>
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="font-semibold text-gray-700">Trier par :</label>
              <div className="flex items-center gap-1 font-medium">
                <Link
                  href={`/boutique?category=${currentCategory}&brand=${currentBrand}&sort=recommended`}
                  className={`px-2 py-1 rounded-md ${currentSort === "recommended" ? "bg-[#512264] text-white font-bold" : "hover:bg-gray-100"}`}
                >
                  Populaire
                </Link>
                <Link
                  href={`/boutique?category=${currentCategory}&brand=${currentBrand}&sort=price-asc`}
                  className={`px-2 py-1 rounded-md ${currentSort === "price-asc" ? "bg-[#512264] text-white font-bold" : "hover:bg-gray-100"}`}
                >
                  Prix croissant
                </Link>
                <Link
                  href={`/boutique?category=${currentCategory}&brand=${currentBrand}&sort=price-desc`}
                  className={`px-2 py-1 rounded-md ${currentSort === "price-desc" ? "bg-[#512264] text-white font-bold" : "hover:bg-gray-100"}`}
                >
                  Prix décroissant
                </Link>
              </div>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-50 text-[#512264] flex items-center justify-center mx-auto text-xl font-bold">
                !
              </div>
              <h3 className="text-lg font-bold text-gray-900">Aucun produit ne correspond à vos filtres</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Essayez d&apos;élargir vos critères de recherche ou réinitialisez les filtres pour découvrir l&apos;ensemble de nos téléphones et ordinateurs portables.
              </p>
              <Link
                href="/boutique"
                className="inline-block px-6 py-2.5 bg-[#512264] text-white text-xs font-bold rounded-xl hover:bg-[#6B21A8]"
              >
                Réinitialiser la recherche
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
