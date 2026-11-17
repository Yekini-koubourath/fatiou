import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartContext";
import { ClientLayoutWrapper } from "@/components/layout/ClientLayoutWrapper";

export const metadata: Metadata = {
  title: "Fxxtyschop | Livraison au Bénin et en Côte d'Ivoire",
  description:
    "Boutique high-tech au Bénin et en Côte d'Ivoire : iPhones, Samsung Galaxy, MacBook, ordinateurs portables HP/Dell et accessoires certifiés. Livraison rapide à Cotonou et dans toutes les villes ivoiriennes.",
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
    "livraison Côte d'Ivoire",
    "téléphone Abidjan",
    "iPhone Côte d'Ivoire",
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
