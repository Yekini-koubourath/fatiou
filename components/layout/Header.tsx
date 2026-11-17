"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Smartphone,
  Laptop,
  Headphones,
  SlidersHorizontal,
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";

export function Header() {
  const router = useRouter();
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/boutique?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* 1. Barre d'annonce supérieure */}
      <div className="bg-[#512264] text-white py-1.5 px-4 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F37021] animate-pulse"></span>
            <span>
              🚚 <strong>Express sous 4h à Cotonou & Calavi</strong> • Bénin et toutes les villes de Côte d&apos;Ivoire • Paiement à réception
            </span>
          </div>
          <div className="flex items-center gap-4 text-purple-200">
            <a
              href="https://wa.me/22962336142"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-[#F37021]" />
              <span>WhatsApp : +229 62 33 61 42</span>
            </a>
            <span className="hidden md:inline">•</span>
            <div className="hidden md:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Garantie certifiée</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Barre principale de navigation */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#512264] to-[#6B21A8] flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              F
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight leading-none">
                <span className="text-[#512264]">FXXTY</span>
                <span className="text-[#F37021]">SCHOP</span>
              </span>
              <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">
                Bénin & Côte d&apos;Ivoire • High-Tech
              </span>
            </div>
          </Link>

          {/* Barre de recherche (Desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg items-center relative"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher iPhone, Samsung, MacBook, HP EliteBook..."
              className="w-full pl-10 pr-24 py-2.5 rounded-full border border-gray-200 bg-gray-50 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#512264] focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5" />
            <button
              type="submit"
              className="absolute right-1 px-4 py-1.5 bg-[#512264] text-white text-xs font-semibold rounded-full hover:bg-[#6B21A8] transition-colors"
            >
              Chercher
            </button>
          </form>

          {/* Actions Panier & Mobile menu */}
          <div className="flex items-center gap-3">
            {/* Bouton Panier */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#512264] text-white rounded-xl hover:bg-[#6B21A8] transition-all shadow-sm hover:shadow-md relative cursor-pointer"
              aria-label="Ouvrir le panier"
            >
              <ShoppingBag className="w-5 h-5 text-[#F37021]" />
              <span className="hidden sm:inline text-sm font-bold">Mon Panier</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#F37021] text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Bouton Menu Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-[#512264] rounded-lg"
              aria-label="Menu de navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Navigation Thématique Catégories (Desktop) */}
      <nav className="hidden md:block bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-8 py-2.5 text-sm font-medium text-gray-700">
            <li>
              <Link
                href="/boutique"
                className="flex items-center gap-1.5 font-bold text-[#512264] hover:text-[#F37021] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Tous les Produits</span>
              </Link>
            </li>
            <li>
              <Link
                href="/boutique?category=smartphones"
                className="flex items-center gap-1.5 hover:text-[#512264] transition-colors"
              >
                <Smartphone className="w-4 h-4 text-gray-400" />
                <span>Smartphones (iPhone & Samsung)</span>
              </Link>
            </li>
            <li>
              <Link
                href="/boutique?category=laptops"
                className="flex items-center gap-1.5 hover:text-[#512264] transition-colors"
              >
                <Laptop className="w-4 h-4 text-gray-400" />
                <span>Ordinateurs Portables</span>
              </Link>
            </li>
            <li>
              <Link
                href="/boutique?category=accessoires"
                className="flex items-center gap-1.5 hover:text-[#512264] transition-colors"
              >
                <Headphones className="w-4 h-4 text-gray-400" />
                <span>Accessoires & Audio</span>
              </Link>
            </li>
            <li>
              <Link
                href="/boutique?promos=true"
                className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#F37021] font-bold text-xs hover:bg-[#F37021] hover:text-white transition-colors"
              >
                ⚡ Bonnes Affaires
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* 4. Menu Mobile Déroulant */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
          {/* Recherche mobile */}
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un modèle..."
              className="w-full pl-10 pr-20 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <button
              type="submit"
              className="absolute right-1 top-1 px-3 py-1.5 bg-[#512264] text-white text-xs font-semibold rounded-md"
            >
              OK
            </button>
          </form>

          {/* Liens de navigation mobile */}
          <div className="space-y-1 text-sm font-semibold">
            <Link
              href="/boutique"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-800 hover:bg-gray-50"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#512264]" />
              <span>Voir toute la boutique</span>
            </Link>
            <Link
              href="/boutique?category=smartphones"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-800 hover:bg-gray-50"
            >
              <Smartphone className="w-4 h-4 text-[#512264]" />
              <span>Smartphones (iPhones & Galaxy)</span>
            </Link>
            <Link
              href="/boutique?category=laptops"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-800 hover:bg-gray-50"
            >
              <Laptop className="w-4 h-4 text-[#512264]" />
              <span>Ordinateurs Portables</span>
            </Link>
            <Link
              href="/boutique?category=accessoires"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-800 hover:bg-gray-50"
            >
              <Headphones className="w-4 h-4 text-[#512264]" />
              <span>Accessoires & Chargeurs</span>
            </Link>
            <Link
              href="/panier"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-800 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-[#F37021]" />
                <span>Mon Panier</span>
              </div>
              {totalItems > 0 && (
                <span className="bg-[#F37021] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
