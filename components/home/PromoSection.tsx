import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, Clock, ArrowRight } from "lucide-react";

export function PromoSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#512264] to-[#361343] text-white p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#F37021]/20 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F37021] text-white text-xs font-black uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Offre Spéciale Arrivage Dubaï & USA</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                Équipez-vous en professionnel : <br />
                <span className="text-[#F37021]">HP EliteBook Core i7</span> à prix réduit
              </h2>

              <p className="text-sm sm:text-base text-purple-100 max-w-xl">
                Intel Core i7 11e Génération, 16 Go de RAM, SSD 512 Go rapide, corps aluminium brossé et autonomie longue durée. Testé à 100% avec Windows 11 Pro et chargeur d&apos;origine inclus.
              </p>

              <div className="flex items-center gap-3 py-2">
                <div className="flex items-center gap-2 text-xs text-purple-200 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-[#F37021]" />
                  <span>Stock limité : Plus que 15 pièces disponibles</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-baseline sm:items-center gap-4 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#F37021]">345 000 FCFA</span>
                  <span className="text-sm text-purple-300 line-through">395 000 FCFA</span>
                </div>
                <Link
                  href="/produits/hp-elitebook-840-g8-core-i7-16gb-512gb"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#F37021] hover:bg-[#D95D16] text-white text-sm font-bold rounded-xl shadow-md transition-all group"
                >
                  <span>Commander immédiatement</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-white/10 border border-white/20 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
                  alt="HP EliteBook Promotion Fxxtyschop"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
