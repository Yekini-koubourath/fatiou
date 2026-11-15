"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/utils";

export default function PanierPage() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-20 h-20 rounded-full bg-purple-50 text-[#512264] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Votre panier est actuellement vide</h1>
          <p className="text-sm text-gray-500">
            Vous n&apos;avez pas encore sélectionné de smartphone ou d&apos;ordinateur portable.
          </p>
          <div className="pt-4">
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#512264] text-white text-sm font-bold rounded-xl hover:bg-[#6B21A8] transition-colors"
            >
              <span>Découvrir nos appareils</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Mon Panier d&apos;Achats
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalItems} article{totalItems > 1 ? "s" : ""} dans votre sélection
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Vider le panier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Liste des Articles */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-xs gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-contain p-2"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-[#512264] uppercase tracking-wider">
                    {item.brand}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                    <Link href={`/produits/${item.slug}`} className="hover:text-[#512264]">
                      {item.name}
                    </Link>
                  </h3>
                  <div className="text-sm font-black text-[#F37021] mt-0.5">
                    {formatPrice(item.price)}
                  </div>
                </div>
              </div>

              {/* Sélecteur de quantité & Suppression */}
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="p-2 hover:bg-gray-200 text-gray-600 transition-colors"
                    aria-label="Diminuer la quantité"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-2 hover:bg-gray-200 text-gray-600 disabled:opacity-30 transition-colors"
                    aria-label="Augmenter la quantité"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[100px]">
                  <span className="text-xs text-gray-400 block sm:hidden">Total ligne</span>
                  <span className="text-base font-black text-[#512264]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  aria-label="Supprimer du panier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4">
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#512264] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continuer mes achats</span>
            </Link>
          </div>
        </div>

        {/* Récapitulatif Commande */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-5 sticky top-28">
            <h2 className="text-lg font-black text-gray-900 pb-3 border-b border-gray-100">
              Résumé de la commande
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total articles :</span>
                <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison Bénin :</span>
                <span className="text-xs text-emerald-600 font-bold">
                  Calculé à l&apos;étape suivante (Dès 1 500 F)
                </span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Sous-total :</span>
                <span className="text-2xl font-black text-[#512264]">{formatPrice(subtotal)}</span>
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 space-y-2 text-xs text-purple-900">
              <div className="flex items-center gap-2 font-bold">
                <Truck className="w-4 h-4 text-[#F37021] shrink-0" />
                <span>Livraison express partout au Bénin</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Paiement en espèces ou MoMo à la réception</span>
              </div>
            </div>

            <Link
              href="/commande"
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#F37021] hover:bg-[#D95D16] text-white font-extrabold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all text-sm group"
            >
              <span>Passer la commande</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
