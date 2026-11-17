import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Phone,
  MessageCircle,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

interface ConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderNumber } = await params;
  const order = await db.getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(
    `Bonjour Fxxtyschop, je viens de passer la commande N° ${order.orderNumber} pour un montant de ${formatPrice(order.total)} à livrer à ${order.city} (${order.district}). Merci de me confirmer la prise en charge.`
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        {/* En-tête de confirmation avec bannière dégradée */}
        <div className="bg-gradient-to-r from-[#512264] to-[#6B21A8] text-white p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-4 border border-white/20">
            <CheckCircle2 className="w-12 h-12 text-[#F37021]" />
          </div>

          <span className="text-xs font-bold text-orange-200 uppercase tracking-widest">
            Commande Confirmée avec Succès
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Merci pour votre confiance, {order.customerName} !
          </h1>
          <p className="text-sm text-purple-100 mt-2 max-w-lg mx-auto">
            Votre commande a bien été enregistrée dans notre système. Notre équipe prépare votre matériel.
          </p>

          <div className="mt-6 inline-block bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20">
            <span className="text-xs text-purple-200 font-medium">Numéro de Commande : </span>
            <span className="text-base font-black text-[#F37021] tracking-wider">
              {order.orderNumber}
            </span>
          </div>
        </div>

        {/* Détails et Étapes Suivantes */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Alerte Appel Livreur */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <Clock className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <h4 className="font-bold">Que se passe-t-il maintenant ?</h4>
              <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                Notre service logistique va vous contacter par téléphone ou WhatsApp au{" "}
                <strong>{order.customerPhone}</strong> pour valider l&apos;heure de passage du coursier à{" "}
                <strong>{order.city} ({order.district})</strong>.
              </p>
            </div>
          </div>

          {/* Bouton de confirmation WhatsApp accélérée */}
          <div className="text-center p-6 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-3">
            <h4 className="font-bold text-sm text-emerald-950">
              Besoin d&apos;accélérer la livraison ou de poser une question ?
            </h4>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Cliquez ci-dessous pour ouvrir directement la conversation WhatsApp avec notre équipe :
            </p>
            <a
              href={`https://wa.me/22962336142?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contacter le support WhatsApp</span>
            </a>
          </div>

          {/* Récapitulatif Articles Commandés */}
          <div>
            <h3 className="text-base font-black text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
              Détail des Articles Commandés
            </h3>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{item.productName}</h4>
                      <span className="text-xs text-gray-500">
                        Quantité : {item.quantity} x {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                  <span className="font-black text-[#512264]">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>

            {/* Récap financier */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Sous-total articles :</span>
                <span className="font-bold text-gray-900">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison ({order.deliveryZoneName}) :</span>
                <span className="font-bold text-[#F37021]">{formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 text-sm">
                <span className="font-bold text-gray-900">Total à payer au livreur :</span>
                <span className="text-xl font-black text-[#512264]">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Adresse & Coordonnées de livraison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Lieu de Livraison
              </span>
              <p className="font-bold text-gray-900">{order.city} - {order.district}</p>
              <p className="text-gray-600">{order.address}</p>
              {order.deliveryInstructions && (
                <p className="text-gray-500 italic mt-1">Note : &ldquo;{order.deliveryInstructions}&rdquo;</p>
              )}
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-1">
              <span className="font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Règlement & Garantie
              </span>
              <p className="font-bold text-gray-900">Paiement à la réception</p>
              <p className="text-gray-600">En espèces ou transfert MoMo / Moov</p>
              <p className="text-emerald-700 font-semibold mt-1">Facture & Bon de garantie inclus</p>
            </div>
          </div>

          {/* Actions finales */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <Link
              href="/"
              className="text-xs font-bold text-gray-600 hover:text-[#512264] transition-colors"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#512264] hover:bg-[#6B21A8] text-white text-xs font-bold rounded-xl transition-colors"
            >
              <span>Continuer mes achats</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
