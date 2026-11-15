import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, MessageCircle, Sparkles } from "lucide-react";

export function HeroBanner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#3b174a] via-[#512264] to-[#250d30] text-white py-16 lg:py-24">
      {/* Motifs géométriques décoratifs */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-[#F37021]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-[#6B21A8]/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Colonne Gauche : Texte & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-orange-200">
              <Sparkles className="w-3.5 h-3.5 text-[#F37021]" />
              <span>Nouveautés & Offres Exclusives Février 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              La haute technologie certifiée au{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F37021] to-amber-300">
                meilleur prix au Bénin
              </span>
            </h1>

            <p className="text-base sm:text-lg text-purple-100/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              iPhones neufs et révisés, Samsung Galaxy de dernière génération, ordinateurs portables HP & MacBook garantis. Commandez en toute confiance et payez en espèces ou MoMo à la réception de votre colis.
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/boutique"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-[#F37021] hover:bg-[#D95D16] text-white font-extrabold rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all text-sm group"
              >
                <span>Découvrir le Catalogue</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/22997000000?text=Bonjour%20Fxxtyschop%2C%20je%20souhaite%20des%20informations%20sur%20vos%20produits"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 backdrop-blur-xs transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Commander sur WhatsApp</span>
              </a>
            </div>

            {/* Micro-réassurances */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/15 text-xs text-purple-200">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#F37021] shrink-0" />
                <span>Livraison 4h (Cotonou & Calavi)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F37021] shrink-0" />
                <span>Garantie 6 à 12 mois</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                <span>Paiement à la livraison</span>
              </div>
            </div>
          </div>

          {/* Colonne Droite : Vitrine Visuelle Phare */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Carte flottante principale */}
              <div className="relative rounded-3xl bg-gradient-to-b from-white/15 to-white/5 p-4 border border-white/20 backdrop-blur-xl shadow-2xl overflow-hidden group">
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-purple-950/40">
                  <Image
                    src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80"
                    alt="iPhone 15 Pro Max chez Fxxtyschop"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[#F37021] uppercase tracking-wider">
                        Vedette du moment
                      </span>
                      <h4 className="text-lg font-bold text-white">iPhone 15 Pro Max Titane</h4>
                      <p className="text-xs text-gray-300">256 Go • Scellé d&apos;origine</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400 line-through">950 000 F</span>
                      <div className="text-lg font-black text-[#F37021]">890 000 FCFA</div>
                    </div>
                  </div>
                </div>

                {/* Badge Flottant Promo */}
                <div className="absolute -top-3 -right-3 bg-[#F37021] text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                  PRIX PROMO !
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
