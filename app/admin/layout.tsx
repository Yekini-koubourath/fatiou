"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Settings,
  Store,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { UserSession } from "@/lib/types";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // État du formulaire de connexion admin intégré
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data?.user && data.user.role === "ADMIN") {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Identifiants d'administration invalides");
      }

      if (data.user?.role !== "ADMIN") {
        throw new Error("Ce compte n'a pas les droits d'administration de la boutique.");
      }

      setUser(data.user);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur d'authentification";
      setLoginError(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setEmail("");
    setPassword("");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1B26] text-purple-200 font-bold text-sm">
        Vérification des accès d&apos;administration Fxxtyschop...
      </div>
    );
  }

  // Si l'administrateur n'est pas encore connecté, afficher le portail d'authentification direct
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#1E1B26] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#512264] to-[#F37021] text-white flex items-center justify-center mx-auto text-2xl font-black shadow-lg">
              F
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Portail Administrateur
            </h1>
            <p className="text-xs text-gray-500">
              Accès réservé à la gestion de Fxxtyschop au Bénin et en Côte d&apos;Ivoire
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-50 text-red-700 rounded-xl text-xs font-semibold flex items-start gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Identifiant E-mail Administrateur
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@fxxtyschop.bj"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#512264]"
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Mot de passe Administrateur
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#512264]"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-[#512264] hover:bg-[#6B21A8] text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <span>Vérification...</span>
              ) : (
                <>
                  <span>Ouvrir le Tableau de Bord</span>
                  <ArrowRight className="w-4 h-4 text-[#F37021]" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navLinks = [
    { href: "/admin", label: "Tableau de Bord", icon: LayoutDashboard },
    { href: "/admin/commandes", label: "Commandes & Livraisons", icon: ShoppingBag },
    { href: "/admin/produits", label: "Gestion Produits", icon: Package },
    { href: "/admin/categories", label: "Rayons & Catégories", icon: Layers },
    { href: "/admin/stocks", label: "Mouvements de Stocks", icon: Layers },
    { href: "/admin/parametres", label: "Paramètres Boutique", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Barre mobile supérieure pour admin */}
      <div className="md:hidden bg-[#512264] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F37021] flex items-center justify-center font-black">
            F
          </div>
          <span className="font-black text-sm">FXXTYSCHOP ADMIN</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white"
          aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          aria-label="Fermer le menu"
        />
      )}

      {/* Sidebar Latérale de l'Admin */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-64 h-screen max-h-screen shrink-0 overflow-y-auto bg-[#1E1B26] text-gray-300 flex flex-col justify-between p-6 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-8">
          {/* Logo & Identité */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#512264] to-[#F37021] flex items-center justify-center text-white font-black text-xl shadow-md">
              F
            </div>
            <div>
              <div className="font-black text-white text-base leading-none">
                FXXTY<span className="text-[#F37021]">SCHOP</span>
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Espace Admin
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1.5 text-xs font-semibold">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-[#512264] text-white font-bold shadow-xs"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#F37021]" : "text-gray-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Pied de sidebar */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <Link
            href="/"
            target="_blank"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-purple-300 hover:bg-white/5 transition-colors"
          >
            <Store className="w-4 h-4 text-[#F37021]" />
            <span>Ouvrir la Boutique (Nouvel onglet)</span>
          </Link>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-white truncate">{user.name}</span>
                <span className="text-[10px] text-gray-400">{user.email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Contenu Principal du Dashboard */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
