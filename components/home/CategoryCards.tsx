import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/data";

export function CategoryCards() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#F37021] uppercase tracking-wider">
              Explorez nos univers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mt-1">
              Catégories Principales
            </h2>
          </div>
          <Link
            href="/boutique"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#512264] hover:text-[#F37021] transition-colors"
          >
            <span>Voir tout le catalogue</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/boutique?category=${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-4/3 flex flex-col justify-end p-6 border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="relative z-10 text-white">
                <span className="text-[11px] font-bold text-[#F37021] uppercase tracking-wider block mb-1">
                  {cat.productCount} modèles en stock
                </span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors flex items-center justify-between">
                  <span>{cat.name}</span>
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all" />
                </h3>
                <p className="text-xs text-gray-300 line-clamp-1 mt-1 font-normal">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
