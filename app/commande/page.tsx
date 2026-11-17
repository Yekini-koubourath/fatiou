"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  ArrowRight,
  AlertCircle,
  Phone,
  MapPin,
  Clock,
  ArrowLeft,
  Check,
} from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import {
  formatPrice,
  BENIN_DELIVERY_ZONES,
  BENIN_CITIES,
  COTE_IVOIRE_DELIVERY_ZONES,
  COTE_IVOIRE_CITIES,
  isValidPhoneForCountry,
  type DeliveryCountry,
} from "@/lib/utils";

export default function CommandePage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryCountry, setDeliveryCountry] = useState<DeliveryCountry>("BJ");
  const [selectedZoneId, setSelectedZoneId] = useState<string>("cotonou");
  const [city, setCity] = useState("Cotonou");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "MOMO">("CASH");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Pré-remplir profil si connecté
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          if (data.user.name) setCustomerName(data.user.name);
          if (data.user.email) setCustomerEmail(data.user.email);
          if (data.user.phone) {
            const country: DeliveryCountry = data.user.phone.startsWith("+225") ? "CI" : "BJ";
            setDeliveryCountry(country);
            setSelectedZoneId(country === "BJ" ? BENIN_DELIVERY_ZONES[0].id : COTE_IVOIRE_DELIVERY_ZONES[0].id);
            setCity(country === "BJ" ? "Cotonou" : "Abidjan");
            setCustomerPhone(data.user.phone.replace(/^\s*\+?(?:229|225)\s*/, ""));
          }
        }
      })
      .catch(() => {});
  }, []);

  const deliveryZones = deliveryCountry === "BJ" ? BENIN_DELIVERY_ZONES : COTE_IVOIRE_DELIVERY_ZONES;
  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];
  const deliveryFee = selectedZone.fee;
  const totalAmount = subtotal + deliveryFee;

  const handleCountryChange = (country: DeliveryCountry) => {
    setDeliveryCountry(country);
    setSelectedZoneId(country === "BJ" ? BENIN_DELIVERY_ZONES[0].id : COTE_IVOIRE_DELIVERY_ZONES[0].id);
    setCity(country === "BJ" ? "Cotonou" : "Abidjan");
    setDistrict("");
    setAddress("");
    setDeliveryInstructions("");
  };

  const handleZoneChange = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    if (deliveryCountry === "BJ") {
      if (zoneId === "cotonou") setCity("Cotonou");
      else if (zoneId === "calavi") setCity("Abomey-Calavi");
      else if (zoneId === "porto-novo") setCity("Porto-Novo");
      else if (zoneId === "ouidah") setCity("Ouidah");
      else if (zoneId === "parakou") setCity("Parakou");
    } else setCity("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (items.length === 0) {
      setErrorMessage("Votre panier est vide. Veuillez ajouter un produit.");
      return;
    }

    if (!customerName.trim()) {
      setErrorMessage("Veuillez renseigner votre nom complet.");
      return;
    }

    const phonePrefix = deliveryCountry === "CI" ? "+225" : "+229";
    const formattedPhone = `${phonePrefix} ${customerPhone.trim()}`;
    if (!isValidPhoneForCountry(formattedPhone, deliveryCountry)) {
      setErrorMessage(
        deliveryCountry === "CI"
          ? "Veuillez renseigner un numéro de téléphone ivoirien valide (+225, 10 chiffres)."
          : "Veuillez renseigner un numéro de téléphone valide au Bénin (+229)."
      );
      return;
    }

    if (!district.trim()) {
      setErrorMessage("Veuillez indiquer votre quartier (ex: Haie Vive, Agla, Fidjrossè, Tankpè...).");
      return;
    }

    if (!address.trim()) {
      setErrorMessage("Veuillez donner des repères ou une adresse précise pour le livreur.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: formattedPhone,
        customerEmail: customerEmail.trim() || undefined,
        city: city.trim(),
        district: district.trim(),
        address: address.trim(),
        deliveryInstructions: deliveryInstructions.trim() || undefined,
        deliveryZoneId: selectedZone.id,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          productImage: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue lors de la validation");
      }

      // Vider le panier client
      clearCart();

      // Rediriger vers la page de confirmation
      router.push(`/commande/confirmation/${data.order.orderNumber}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inattendue";
      setErrorMessage(message);
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Aucun article à commander</h2>
        <p className="text-sm text-gray-500 mb-6">
          Votre panier est vide. Veuillez d&apos;abord sélectionner vos produits.
        </p>
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#512264] text-white font-bold rounded-xl text-sm"
        >
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* En-tête */}
      <div className="mb-8">
        <Link
          href="/panier"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#512264] mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au panier</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          Finaliser ma Commande
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Livraison à domicile ou au bureau au Bénin et en Côte d&apos;Ivoire. Aucun paiement immédiat requis.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="flex-1 font-semibold">{errorMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulaire Client & Adresse (8 colonnes) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Vos Coordonnées */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-black text-gray-900 text-base pb-3 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-[#512264] text-white flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>Vos Coordonnées</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nom & Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex : Koffi Dossou"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Numéro de Téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative flex">
                  <select
                    aria-label="Indicatif téléphonique"
                    value={deliveryCountry}
                    onChange={(e) => {
                      if (e.target.value === "BJ" || e.target.value === "CI") {
                        handleCountryChange(e.target.value);
                      }
                    }}
                    className="w-40 pl-10 pr-2 py-2.5 rounded-l-xl border border-r-0 border-gray-200 bg-white text-xs focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
                  >
                    <option value="BJ">+229 Bénin</option>
                    <option value="CI">+225 Côte d&apos;Ivoire</option>
                  </select>
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={deliveryCountry === "BJ" ? "62 33 61 42" : "01 23 45 67 89"}
                    className="min-w-0 flex-1 px-3 py-2.5 rounded-r-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Le livreur vous appellera sur ce numéro avant son départ.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Adresse E-mail (Optionnel pour reçu)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
              />
            </div>
          </div>

          {/* 2. Zone & Adresse de Livraison */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-black text-gray-900 text-base pb-3 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-[#512264] text-white flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>
                {deliveryCountry === "BJ"
                  ? "Lieu & Zone de Livraison au Bénin"
                  : "Lieu & Zone de Livraison en Côte d'Ivoire"}
              </span>
            </div>

            {/* Sélecteur de zone avec tarif */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {deliveryCountry === "BJ"
                  ? "Sélectionnez votre zone géographique :"
                  : "Sélectionnez la tranche de distance routière depuis Abidjan :"}
              </label>
              {deliveryCountry === "CI" && (
                <p className="text-[11px] text-gray-500 mb-2">
                  Choisissez la tranche correspondant à la distance depuis Abidjan, puis saisissez votre ville et votre quartier. Les tarifs sont estimatifs et révisables selon le prix du carburant.
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {deliveryZones.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => handleZoneChange(zone.id)}
                      className={`text-left p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-[#512264] bg-purple-50/50 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-gray-900 text-sm">{zone.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#512264] shrink-0" />}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-[#F37021] font-black">{formatPrice(zone.fee)}</span>
                        <span className="text-gray-500 text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {zone.delay}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Ville <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  list={deliveryCountry === "BJ" ? "benin-cities" : "cote-ivoire-cities"}
                  placeholder="Choisir ou saisir une ville..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
                />
                <datalist id="benin-cities">
                  {BENIN_CITIES.map((cityOption) => (
                    <option key={cityOption} value={cityOption} />
                  ))}
                </datalist>
                <datalist id="cote-ivoire-cities">
                  {COTE_IVOIRE_CITIES.map((cityOption) => (
                    <option key={cityOption} value={cityOption} />
                  ))}
                </datalist>
                {deliveryCountry === "CI" && (
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    Les autres villes sont acceptées : saisissez simplement leur nom.
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Quartier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder={
                    deliveryCountry === "BJ"
                      ? "Ex : Haie Vive, Agla, Fidjrossè, Tankpè..."
                      : "Ex : Cocody, Yopougon, Treichville..."
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Adresse précise ou Repères notables <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex : Rue 340, Immeuble face à la pharmacie, Portail noir"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Instructions spéciales pour le livreur (Optionnel)
              </label>
              <textarea
                rows={2}
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                placeholder="Ex : Appeler dès que vous êtes au carrefour, sonner au 2e étage..."
                className="w-full px-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
              />
            </div>
          </div>

          {/* 3. Mode de Règlement */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-black text-gray-900 text-base pb-3 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-[#512264] text-white flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>Mode de Règlement à la Réception</span>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "CASH"
                    ? "border-[#512264] bg-purple-50/40"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "CASH"}
                  onChange={() => setPaymentMethod("CASH")}
                  className="mt-1 text-[#512264] focus:ring-[#512264]"
                />
                <div>
                  <div className="font-bold text-sm text-gray-900">
                    Paiement en espèces à la livraison (Recommandé)
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Payez directement en mains propres au livreur après avoir ouvert et inspecté votre colis.
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "MOMO"
                    ? "border-[#512264] bg-purple-50/40"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "MOMO"}
                  onChange={() => setPaymentMethod("MOMO")}
                  className="mt-1 text-[#512264] focus:ring-[#512264]"
                />
                <div>
                  <div className="font-bold text-sm text-gray-900">
                    Mobile Money (MTN MoMo ou Moov Money) à la livraison
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Effectuez le transfert vers le numéro marchand Fxxtyschop en présence du livreur.
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Récapitulatif & Validation (5 colonnes) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-6 sticky top-28">
            <h2 className="text-lg font-black text-gray-900 pb-3 border-b border-gray-100">
              Votre Commande ({items.reduce((s, i) => s + i.quantity, 0)} articles)
            </h2>

            {/* Liste concise des articles */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3 text-xs">
                  <div className="relative w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill unoptimized className="object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                    <span className="text-gray-500">
                      {item.quantity} x {formatPrice(item.price)}
                    </span>
                  </div>
                  <span className="font-black text-[#512264]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Décompte Financier */}
            <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Sous-total articles :</span>
                <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison ({selectedZone.name}) :</span>
                <span className="font-bold text-[#F37021]">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-gray-900 block">Total net à régler :</span>
                  <span className="text-[10px] text-gray-400">À la réception</span>
                </div>
                <span className="text-2xl font-black text-[#512264]">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* Garanties */}
            <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#F37021] shrink-0" />
                <span>Délai estimé : {selectedZone.delay}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Garantie magasin certifiée avec facture fournie</span>
              </div>
            </div>

            {/* Bouton de confirmation */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#F37021] hover:bg-[#D95D16] text-white font-black rounded-xl shadow-lg hover:shadow-orange-500/25 transition-all text-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span>Validation en cours...</span>
              ) : (
                <>
                  <span>Confirmer la commande ({formatPrice(totalAmount)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
