"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  MessageCircle,
  Eye,
  X,
} from "lucide-react";
import { Order, OrderStatus } from "@/lib/types";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data?.orders) setOrders(data.orders);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch {
      // Ignore
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.city.toLowerCase().includes(q) ||
      o.district.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Gestion des Commandes & Livraisons
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Traitez les commandes béninoises, expédiez avec vos coursiers et encaissez les fonds
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-sm w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher nom, téléphone, N°..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Onglets Filtres par Statut */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs font-semibold">
        {[
          { id: "ALL", label: `Toutes (${orders.length})` },
          { id: "PENDING", label: `En attente (${orders.filter((o) => o.status === "PENDING").length})` },
          { id: "CONFIRMED", label: `Confirmées (${orders.filter((o) => o.status === "CONFIRMED").length})` },
          { id: "PREPARING", label: `En préparation (${orders.filter((o) => o.status === "PREPARING").length})` },
          { id: "SHIPPED", label: `Expédiées (${orders.filter((o) => o.status === "SHIPPED").length})` },
          { id: "DELIVERED", label: `Livrées (${orders.filter((o) => o.status === "DELIVERED").length})` },
          { id: "CANCELLED", label: `Annulées (${orders.filter((o) => o.status === "CANCELLED").length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-colors ${
              statusFilter === tab.id
                ? "bg-[#512264] text-white font-bold shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tableau des Commandes */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Chargement des commandes...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            Aucune commande ne correspond aux filtres sélectionnés.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-4">N° Commande</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Lieu de Livraison</th>
                  <th className="p-4">Montant Net</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Changer Statut</th>
                  <th className="p-4 text-right">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-black text-[#512264] whitespace-nowrap">
                      {ord.orderNumber}
                    </td>
                    <td className="p-4 text-gray-500 whitespace-nowrap">
                      {formatDate(ord.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{ord.customerName}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={`tel:${ord.customerPhone}`}
                          className="text-[#F37021] font-semibold flex items-center gap-1 hover:underline text-[11px]"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{ord.customerPhone}</span>
                        </a>
                      </div>
                    </td>
                    <td className="p-4 text-gray-700">
                      <span className="font-bold block">{ord.city}</span>
                      <span className="text-[11px] text-gray-400 block truncate max-w-[150px]">
                        {ord.district}
                      </span>
                    </td>
                    <td className="p-4 font-black text-gray-900 whitespace-nowrap">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          ord.status === "DELIVERED"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.status === "PENDING"
                            ? "bg-amber-100 text-amber-800"
                            : ord.status === "SHIPPED"
                            ? "bg-orange-100 text-orange-800"
                            : ord.status === "CONFIRMED"
                            ? "bg-blue-100 text-blue-800"
                            : ord.status === "PREPARING"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className="px-2 py-1 rounded-lg border border-gray-300 bg-white text-xs font-semibold focus:outline-hidden"
                      >
                        <option value="PENDING">En attente</option>
                        <option value="CONFIRMED">Confirmée</option>
                        <option value="PREPARING">En préparation</option>
                        <option value="SHIPPED">Expédiée (Coursier)</option>
                        <option value="DELIVERED">Livrée & Réglée</option>
                        <option value="CANCELLED">Annulée (Remise en stock)</option>
                      </select>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 hover:bg-purple-100 text-[#512264] rounded-lg transition-colors"
                        title="Voir la commande complète"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Détails Commande */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-[#512264]">
                  Commande {selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-gray-500">
                  Enregistrée le {formatDate(selectedOrder.createdAt)}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Infos Client & Contact Rapide WhatsApp */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 text-sm">
                  {selectedOrder.customerName}
                </span>
                <a
                  href={`https://wa.me/${selectedOrder.customerPhone.replace(/[\s\+]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors text-[11px]"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
              <p className="text-gray-700">📞 Téléphone : {selectedOrder.customerPhone}</p>
              {selectedOrder.customerEmail && (
                <p className="text-gray-600">✉️ Email : {selectedOrder.customerEmail}</p>
              )}
              <p className="text-gray-800">
                📍 <strong>Lieu de livraison :</strong> {selectedOrder.city} ({selectedOrder.district}) - {selectedOrder.address}
              </p>
              {selectedOrder.deliveryInstructions && (
                <p className="text-amber-800 bg-amber-50 p-2 rounded-lg italic">
                  Note client : &ldquo;{selectedOrder.deliveryInstructions}&rdquo;
                </p>
              )}
            </div>

            {/* Articles */}
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Articles Commandés
              </h4>
              <div className="space-y-2">
                {selectedOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs"
                  >
                    <div>
                      <span className="font-bold text-gray-900 block">{it.productName}</span>
                      <span className="text-gray-500">
                        {it.quantity} x {formatPrice(it.price)}
                      </span>
                    </div>
                    <span className="font-black text-[#512264]">{formatPrice(it.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-gray-100 pt-3 space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Sous-total :</span>
                <span className="font-bold">{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison ({selectedOrder.deliveryZoneName}) :</span>
                <span className="font-bold text-[#F37021]">
                  {formatPrice(selectedOrder.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#512264] pt-2 border-t border-gray-200">
                <span>Total à encaisser :</span>
                <span className="text-lg">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
