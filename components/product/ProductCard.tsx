"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Star, CheckCircle, AlertCircle } from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const discountPercentage =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 3);
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Encart Image */}
        <div className="relative aspect-square w-full bg-gray-50 overflow-hidden">
          <Link href={`/produits/${product.slug}`} className="block w-full h-full">
            <Image
              src={product.images[0] || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"}
              alt={product.name}
              fill
              unoptimized
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </Link>

          {/* Badges promo / new / stock */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {discountPercentage && (
              <span className="px-2 py-0.5 rounded-md bg-[#F37021] text-white text-[11px] font-black shadow-xs">
                -{discountPercentage}%
              </span>
            )}
            {product.isNew && (
              <span className="px-2 py-0.5 rounded-md bg-[#512264] text-white text-[11px] font-bold shadow-xs">
                NOUVEAU
              </span>
            )}
          </div>

          {/* Statut Stock discret */}
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold">
                <AlertCircle className="w-3 h-3" /> Rupture
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                Plus que {product.stock} en stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-medium border border-emerald-100">
                <CheckCircle className="w-3 h-3 text-emerald-500" /> En stock
              </span>
            )}
          </div>
        </div>

        {/* Détails Produit */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span className="font-bold text-[#512264] uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="font-semibold text-gray-700 text-xs">
                {product.rating || 4.9}
              </span>
              <span className="text-gray-400 text-[10px]">
                ({product.reviewCount || 12})
              </span>
            </div>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#512264] transition-colors line-clamp-2 mb-2">
            <Link href={`/produits/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Caractéristiques rapides */}
          <div className="flex flex-wrap gap-1 mb-4">
            {product.specs?.ram && (
              <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                {product.specs.ram}
              </span>
            )}
            {product.specs?.stockage && (
              <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-medium">
                {product.specs.stockage}
              </span>
            )}
            {product.specs?.etat && (
              <span className="text-[11px] bg-purple-50 text-[#512264] px-2 py-0.5 rounded-md font-medium">
                {product.specs.etat.split(" ")[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Prix & Bouton d'action */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-lg sm:text-xl font-black text-[#512264]">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(product, 1)}
          disabled={isOutOfStock}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-purple-50 text-[#512264] hover:bg-[#512264] hover:text-white group-hover:border-transparent active:scale-[0.98]"
        >
          <ShoppingBag className="w-4 h-4 text-[#F37021]" />
          <span>{isOutOfStock ? "Épuisé" : "Ajouter au panier"}</span>
        </button>
      </div>
    </div>
  );
}
