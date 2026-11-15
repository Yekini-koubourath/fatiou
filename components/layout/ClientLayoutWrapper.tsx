"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Sur l'espace administration, aucun Header, Footer ou Panier client ne s'affiche
    return <div className="min-h-screen bg-gray-100">{children}</div>;
  }

  // Pour toutes les pages publiques de la boutique
  return (
    <>
      <Header />
      <CartDrawer />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
