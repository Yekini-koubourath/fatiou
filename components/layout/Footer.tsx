import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RefreshCw,
  CreditCard,
  MessageCircle,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1E1B26] text-gray-300 pt-16 pb-8 border-t-4 border-[#512264]">
      {/* 1. Bandeau de Réassurance */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-white/10">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#512264] flex items-center justify-center shrink-0 text-[#F37021]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Livraison Bénin & Côte d&apos;Ivoire</h4>
              <p className="text-xs text-gray-400">Bénin et toutes les villes de Côte d&apos;Ivoire</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#512264] flex items-center justify-center shrink-0 text-[#F37021]">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Paiement à la Livraison</h4>
              <p className="text-xs text-gray-400">Contrôlez avant de régler</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#512264] flex items-center justify-center shrink-0 text-[#F37021]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Appareils 100% Certifiés</h4>
              <p className="text-xs text-gray-400">Garantie jusqu&apos;à 1 an</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-[#512264] flex items-center justify-center shrink-0 text-[#F37021]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Service Après-Vente</h4>
              <p className="text-xs text-gray-400">Assistance réactive locale</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Colonnes Principales */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Logo & Présentation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#F37021] flex items-center justify-center text-white font-black text-xl">
                F
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                FXXTY<span className="text-[#F37021]">SCHOP</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Votre destination privilégiée au Bénin et en Côte d&apos;Ivoire pour l&apos;achat d&apos;iPhones, smartphones Samsung, MacBook et ordinateurs portables professionnels de haute qualité avec garantie et support dédié.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/22962336142"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Commander directement via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Catalogue */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#F37021] pl-2">
              Catalogue
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/boutique?category=smartphones" className="hover:text-white transition-colors">
                  iPhones (11 à 15 Pro Max)
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=smartphones" className="hover:text-white transition-colors">
                  Samsung Galaxy S & A
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=laptops" className="hover:text-white transition-colors">
                  MacBook Pro & Air
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=laptops" className="hover:text-white transition-colors">
                  HP EliteBook & ProBook
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=laptops" className="hover:text-white transition-colors">
                  Dell Latitude & XPS
                </Link>
              </li>
              <li>
                <Link href="/boutique?category=accessoires" className="hover:text-white transition-colors">
                  Chargeurs & Écouteurs
                </Link>
              </li>
            </ul>
          </div>

          {/* Villes desservies */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#F37021] pl-2">
              Zones Desservies
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Cotonou (Express 2h-4h)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Abomey-Calavi & Akpakpa</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Porto-Novo & Sèmè</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Ouidah & Pahou</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                <span>Parakou (Agence/Gare)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                <span>Bohicon & Natitingou</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Abidjan : Cocody, Plateau, Yopougon, Abobo...</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Bingerville, Anyama & Grand-Bassam</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Dabou, Agboville & Adzopé</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Yamoussoukro, Bouaké, Gagnoa & Daloa</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Man, Korhogo, San-Pédro et autres villes</span>
              </li>
            </ul>
          </div>

          {/* Contact & Boutique */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-[#F37021] pl-2">
              Contact & Accueil
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F37021] shrink-0 mt-0.5" />
                <span>pk10, Cotonou, Bénin</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#F37021] shrink-0" />
                <a href="tel:+22962336142" className="hover:text-white transition-colors">
                  +229 62 33 61 42
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#F37021] shrink-0" />
                <a href="mailto:fatiouadjiboye43@gmail.com" className="hover:text-white transition-colors">
                  fatiouadjiboye43@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#F37021] shrink-0" />
                <span>Lun - Sam : 08h30 - 20h00</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bas de page & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Fxxtyschop Bénin & Côte d&apos;Ivoire. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <Link href="/boutique" className="hover:text-white transition-colors">
              Catalogue
            </Link>
            <Link href="/panier" className="hover:text-white transition-colors">
              Mon Panier
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
