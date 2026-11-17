"use client";

import React, { useEffect, useState } from "react";
import { Settings, Save, CheckCircle2, Phone, Mail, MapPin, Bell } from "lucide-react";
import { StoreSettings } from "@/lib/types";

export default function AdminParametresPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "Fxxtyschop Bénin & Côte d'Ivoire",
    tagline: "Votre référence high-tech au Bénin et en Côte d'Ivoire",
    phone: "+229 62 33 61 42",
    whatsapp: "+229 62 33 61 42",
    email: "contact@fxxtyschop.bj",
    address: "Boulevard de la Marina, Cotonou, Bénin",
    city: "Cotonou",
    announcementText: "🚚 Livraison au Bénin et dans toutes les villes de Côte d'Ivoire • Paiement à la réception !",
    isAnnouncementActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch {
      // Ignore
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-xs">Chargement des paramètres...</div>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Paramètres Généraux de la Boutique
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Coordonnées publiques, numéro WhatsApp pour les commandes directes et bandeau promotionnel
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Paramètres enregistrés et appliqués en direct sur la boutique !</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Identité Boutique */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-[#512264] pb-2 border-b border-gray-100">
            Identité Commerciale
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Nom de la boutique</label>
              <input
                type="text"
                required
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#512264]"
              />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Slogan</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Contacts de la boutique */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h2 className="text-sm font-black text-[#512264] pb-2 border-b border-gray-100">
            Contacts Téléphoniques & WhatsApp
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Numéro WhatsApp Commandes
              </label>
              <input
                type="text"
                required
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                placeholder="+229 62 33 61 42"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#F37021]"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                Utilisé pour tous les boutons &ldquo;Commander sur WhatsApp&rdquo;.
              </span>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Téléphone Appel Direct
              </label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                placeholder="+229 62 33 61 42"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">E-mail de support</label>
              <input
                type="email"
                required
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Adresse Cotonou</label>
              <input
                type="text"
                required
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Bandeau d'Annonce Supérieur */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <h2 className="text-sm font-black text-[#512264]">
              Barre d&apos;Annonce Supérieure (Bandeau Violet)
            </h2>
            <label className="flex items-center gap-2 cursor-pointer font-bold text-xs">
              <input
                type="checkbox"
                checked={settings.isAnnouncementActive}
                onChange={(e) => setSettings({ ...settings, isAnnouncementActive: e.target.checked })}
                className="rounded text-[#512264] focus:ring-[#512264]"
              />
              <span>Actif sur le site</span>
            </label>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">
              Texte affiché en haut de toutes les pages
            </label>
            <input
              type="text"
              required
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-[#F37021] hover:bg-[#D95D16] text-white font-black rounded-xl text-xs shadow-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Sauvegarde..." : "Enregistrer les modifications"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
