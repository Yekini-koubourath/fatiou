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
 * Zones de livraison au Bénin avec frais standards
 */
export const BENIN_DELIVERY_ZONES = [
  { id: "cotonou", name: "Cotonou (Intra-muros)", fee: 1500, delay: "2h à 6h (Même jour)" },
  { id: "calavi", name: "Abomey-Calavi / Akpakpa", fee: 2000, delay: "4h à 8h (Même jour)" },
  { id: "porto-novo", name: "Porto-Novo & Environs", fee: 3000, delay: "24h ouvrées" },
  { id: "ouidah", name: "Ouidah & Environs", fee: 3500, delay: "24h ouvrées" },
  { id: "parakou", name: "Parakou (Expédition gare/agence)", fee: 5000, delay: "24h à 48h" },
  { id: "autre-benin", name: "Autre ville du Bénin", fee: 5000, delay: "48h à 72h" },
] as const;

/**
 * Validation basique numéro de téléphone Bénin
 */
export function isValidBeninPhone(phone: string): boolean {
  // Format attendu : +229 suivi de 8 à 10 chiffres, ou simplement 8 à 10 chiffres (nouveau plan de numérotation)
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");
  return /^(\+229)?[0-9]{8,10}$/.test(cleaned);
}
