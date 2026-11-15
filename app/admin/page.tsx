"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
  TrendingUp,
} from "lucide-react";
import { Order, Product, OrderStatus } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [ordRes, prodRes] = await Promise.all([
        fetch("/api/orders").then((r) => r.json()),
        fetch("/api/products").then((r) => r.json()),
      ]);
      if (ordRes?.orders) setOrders(ordRes.orders);
      if (prodRes?.products) setProducts(prodRes.products);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch {
      // Ignore
    }
  };

  if (loading) {
    return <div className="text-gray-500 font-medium">Chargement des indicateurs...</div>;
  }

  // Calculs statistiques
  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const lowStockProducts = products.filter((p) => p.stock <= (p.lowStockThreshold || 3));
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Tableau de Bord Commercial Fxxtyschop
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Suivi des ventes, des livraisons et des stocks au Bénin en temps réel.
        </p>
      </div>

      {/* 1. Cartes d'Indicateurs Clés (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Chiffre d'Affaires */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Volume des Ventes
            </span>
            <div className="text-2xl font-black text-[#512264]">{formatPrice(totalRevenue)}</div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Commandes validées
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#512264] flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Commandes Totales */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Commandes Totales
            </span>
            <div className="text-2xl font-black text-gray-900">{orders.length}</div>
            <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" /> {pendingOrders.length} en attente
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F37021] flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Stock Total Unités */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Unités en Magasin
            </span>
            <div className="text-2xl font-black text-gray-900">{totalStockUnits}</div>
            <span className="text-[11px] text-gray-500 font-semibold block mt-1">
              Sur {products.length} références
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Alertes Stock Faible */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Alertes Réappro
            </span>
            <div className="text-2xl font-black text-red-600">{lowStockProducts.length}</div>
            <span className="text-[11px] text-red-500 font-semibold block mt-1">
              Modèles sous le seuil
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Tableau des Commandes Récentes avec changement rapide d'état */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">Dernières Commandes Clients</h2>
            <p className="text-xs text-gray-500">Mise à jour immédiate du statut logistique</p>
          </div>
          <Link
            href="/admin/commandes"
            className="text-xs font-bold text-[#512264] hover:text-[#F37021] inline-flex items-center gap-1"
          >
            <span>Toutes les commandes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/70 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
              <tr>
                <th className="p-4">N° Commande</th>
                <th className="p-4">Client & Contact</th>
                <th className="p-4">Destination Bénin</th>
                <th className="p-4">Montant Total</th>
                <th className="p-4">Statut Actuel</th>
                <th className="p-4">Action Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-4 font-black text-[#512264] whitespace-nowrap">
                    {order.orderNumber}
                    <span className="block text-[10px] text-gray-400 font-normal">
                      {formatDate(order.createdAt)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-gray-900 block">{order.customerName}</span>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="text-[#F37021] hover:underline font-semibold"
                    >
                      {order.customerPhone}
                    </a>
                  </td>
                  <td className="p-4 text-gray-700">
                    <span className="font-bold block">{order.city}</span>
                    <span className="text-[11px] text-gray-500 truncate max-w-xs block">
                      {order.district}
                    </span>
                  </td>
                  <td className="p-4 font-black text-gray-900 whitespace-nowrap">
                    {formatPrice(order.total)}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        order.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : order.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : order.status === "SHIPPED"
                          ? "bg-orange-100 text-orange-800"
                          : order.status === "CONFIRMED"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "PREPARING"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="px-2.5 py-1.5 rounded-lg border border-gray-300 bg-white text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-[#512264]"
                    >
                      <option value="PENDING">En attente</option>
                      <option value="CONFIRMED">Confirmée</option>
                      <option value="PREPARING">En préparation</option>
                      <option value="SHIPPED">Expédiée / En cours</option>
                      <option value="DELIVERED">Livrée & Payée</option>
                      <option value="CANCELLED">Annulée (Remise en stock)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Section Alertes Stock Critique */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50/50 rounded-3xl border border-red-200 p-6 space-y-4">
          <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span>Articles nécessitant un réapprovisionnement urgent ({lowStockProducts.length})</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-2xl border border-red-100 flex items-center justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#512264] uppercase">{p.brand}</span>
                  <h4 className="font-bold text-xs text-gray-900 truncate max-w-[180px]">{p.name}</h4>
                  <span className="text-xs font-black text-red-600 block mt-1">
                    Plus que {p.stock} unité(s)
                  </span>
                </div>
                <Link
                  href="/admin/stocks"
                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 text-[11px] font-bold rounded-lg transition-colors"
                >
                  Ajuster
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
