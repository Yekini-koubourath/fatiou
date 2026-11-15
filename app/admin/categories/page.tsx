"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Plus, X, Camera, UploadCloud } from "lucide-react";
import { CATEGORIES, CategoryInfo } from "@/lib/data";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImage(data.url);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImage(event.target!.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target!.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;
    setSubmitting(true);

    const newCat: CategoryInfo = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: slug as any,
      name,
      slug,
      description,
      image: image || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80",
      productCount: 0,
    };

    setCategories((prev) => [...prev, newCat]);
    setIsModalOpen(false);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Gestion des Catégories de Produits
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organisez vos smartphones, ordinateurs et accessoires avec visuels depuis votre appareil
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#F37021] hover:bg-[#D95D16] text-white font-bold rounded-xl text-xs shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full bg-gray-100">
              <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] font-bold text-[#F37021] uppercase tracking-wider block">
                  Identifiant : {cat.slug}
                </span>
                <h3 className="font-bold text-sm text-white">{cat.name}</h3>
              </div>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-gray-500 leading-relaxed">
                {cat.description}
              </p>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-medium">Modèles liés :</span>
                <span className="font-bold text-[#512264]">{cat.productCount} références</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Ajout Catégorie avec Photo Appareil */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-black text-[#512264]">
                Créer une Nouvelle Catégorie
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nom du rayon</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                  }}
                  placeholder="Ex : Montres Connectées"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Slug URL</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ex : montres-connectees"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-500"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description courte</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description du rayon..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              {/* Choix Photo depuis Téléphone / PC */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Photo d&apos;illustration</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#512264]/30 hover:border-[#F37021] bg-purple-50/50 p-4 rounded-xl text-center cursor-pointer"
                >
                  <Camera className="w-5 h-5 text-[#F37021] mx-auto mb-1" />
                  <span className="font-bold text-xs text-gray-800 block">
                    {uploadingImage ? "Téléversement..." : "Choisir une photo depuis votre appareil"}
                  </span>
                </div>

                {image && (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden mt-2 border border-purple-200">
                    <Image src={image} alt="Aperçu catégorie" fill className="object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="px-5 py-2 bg-[#F37021] text-white font-black rounded-xl hover:bg-[#D95D16] cursor-pointer"
                >
                  Créer le rayon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
