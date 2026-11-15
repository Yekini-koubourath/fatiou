"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  ShoppingBag,
  LogOut,
  ShieldCheck,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
  Package,
} from "lucide-react";
import { UserSession, Order } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";

export default function ComptePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger utilisateur & commandes
    Promise.all([
      fetch("/api/auth/me").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/orders").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([userData, ordersData]) => {
        if (!userData?.user) {
          router.push("/connexion");
          return;
        }
        setUser(userData.user);
        if (ordersData?.orders) {
          setOrders(ordersData.orders);
        }
      })
      .catch(() => {
        router.push("/connexion");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
        Chargement de votre espace client...
      </div>
    );
  }

  if (!user) return null;

  const statusLabels: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    PENDING: { label: "En attente", color: "bg-amber-100 text-amber-800", icon: Clock },
    CONFIRMED: { label: "Confirmée", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    PREPARING: { label: "En préparation", color: "bg-purple-100 text-purple-800", icon: Package },
    SHIPPED: { label: "En livraison", color: "bg-orange-100 text-orange-800", icon: Truck },
    DELIVERED: { label: "Livrée & Payée", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
    CANCELLED: { label: "Annulée", color: "bg-red-100 text-red-800", icon: Clock },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* 1. Carte Profil Utilisateur */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#512264] text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-gray-900">{user.name}</h1>
              {user.role === "ADMIN" && (
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#512264] text-xs font-bold">
                  Administrateur
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{user.email}</p>
            {user.phone && (
              <p className="text-xs text-gray-400 mt-0.5">📞 {user.phone}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2.5 bg-[#512264] hover:bg-[#6B21A8] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              Panneau d&apos;Administration
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 hover:text-red-600 hover:bg-red-50 text-xs font-bold rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* 2. Historique des Commandes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-gray-900">
            Mes Commandes Récentes ({orders.length})
          </h2>
          <Link
            href="/boutique"
            className="text-xs font-bold text-[#512264] hover:text-[#F37021] transition-colors inline-flex items-center gap-1"
          >
            <span>Commander un nouveau modèle</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-800">Aucune commande enregistrée</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Vous n&apos;avez pas encore passé de commande avec ce compte.
            </p>
            <Link
              href="/boutique"
              className="inline-block px-6 py-2.5 bg-[#512264] text-white font-bold rounded-xl text-xs hover:bg-[#6B21A8]"
            >
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => {
              const statusInfo = statusLabels[ord.status] || {
                label: ord.status,
                color: "bg-gray-100 text-gray-800",
                icon: Clock,
              };
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={ord.id}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-[#512264]">
                          {ord.orderNumber}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{statusInfo.label}</span>
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 block mt-1">
                        Passée le {formatDate(ord.createdAt)}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-gray-500 block">Total de la commande :</span>
                      <span className="text-lg font-black text-gray-900">
                        {formatPrice(ord.total)}
                      </span>
                    </div>
                  </div>

                  {/* Articles */}
                  <div className="space-y-3">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                            <Image
                              src={item.productImage}
                              alt={item.productName}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900">{item.productName}</span>
                            <span className="text-gray-400 block">
                              Quantité : {item.quantity} x {formatPrice(item.price)}
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-[#512264]">
                          {formatPrice(item.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Adresse de livraison */}
                  <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-gray-50 p-3 rounded-xl">
                    <div>
                      <span className="font-bold text-gray-700">Lieu de livraison : </span>
                      <span>
                        {ord.city} ({ord.district}) • {ord.address}
                      </span>
                    </div>
                    <span className="text-emerald-700 font-bold">
                      Paiement à la livraison ({formatPrice(ord.total)})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
