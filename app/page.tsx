import React from "react";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, Headphones, Check } from "lucide-react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryCards } from "@/components/home/CategoryCards";
import { PromoSection } from "@/components/home/PromoSection";
import { ProductCard } from "@/components/product/ProductCard";
import { db } from "@/lib/db";

export default async function HomePage() {
  const allProducts = await db.getProducts();

  // Produits vedettes
  const featuredProducts = allProducts.filter((p) => p.isFeatured).slice(0, 8);
  // Nouveautés
  const newProducts = allProducts.filter((p) => p.isNew).slice(0, 4);

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Bannière Hero */}
      <HeroBanner />

      {/* 2. Catégories Populaires */}
      <CategoryCards />

      {/* 3. Section Produits Vedettes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#F37021] uppercase tracking-wider">
              Sélection recommandée
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Produits Phares Fxxtyschop
            </h2>
          </div>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#512264] hover:text-[#F37021] transition-colors"
          >
            <span>Voir toute la boutique</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Section Bannière Promotionnelle */}
      <PromoSection />

      {/* 5. Nouveaux Arrivages */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#512264] uppercase tracking-wider">
              Derniers arrivages
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Tout Juste Arrivés en Magasin
            </h2>
          </div>
          <Link
            href="/boutique?sort=newest"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#512264] hover:text-[#F37021] transition-colors"
          >
            <span>Découvrir les nouveautés</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Section Pourquoi Choisir Fxxtyschop & Avis Clients Bénin */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#F37021] uppercase tracking-wider">
              Confiance & Sécurité
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Pourquoi nous confier votre prochain achat high-tech ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#512264] flex items-center justify-center mx-auto mb-4 font-bold">
                <ShieldCheck className="w-8 h-8 text-[#512264]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Authenticité & Diagnostic 30 points</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Chaque smartphone et PC est testé individuellement par nos techniciens : batterie, écran d&apos;origine, carte mère et connectivité. Zéro surprise.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-[#F37021] flex items-center justify-center mx-auto mb-4 font-bold">
                <Truck className="w-8 h-8 text-[#F37021]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Livraison avec Vérification sur Place</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Notre livreur vous remet le colis à domicile ou au bureau. Vous allumez, testez l&apos;appareil puis vous réglez en toute quiétude.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 font-bold">
                <Headphones className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Service Après-Vente Réactif à Cotonou</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Une équipe technique basée directement à Cotonou pour vous conseiller, transférer vos données et assurer la garantie de votre équipement.
              </p>
            </div>
          </div>

          {/* Témoignages Clients */}
          <div className="border-t border-gray-100 pt-12">
            <h3 className="text-xl font-bold text-center text-gray-900 mb-8">
              Ce que disent nos clients au Bénin
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100">
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic mb-4">
                  &ldquo;J&apos;ai commandé mon iPhone 13 à 11h depuis mon bureau à la Haie Vive, à 14h30 le livreur était déjà là ! Téléphone impeccable avec batterie à 100%. Je recommande à 100%.&rdquo;
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900">Dr. Marius A. (Cotonou)</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Achat vérifié
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100">
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic mb-4">
                  &ldquo;Le HP EliteBook Core i7 est une bête de course pour mon travail de comptable. Machine très propre, rapide, et le paiement à la livraison à Calavi m&apos;a totalement rassuré.&rdquo;
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900">Chantal T. (Abomey-Calavi)</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Achat vérifié
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-purple-50/50 border border-purple-100">
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic mb-4">
                  &ldquo;Livraison expédiée à Parakou sans le moindre souci via la compagnie de bus avec le numéro de colis fourni. Fxxtyschop est de loin la boutique la plus sérieuse.&rdquo;
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900">Armel K. (Parakou)</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Achat vérifié
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
