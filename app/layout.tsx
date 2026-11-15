import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "Fxxtyschop Bénin | Vente d'iPhones, Samsung & PC Portables",
  description:
    "Boutique high-tech de référence au Bénin. Achat d'iPhones, Samsung Galaxy, MacBook, ordinateurs portables HP/Dell et accessoires certifiés. Livraison rapide sous 4h à Cotonou et Calavi, paiement à la livraison.",
  keywords: [
    "Fxxtyschop",
    "téléphone Bénin",
    "iPhone Cotonou",
    "Samsung Bénin",
    "ordinateur portable Cotonou",
    "MacBook Bénin",
    "boutique high tech Bénin",
    "achat téléphone Cotonou",
    "paiement à la livraison Bénin",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#F8F8FA] text-[#1E1B26]">
        <CartProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
