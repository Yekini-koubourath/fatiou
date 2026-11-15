"use client";

import React, { useEffect, useState } from "react";
import {
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  RefreshCw,
  Search,
  Package,
} from "lucide-react";
import { Product, StockMovement } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminStocksPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  // Formulaire d'ajustement
  const [selectedProductId, setSelectedProductId] = useState("");
  const [adjustmentQty, setAdjustmentQty] = useState(5);
  const [adjustmentType, setAdjustmentType] = useState<"IN_RESTOCK" | "OUT_LOSS" | "CORRECTION">("IN_RESTOCK");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = async () => {
    try {
      const [prodRes, movRes] = await Promise.all([
        fetch("/api/products").then((r) => r.json()),
        fetch("/api/stocks").then((r) => r.json()),
      ]);
      if (prodRes?.products) {
        setProducts(prodRes.products);
        if (!selectedProductId && prodRes.products.length > 0) {
          setSelectedProductId(prodRes.products[0].id);
        }
      }
      if (movRes?.movements) setMovements(movRes.movements);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !reason.trim() || adjustmentQty <= 0) return;

    setSubmitting(true);
    setMessage("");

    try {
      const quantityChange = adjustmentType === "IN_RESTOCK" ? adjustmentQty : -adjustmentQty;
      const res = await fetch("/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProductId,
          quantityChange,
          type: adjustmentType,
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`Stock mis à jour avec succès ! Nouveau stock : ${data.currentStock} unités.`);
        setReason("");
        fetchData();
      } else {
        setMessage(data.error || "Erreur lors de la mise à jour");
      }
    } catch {
      setMessage("Erreur lors de la mise à jour");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Traçabilité des Stocks & Mouvements
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Historique inaltérable de tous les arrivages, ventes en ligne, inventaires et corrections
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulaire d'Ajustement Manuel (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-5 sticky top-10">
            <h2 className="text-base font-black text-[#512264] pb-3 border-b border-gray-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#F37021]" />
              <span>Ajustement Manuel de Stock</span>
            </h2>

            {message && (
              <div className="p-3 bg-purple-50 text-[#512264] font-semibold text-xs rounded-xl border border-purple-200">
                {message}
              </div>
            )}

            <form onSubmit={handleAdjustStock} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Produit à ajuster</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#512264]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Actuel: {p.stock} unités)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Type d&apos;opération</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType("IN_RESTOCK")}
                    className={`py-2 px-1 text-center rounded-xl font-bold border transition-colors ${
                      adjustmentType === "IN_RESTOCK"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-700 border-gray-200"
                    }`}
                  >
                    + Entrée Arrivage
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType("OUT_LOSS")}
                    className={`py-2 px-1 text-center rounded-xl font-bold border transition-colors ${
                      adjustmentType === "OUT_LOSS"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-200"
                    }`}
                  >
                    - Sortie / Perte
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentType("CORRECTION")}
                    className={`py-2 px-1 text-center rounded-xl font-bold border transition-colors ${
                      adjustmentType === "CORRECTION"
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 border-gray-200"
                    }`}
                  >
                    Inventaire
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre d&apos;unités</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={adjustmentQty}
                  onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Motif obligatoire (Audit)
                </label>
                <textarea
                  rows={2}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Ex : Réception conteneur Dubaï, Vente magasin physique..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-[#512264] hover:bg-[#6B21A8] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                {submitting ? "Traitement..." : "Valider l'ajustement"}
              </button>
            </form>
          </div>
        </div>

        {/* Historique Chronologique des Mouvements (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-gray-900">Journal des Mouvements</h3>
                <span className="text-xs text-gray-400">
                  {movements.length} opérations enregistrées
                </span>
              </div>
              <button
                onClick={fetchData}
                className="p-2 text-gray-400 hover:text-[#512264] transition-colors rounded-lg"
                title="Rafraîchir"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {movements.map((mov) => {
                const isPositive = mov.quantityChange > 0;
                return (
                  <div key={mov.id} className="p-4 flex items-start justify-between gap-4 text-xs">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {isPositive ? (
                          <ArrowUpRight className="w-4 h-4 font-bold" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 font-bold" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{mov.productName}</h4>
                        <p className="text-gray-500 mt-0.5">&ldquo;{mov.reason}&rdquo;</p>
                        <span className="text-[10px] text-gray-400 block mt-1">
                          {formatDate(mov.createdAt)} • Auteur : {mov.userEmail || "Système"}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`text-sm font-black ${
                          isPositive ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? `+${mov.quantityChange}` : mov.quantityChange}
                      </span>
                      <span className="block text-[10px] text-gray-400 uppercase font-semibold">
                        {mov.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
