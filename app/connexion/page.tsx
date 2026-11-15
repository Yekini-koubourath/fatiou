"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck, User } from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Identifiants invalides");
      }

      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/compte");
      }
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur de connexion";
      setErrorMessage(message);
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail("admin@fxxtyschop.bj");
    setPassword("Admin@2026Fxxty");
  };

  const fillDemoClient = () => {
    setEmail("client@fxxtyschop.bj");
    setPassword("Client@2026");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#512264] text-white flex items-center justify-center mx-auto text-xl font-black shadow-md">
            F
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Connexion à Fxxtyschop
          </h1>
          <p className="text-xs text-gray-500">
            Accédez à votre historique d&apos;achats ou à la gestion du magasin
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Adresse E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#512264] hover:bg-[#6B21A8] text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Connexion en cours...</span>
            ) : (
              <>
                <span>Se connecter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Boutons d'accès rapide Démo */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-center">
            Comptes de Test Pré-configurés
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-[#512264] rounded-lg text-xs font-bold border border-purple-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F37021]" />
              <span>Admin Démo</span>
            </button>
            <button
              type="button"
              onClick={fillDemoClient}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-xs font-bold border border-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-gray-500" />
              <span>Client Démo</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 pt-2">
          Vous n&apos;avez pas encore de compte ?{" "}
          <Link href="/inscription" className="text-[#F37021] font-bold hover:underline">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
