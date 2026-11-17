import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un montant en Francs CFA (XOF)
 * Exemple : 150000 -> "150 000 FCFA"
 */
export function formatPrice(amount: number): string {
  if (isNaN(amount)) return "0 FCFA";
  const formatted = new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} FCFA`;
}

/**
 * Formate une date en français
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Zones de livraison avec frais standards
 */
export const BENIN_DELIVERY_ZONES = [
  { id: "cotonou", country: "BJ", name: "Cotonou (Intra-muros)", fee: 1500, delay: "2h à 6h (Même jour)" },
  { id: "calavi", country: "BJ", name: "Abomey-Calavi / Akpakpa", fee: 2000, delay: "4h à 8h (Même jour)" },
  { id: "porto-novo", country: "BJ", name: "Porto-Novo & Environs", fee: 3000, delay: "24h ouvrées" },
  { id: "ouidah", country: "BJ", name: "Ouidah & Environs", fee: 3500, delay: "24h ouvrées" },
  { id: "parakou", country: "BJ", name: "Parakou (Expédition gare/agence)", fee: 5000, delay: "24h à 48h" },
  { id: "autre-benin", country: "BJ", name: "Autre ville du Bénin", fee: 5000, delay: "48h à 72h" },
] as const;

export const COTE_IVOIRE_DELIVERY_ZONES = [
  { id: "ci-abidjan-proche", country: "CI", name: "Abidjan (Cocody, Plateau, Yopougon...) — jusqu'à 20 km", fee: 1500, delay: "2h à 6h (Même jour)" },
  { id: "ci-abidjan-peripherie", country: "CI", name: "Bingerville, Anyama, Grand-Bassam — 20 à 50 km", fee: 2500, delay: "Même jour à 24h" },
  { id: "ci-proche", country: "CI", name: "Dabou, Agboville, Adzopé — 50 à 150 km", fee: 5000, delay: "24h à 48h" },
  { id: "ci-intermediaire", country: "CI", name: "Yamoussoukro, Bouaké, Gagnoa, Daloa — 150 à 350 km", fee: 8000, delay: "24h à 72h" },
  { id: "ci-eloignee", country: "CI", name: "Man, Korhogo, San-Pédro et autres villes éloignées — plus de 350 km", fee: 12000, delay: "48h à 72h (Agence)" },
] as const;

export const BENIN_CITIES = [
  "Cotonou",
  "Abomey-Calavi",
  "Porto-Novo",
  "Ouidah",
  "Parakou",
  "Bohicon",
  "Natitingou",
  "Lokossa",
  "Djougou",
  "Kandi",
] as const;

export const COTE_IVOIRE_CITIES = [
  "Abidjan",
  "Abengourou",
  "Aboisso",
  "Adzopé",
  "Agboville",
  "Anyama",
  "Bondoukou",
  "Bouaflé",
  "Bouaké",
  "Dabou",
  "Daloa",
  "Divo",
  "Ferkessédougou",
  "Gagnoa",
  "Grand-Bassam",
  "Guiglo",
  "Korhogo",
  "Man",
  "Odienné",
  "San-Pédro",
  "Sassandra",
  "Soubré",
  "Yamoussoukro",
] as const;

export type DeliveryCountry = "BJ" | "CI";

export const DELIVERY_ZONES = [...BENIN_DELIVERY_ZONES, ...COTE_IVOIRE_DELIVERY_ZONES];

/**
 * Validation basique du numéro de téléphone selon le pays de livraison
 */
export function isValidBeninPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  return /^(\+229)?[0-9]{8,10}$/.test(cleaned);
}

export function isValidPhoneForCountry(phone: string, country: DeliveryCountry): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  return country === "CI"
    ? /^(\+225)?[0-9]{10}$/.test(cleaned)
    : isValidBeninPhone(cleaned);
}
