"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  MessageCircle,
  Star,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart/CartContext";

export function ProductDetailView({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const images = product.images.length > 0
    ? product.images
    : ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"];

  const discountAmount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice - product.price
      : 0;

  const discountPercentage =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((discountAmount / product.compareAtPrice) * 100)
      : null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 3);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const ok = addToCart(product, quantity);
    if (ok) {
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 2000);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    router.push("/commande");
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour Fxxtyschop ! Je suis intéressé(e) par votre produit : ${product.name} (Prix : ${formatPrice(product.price)}). Est-il toujours disponible pour une livraison ?`
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* 1. Galerie d'images */}
      <div className="lg:col-span-6 space-y-4">
        {/* Grande image principale */}
        <div className="relative aspect-square w-full rounded-3xl bg-white border border-gray-200 overflow-hidden shadow-sm flex items-center justify-center p-6">
          <Image
            src={images[selectedImage]}
            alt={product.name}
            fill
            unoptimized
            className="object-contain p-6 transition-all duration-300"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          {discountPercentage && (
            <div className="absolute top-4 left-4 bg-[#F37021] text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
              -{discountPercentage}% DE REMISE
            </div>
          )}

          {product.isNew && (
            <div className="absolute top-4 right-4 bg-[#512264] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              NOUVEAU MODÈLE
            </div>
          )}
        </div>

        {/* Miniatures */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative w-20 h-20 rounded-xl bg-white border-2 overflow-hidden shrink-0 transition-all ${
                  selectedImage === idx
                    ? "border-[#512264] shadow-md scale-95"
                    : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt={`Aperçu ${idx + 1}`} fill unoptimized className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}

        {/* Bloc Réassurance Produit */}
        <div className="bg-purple-50/60 rounded-2xl p-5 border border-purple-100 space-y-3 text-xs text-gray-700">
          <div className="flex items-center gap-2.5 font-bold text-[#512264]">
            <Truck className="w-4 h-4 text-[#F37021] shrink-0" />
            <span>Livraison rapide au Bénin et dans toute la Côte d&apos;Ivoire</span>
          </div>
          <div className="flex items-center gap-2.5 font-bold text-[#512264]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Garantie : {product.specs?.garantie || "6 mois magasin avec SAV local à Cotonou"}</span>
          </div>
          <div className="flex items-center gap-2.5 font-bold text-[#512264]">
            <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Paiement à la livraison après inspection de l&apos;appareil</span>
          </div>
        </div>
      </div>

      {/* 2. Détails & Fiche d'achat */}
      <div className="lg:col-span-6 space-y-6">
        {/* Catégorie & Titre */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-extrabold text-[#512264] uppercase tracking-wider bg-purple-100 px-2.5 py-0.5 rounded-md">
              {product.brand} • {product.categoryLabel || product.category}
            </span>
            <div className="flex items-center gap-1.5 text-amber-500">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                ))}
              </div>
              <span className="font-bold text-gray-800 text-xs">{product.rating || 5.0}</span>
              <span className="text-gray-400 text-xs">({product.reviewCount || 12} avis clients)</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-tight">
            {product.name}
          </h1>

          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Prix & Économies */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-[#512264]">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-base text-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {discountAmount > 0 && (
            <p className="text-xs text-emerald-700 font-bold mt-1">
              🎉 Vous économisez {formatPrice(discountAmount)} sur cet achat !
            </p>
          )}

          {/* Statut Stock */}
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-xs">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 text-red-600 font-bold">
                <AlertCircle className="w-4 h-4" /> Rupture de stock momentanée
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                <AlertCircle className="w-4 h-4" /> Attention : Seulement {product.stock} exemplaires restants !
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle className="w-4 h-4" /> En stock - Disponible pour expédition immédiate
              </span>
            )}
            <span className="text-gray-500 font-medium">Référence : {product.slug.substring(0, 15)}</span>
          </div>
        </div>

        {/* Sélecteur de Quantité & Boutons d'achat */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-700 uppercase">Quantité :</span>
            <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden shadow-xs">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                className="p-2.5 hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors"
                aria-label="Diminuer la quantité"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 font-bold text-gray-900 text-sm">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                disabled={quantity >= product.stock || isOutOfStock}
                className="p-2.5 hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors"
                aria-label="Augmenter la quantité"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-gray-500">
              (Total : <strong>{formatPrice(product.price * quantity)}</strong>)
            </span>
          </div>

          {/* Boutons d'action CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98] ${
                addedAnimation
                  ? "bg-emerald-600 text-white"
                  : "bg-purple-100 hover:bg-purple-200 text-[#512264]"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Ajouté au panier !</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 text-[#F37021]" />
                  <span>Ajouter au Panier</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-[#F37021] hover:bg-[#D95D16] shadow-lg hover:shadow-orange-500/25 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="w-5 h-5" />
              <span>Commander Maintenant</span>
            </button>
          </div>

          {/* Bouton WhatsApp */}
          <a
            href={`https://wa.me/22962336142?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Commander directement via WhatsApp (+229 62 33 61 42)</span>
          </a>
        </div>

        {/* Fiche Technique & Spécifications */}
        <div className="pt-6 border-t border-gray-200 space-y-4">
          <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">
            Fiche Technique Détaillée
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {Object.entries(product.specs || {}).map(([key, value]) => {
              if (!value) return null;
              const labels: Record<string, string> = {
                ram: "Mémoire RAM",
                stockage: "Espace de stockage",
                processeur: "Processeur",
                ecran: "Écran",
                batterie: "Autonomie / Batterie",
                camera: "Appareil photo",
                etat: "État du matériel",
                garantie: "Garantie offerte",
                couleur: "Coloris",
                puissance: "Puissance de charge",
                port: "Connectique",
                compatibilite: "Compatibilité",
                capacite: "Capacité réelle",
              };
              const displayLabel = labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <div
                  key={key}
                  className="flex flex-col p-2.5 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <span className="text-gray-500 text-[11px] font-medium">{displayLabel}</span>
                  <span className="text-gray-900 font-bold mt-0.5">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
