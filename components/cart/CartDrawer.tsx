"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from "lucide-react";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-[#512264] text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#F37021]" />
              <h2 className="text-lg font-bold">Mon Panier ({totalItems})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              aria-label="Fermer le panier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corps de la modale */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-4 text-[#512264]">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Votre panier est vide</h3>
                <p className="text-sm text-gray-500 max-w-xs mb-6">
                  Découvrez nos offres exceptionnelles sur les smartphones et ordinateurs portables.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-[#512264] text-white rounded-lg text-sm font-semibold hover:bg-[#6B21A8] transition-colors"
                >
                  Explorer le catalogue
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 relative group"
                  >
                    <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#512264] uppercase tracking-wider mb-0.5">
                        {item.brand}
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                        {item.name}
                      </h4>
                      <div className="text-sm font-bold text-[#F37021]">
                        {formatPrice(item.price)}
                      </div>

                      {/* Quantité & Suppression */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-semibold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="p-1.5 hover:bg-gray-100 text-gray-600 disabled:opacity-30 transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-gray-400 hover:text-red-500 p-1.5 rounded transition-colors"
                          aria-label="Supprimer l'article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Panier */}
          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/80 space-y-4">
              <div className="flex items-center gap-2 text-xs text-gray-600 bg-white p-2.5 rounded-lg border border-gray-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Paiement à la livraison au Bénin • Contrôle du colis avant paiement</span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-600 font-medium">Sous-total :</span>
                <span className="text-xl font-black text-[#512264]">{formatPrice(subtotal)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/panier"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full text-center py-3 border border-gray-300 bg-white text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
                >
                  Voir le panier
                </Link>
                <Link
                  href="/commande"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#F37021] text-white font-bold rounded-xl text-sm hover:bg-[#D95D16] shadow-md hover:shadow-lg transition-all"
                >
                  Commander <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
