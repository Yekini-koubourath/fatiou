"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/lib/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "fxxtyschop_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Charger le panier depuis localStorage côté client
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignore storage read error
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sauvegarder dans localStorage dès modification
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage write error
    }
  }, [items, isHydrated]);

  const addToCart = (product: Product, quantity = 1): boolean => {
    if (product.stock <= 0) return false;

    let success = true;
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.productId === product.id);

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = currentQty + quantity;

        if (newQty > product.stock) {
          success = false;
          return prevItems; // Stock insuffisant
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        if (quantity > product.stock) {
          success = false;
          return prevItems;
        }

        const newItem: CartItem = {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          image: product.images[0] || "",
          quantity,
          stock: product.stock,
          brand: product.brand,
        };
        return [...prevItems, newItem];
      }
    });

    if (success) {
      setIsCartOpen(true);
    }
    return success;
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          // Bloquer au stock disponible maximum
          const finalQty = Math.min(quantity, item.stock);
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
