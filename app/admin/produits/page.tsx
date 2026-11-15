"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  X,
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Check,
  Star,
  RefreshCw,
} from "lucide-react";
import { Product, ProductCategory } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("Apple");
  const [category, setCategory] = useState<ProductCategory>("smartphones");
  const [price, setPrice] = useState(250000);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState(10);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [description, setDescription] = useState("");
  const [ram, setRam] = useState("");
  const [stockage, setStockage] = useState("");
  const [processeur, setProcesseur] = useState("");
  const [ecran, setEcran] = useState("");
  const [etat, setEtat] = useState("Neuf scellé");

  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick photo changer from the table directly
  const tableFileInputRef = useRef<HTMLInputElement>(null);
  const [quickTargetProductId, setQuickTargetProductId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data?.products) setProducts(data.products);
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openNewProductModal = () => {
    setEditingProduct(null);
    setName("");
    setBrand("Apple");
    setCategory("smartphones");
    setPrice(350000);
    setCompareAtPrice(undefined);
    setStock(10);
    setImages([]);
    setDescription("");
    setRam("8 Go");
    setStockage("256 Go");
    setProcesseur("");
    setEcran("");
    setEtat("Neuf scellé");
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBrand(p.brand);
    setCategory(p.category);
    setPrice(p.price);
    setCompareAtPrice(p.compareAtPrice);
    setStock(p.stock);
    setImages(p.images && p.images.length > 0 ? [...p.images] : []);
    setDescription(p.description);
    setRam(p.specs?.ram || "");
    setStockage(p.specs?.stockage || "");
    setProcesseur(p.specs?.processeur || "");
    setEcran(p.specs?.ecran || "");
    setEtat(p.specs?.etat || "Neuf");
    setIsModalOpen(true);
  };

  // Upload d'image depuis PC ou Smartphone (Remplace ou ajoute à la photo principale)
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, isReplacingMain = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      // 1. Appel API d'upload
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      let finalUrl = "";
      if (res.ok && data.url) {
        finalUrl = data.url;
      } else {
        // Fallback local base64 immédiat
        finalUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      if (finalUrl) {
        if (isReplacingMain || images.length === 0) {
          // Remplace immédiatement la photo principale
          setImages([finalUrl, ...images.slice(1)]);
        } else {
          // Ajoute comme photo additionnelle
          setImages((prev) => [...prev, finalUrl]);
        }
      }
    } catch {
      // Fallback direct base64
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const b64 = event.target!.result as string;
          if (isReplacingMain || images.length === 0) {
            setImages([b64, ...images.slice(1)]);
          } else {
            setImages((prev) => [...prev, b64]);
          }
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Changement rapide de photo directement depuis une ligne du tableau
  const triggerQuickPhotoChange = (productId: string) => {
    setQuickTargetProductId(productId);
    tableFileInputRef.current?.click();
  };

  const handleQuickTableFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !quickTargetProductId) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const newImageUrl = res.ok && data.url ? data.url : await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target?.result as string);
        reader.readAsDataURL(file);
      });

      // Mettre à jour le produit
      await fetch(`/api/products/${quickTargetProductId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: [newImageUrl] }),
      });

      setNotification("Photo du produit mise à jour avec succès !");
      setTimeout(() => setNotification(""), 3000);
      fetchProducts();
    } catch {
      alert("Erreur lors de la mise à jour de la photo");
    } finally {
      if (tableFileInputRef.current) tableFileInputRef.current.value = "";
      setQuickTargetProductId(null);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const setAsMainImage = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, idx) => idx !== index);
      return [selected, ...rest];
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert("Veuillez sélectionner au moins une photo depuis votre appareil (PC ou téléphone).");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name,
        brand,
        category,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        stock: Number(stock),
        images,
        description,
        specs: {
          ram,
          stockage,
          processeur,
          ecran,
          etat,
        },
      };

      if (editingProduct) {
        await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setNotification(editingProduct ? "Produit et photo modifiés avec succès !" : "Nouveau produit ajouté !");
      setTimeout(() => setNotification(""), 3000);

      setIsModalOpen(false);
      fetchProducts();
    } catch {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, prodName: string) => {
    if (!confirm(`Confirmer la suppression définitive de "${prodName}" ?`)) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setNotification(`"${prodName}" supprimé.`);
      setTimeout(() => setNotification(""), 3000);
      fetchProducts();
    } catch {
      // Ignore
    }
  };

  const filtered = products.filter((p) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Input caché pour changement rapide de photo depuis le tableau */}
      <input
        type="file"
        ref={tableFileInputRef}
        accept="image/*"
        onChange={handleQuickTableFileChange}
        className="hidden"
      />

      {notification && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Gestion du Catalogue Produits
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Choisissez les photos directement depuis votre ordinateur ou téléphone, modifiez les prix et stocks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#512264]"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
          </div>

          <button
            onClick={openNewProductModal}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#F37021] hover:bg-[#D95D16] text-white font-extrabold rounded-xl text-xs shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Produit</span>
          </button>
        </div>
      </div>

      {/* Tableau des Produits avec Bouton Changement Photo Direct */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-xs">Chargement du catalogue...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-4">Photo & Nom du Modèle</th>
                  <th className="p-4">Changer Photo</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Prix Vente</th>
                  <th className="p-4">Prix Barré</th>
                  <th className="p-4">Stock Restant</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((prod) => {
                  const isLow = prod.stock <= (prod.lowStockThreshold || 3);
                  return (
                    <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-14 h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                            {prod.images && prod.images[0] ? (
                              <Image
                                src={prod.images[0]}
                                alt={prod.name}
                                fill
                                unoptimized
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-extrabold text-gray-900 block truncate max-w-xs">
                              {prod.name}
                            </span>
                            <span className="text-[10px] text-[#512264] font-bold uppercase">
                              {prod.brand}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Bouton de changement rapide de photo */}
                      <td className="p-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => triggerQuickPhotoChange(prod.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#512264] border border-purple-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                          title="Choisir une photo depuis votre PC ou téléphone"
                        >
                          <Camera className="w-3.5 h-3.5 text-[#F37021]" />
                          <span>Changer photo</span>
                        </button>
                      </td>

                      <td className="p-4 text-gray-600 capitalize">
                        {prod.category}
                      </td>
                      <td className="p-4 font-black text-[#512264] whitespace-nowrap">
                        {formatPrice(prod.price)}
                      </td>
                      <td className="p-4 text-gray-400 whitespace-nowrap">
                        {prod.compareAtPrice ? formatPrice(prod.compareAtPrice) : "-"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            prod.stock === 0
                              ? "bg-red-100 text-red-700"
                              : isLow
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isLow ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                          <span>{prod.stock} en stock</span>
                        </span>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 hover:bg-purple-100 text-[#512264] rounded-lg transition-colors cursor-pointer"
                            title="Modifier fiche complète"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id, prod.name)}
                            className="p-1.5 hover:bg-red-100 text-red-500 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Ajout / Modification Produit avec Sélecteur de Photo Avancé */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-lg font-black text-[#512264]">
                {editingProduct ? "Modifier le Produit" : "Ajouter un Nouvel Arrivage"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* SÉLECTEUR DE PHOTOS CLAIR & INTUITIF */}
              <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-sm text-[#512264]">
                    Photo Principale du Produit <span className="text-red-500">*</span>
                  </label>
                  {uploadingImage && (
                    <span className="text-xs text-[#F37021] font-bold flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Téléversement en cours...
                    </span>
                  )}
                </div>

                {/* Input fichier caché pour la photo principale */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, true)}
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Aperçu de la photo principale active */}
                  <div className="relative w-28 h-28 rounded-2xl overflow-hidden bg-white border-2 border-[#512264] shadow-md shrink-0 flex items-center justify-center">
                    {images[0] ? (
                      <Image
                        src={images[0]}
                        alt="Photo Principale"
                        fill
                        unoptimized
                        className="object-contain p-2"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400 p-2 text-center">
                        <Camera className="w-8 h-8 text-[#512264] mb-1" />
                        <span className="text-[10px] font-bold">Aucune photo</span>
                      </div>
                    )}
                  </div>

                  {/* Boutons de sélection depuis PC ou Téléphone */}
                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#512264] hover:bg-[#6B21A8] text-white font-extrabold rounded-xl shadow-md transition-all text-xs cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-[#F37021]" />
                      <span>
                        {images[0]
                          ? "Changer / Remplacer cette photo (PC ou Téléphone)"
                          : "Choisir une photo depuis votre appareil"}
                      </span>
                    </button>
                    <p className="text-[11px] text-gray-500">
                      Formats supportés : JPG, PNG, WEBP. Cliquez sur le bouton pour ouvrir la galerie de votre téléphone ou parcourir vos fichiers PC.
                    </p>
                  </div>
                </div>

                {/* Galerie de photos secondaires si plusieurs */}
                {images.length > 1 && (
                  <div className="pt-2 border-t border-purple-200">
                    <span className="text-[11px] font-bold text-gray-700 block mb-2">
                      Toutes les photos associées ({images.length}) :
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden bg-white border-2 transition-all ${
                            idx === 0 ? "border-[#512264] ring-2 ring-purple-300" : "border-gray-200"
                          }`}
                        >
                          <Image src={imgUrl} alt={`Photo ${idx + 1}`} fill unoptimized className="object-contain p-1" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5 shadow-xs"
                            title="Supprimer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => setAsMainImage(idx)}
                              className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[8px] font-bold text-center py-0.5 hover:bg-[#512264]"
                              title="Définir comme principale"
                            >
                              ⭐ Choisir
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Nom complet du produit</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Apple iPhone 15 Pro Max (256 Go) - Titane"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#512264]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Marque</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Apple, Samsung, HP..."
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs"
                  >
                    <option value="smartphones">Smartphones</option>
                    <option value="laptops">Ordinateurs Portables</option>
                    <option value="tablets">Tablettes & iPad</option>
                    <option value="accessoires">Accessoires & Audio</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Prix de vente (FCFA)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-black text-[#512264]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Prix barré promo (FCFA)</label>
                  <input
                    type="number"
                    value={compareAtPrice || ""}
                    onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Optionnel"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock initial</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description commerciale</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Points forts de l'appareil..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              {/* Fiche Technique */}
              <div className="pt-2 border-t border-gray-100">
                <span className="font-bold text-gray-600 uppercase tracking-wider block mb-2 text-[11px]">
                  Fiche Technique Rapide
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-gray-600 mb-0.5">Mémoire RAM</label>
                    <input
                      type="text"
                      value={ram}
                      onChange={(e) => setRam(e.target.value)}
                      placeholder="Ex : 8 Go / 16 Go"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-600 mb-0.5">Stockage</label>
                    <input
                      type="text"
                      value={stockage}
                      onChange={(e) => setStockage(e.target.value)}
                      placeholder="Ex : 256 Go SSD"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-600 mb-0.5">Processeur</label>
                    <input
                      type="text"
                      value={processeur}
                      onChange={(e) => setProcesseur(e.target.value)}
                      placeholder="Ex : Core i7 / A17 Pro"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-600 mb-0.5">Écran</label>
                    <input
                      type="text"
                      value={ecran}
                      onChange={(e) => setEcran(e.target.value)}
                      placeholder="Ex : 14 FHD 120Hz"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-gray-600 mb-0.5">État du produit</label>
                    <input
                      type="text"
                      value={etat}
                      onChange={(e) => setEtat(e.target.value)}
                      placeholder="Ex : Neuf scellé / Grade A+"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-6 py-2.5 bg-[#F37021] hover:bg-[#D95D16] text-white font-black rounded-xl transition-colors cursor-pointer shadow-md disabled:opacity-50"
                >
                  {saving ? "Enregistrement..." : "Enregistrer le Produit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
