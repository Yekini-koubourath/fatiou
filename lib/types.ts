export type ProductCategory = 
  | "smartphones" 
  | "laptops" 
  | "tablets" 
  | "accessoires";

export interface ProductSpecs {
  ram?: string;
  stockage?: string;
  processeur?: string;
  ecran?: string;
  batterie?: string;
  camera?: string;
  etat?: string; // Neuf, Reconditionné Grade A, etc.
  couleur?: string;
  garantie?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  categoryLabel?: string;
  description: string;
  shortDescription?: string;
  price: number; // en FCFA
  compareAtPrice?: number; // Prix barré si promo
  stock: number;
  lowStockThreshold?: number;
  images: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  specs: ProductSpecs;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  quantity: number;
  stock: number;
  brand: string;
}

export type OrderStatus = 
  | "PENDING"      // En attente de confirmation
  | "CONFIRMED"    // Confirmée par Fxxtyschop
  | "PREPARING"    // En cours de préparation
  | "SHIPPED"      // En cours de livraison / Expédiée
  | "DELIVERED"    // Livrée & payée
  | "CANCELLED";   // Annulée

export interface OrderItem {
  id?: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string; // Ex: FX-2026-0842
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  city: string;
  district: string; // Quartier (ex: Haie Vive, Agla, Fidjrossè, Cadjehoun, etc.)
  address: string;
  deliveryInstructions?: string;
  deliveryZoneId: string;
  deliveryZoneName: string;
  deliveryFee: number;
  subtotal: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "CASH_ON_DELIVERY" | "MOMO" | "MOOV";
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  items: OrderItem[];
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  quantityChange: number; // +10 ou -2
  type: "IN_RESTOCK" | "OUT_SALE" | "OUT_LOSS" | "CORRECTION";
  reason: string;
  userEmail?: string;
  createdAt: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "ADMIN" | "CUSTOMER";
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  announcementText: string;
  isAnnouncementActive: boolean;
}
