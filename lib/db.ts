import { Product, Order, OrderStatus, StockMovement, StoreSettings } from "./types";
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_STOCK_MOVEMENTS, STORE_SETTINGS, CATEGORIES } from "./data";
import { getPrismaClient } from "./prisma";

// Global store to retain mutations during the Node process lifetime
declare global {
  // eslint-disable-next-line no-var
  var __fxxty_products: Product[] | undefined;
  // eslint-disable-next-line no-var
  var __fxxty_orders: Order[] | undefined;
  // eslint-disable-next-line no-var
  var __fxxty_stock_movements: StockMovement[] | undefined;
  // eslint-disable-next-line no-var
  var __fxxty_settings: StoreSettings | undefined;
}

if (!global.__fxxty_products) {
  global.__fxxty_products = [...INITIAL_PRODUCTS];
}

if (!global.__fxxty_orders) {
  global.__fxxty_orders = [...INITIAL_ORDERS as unknown as Order[]];
}

if (!global.__fxxty_stock_movements) {
  global.__fxxty_stock_movements = [...INITIAL_STOCK_MOVEMENTS];
}

if (!global.__fxxty_settings) {
  global.__fxxty_settings = { ...STORE_SETTINGS };
}

export const db = {
  // --- PRODUITS ---
  async getProducts(filter?: { category?: string; query?: string; brand?: string; inStock?: boolean }): Promise<Product[]> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const where: any = {};
        if (filter?.category && filter.category !== "all") where.category = { slug: filter.category };
        if (filter?.brand && filter.brand !== "all") where.brand = filter.brand;
        if (filter?.inStock) where.stock = { gt: 0 };
        if (filter?.query && filter.query.trim() !== "") {
          where.OR = [
            { name: { contains: filter.query, mode: "insensitive" } },
            { description: { contains: filter.query, mode: "insensitive" } },
          ];
        }
        const dbProducts = await prisma.product.findMany({ where, include: { category: true } });
        if (dbProducts && dbProducts.length > 0) {
          return dbProducts.map((p: any) => ({
            ...p,
            category: p.category?.slug || p.categoryId,
            categoryLabel: p.category?.name,
            createdAt: p.createdAt.toISOString(),
          }));
        }
      } catch (err) {
        console.warn("Prisma query warning, using local data store:", err);
      }
    }

    let list = global.__fxxty_products || [];
    
    if (filter?.category && filter.category !== "all") {
      list = list.filter((p) => p.category.toLowerCase() === filter.category?.toLowerCase());
    }
    
    if (filter?.brand && filter.brand !== "all") {
      list = list.filter((p) => p.brand.toLowerCase() === filter.brand?.toLowerCase());
    }
    
    if (filter?.inStock) {
      list = list.filter((p) => p.stock > 0);
    }
    
    if (filter?.query && filter.query.trim() !== "") {
      const q = filter.query.toLowerCase().trim();
      list = list.filter((p) => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    
    return list;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const list = global.__fxxty_products || [];
    const found = list.find((p) => p.slug === slug);
    return found ? { ...found } : null;
  },

  async getProductById(id: string): Promise<Product | null> {
    const list = global.__fxxty_products || [];
    const found = list.find((p) => p.id === id);
    return found ? { ...found } : null;
  },

  async createProduct(data: Omit<Product, "id" | "createdAt">): Promise<Product> {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    if (!global.__fxxty_products) global.__fxxty_products = [];
    global.__fxxty_products.unshift(newProduct);

    // Enregistrer mouvement initial si stock > 0
    if (newProduct.stock > 0) {
      await db.recordStockMovement({
        productId: newProduct.id,
        productName: newProduct.name,
        quantityChange: newProduct.stock,
        type: "IN_RESTOCK",
        reason: "Création initiale du produit",
        userEmail: "admin@fxxtyschop.bj",
      });
    }

    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const list = global.__fxxty_products || [];
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const current = list[index];
    const oldStock = current.stock;
    const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
    list[index] = updated;

    // Si le stock a été modifié manuellement
    if (updates.stock !== undefined && updates.stock !== oldStock) {
      const diff = updates.stock - oldStock;
      await db.recordStockMovement({
        productId: id,
        productName: updated.name,
        quantityChange: diff,
        type: diff > 0 ? "IN_RESTOCK" : "CORRECTION",
        reason: "Mise à jour manuelle fiche produit",
        userEmail: "admin@fxxtyschop.bj",
      });
    }

    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (!global.__fxxty_products) return false;
    const index = global.__fxxty_products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    global.__fxxty_products.splice(index, 1);
    return true;
  },

  // --- CATÉGORIES ---
  async getCategories() {
    return CATEGORIES;
  },

  // --- COMMANDES ---
  async getOrders(): Promise<Order[]> {
    return (global.__fxxty_orders || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getOrderById(id: string): Promise<Order | null> {
    const list = global.__fxxty_orders || [];
    const found = list.find((o) => o.id === id);
    return found ? { ...found } : null;
  },

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const list = global.__fxxty_orders || [];
    const found = list.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());
    return found ? { ...found } : null;
  },

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    const list = global.__fxxty_orders || [];
    return list.filter((o) => o.userId === userId).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async createOrder(data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    city: string;
    district: string;
    address: string;
    deliveryInstructions?: string;
    deliveryZoneId: string;
    deliveryZoneName: string;
    deliveryFee: number;
    items: {
      productId: string;
      productName: string;
      productImage: string;
      price: number;
      quantity: number;
    }[];
    userId?: string;
  }): Promise<Order> {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `FX-${yearMonth}-${randomSuffix}`;

    const processedItems = data.items.map((item) => ({
      ...item,
      subtotal: item.price * item.quantity,
    }));

    const subtotal = processedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
    const total = subtotal + data.deliveryFee;

    const order: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      city: data.city,
      district: data.district,
      address: data.address,
      deliveryInstructions: data.deliveryInstructions,
      deliveryZoneId: data.deliveryZoneId,
      deliveryZoneName: data.deliveryZoneName,
      deliveryFee: data.deliveryFee,
      subtotal,
      total,
      status: "PENDING",
      paymentMethod: "CASH_ON_DELIVERY",
      paymentStatus: "PENDING",
      items: processedItems,
      userId: data.userId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    if (!global.__fxxty_orders) global.__fxxty_orders = [];
    global.__fxxty_orders.unshift(order);

    // Décrémenter le stock & tracer les mouvements
    for (const item of processedItems) {
      const product = await db.getProductById(item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        await db.updateProduct(item.productId, { stock: newStock });
        await db.recordStockMovement({
          productId: item.productId,
          productName: item.productName,
          quantityChange: -item.quantity,
          type: "OUT_SALE",
          reason: `Commande ${orderNumber}`,
          userEmail: data.customerEmail || "client",
        });
      }
    }

    return order;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const list = global.__fxxty_orders || [];
    const index = list.findIndex((o) => o.id === id);
    if (index === -1) return null;

    const current = list[index];
    const oldStatus = current.status;
    
    // Si annulation d'une commande qui était active, réapprovisionner le stock
    if (status === "CANCELLED" && oldStatus !== "CANCELLED") {
      for (const item of current.items) {
        const product = await db.getProductById(item.productId);
        if (product) {
          const newStock = product.stock + item.quantity;
          await db.updateProduct(item.productId, { stock: newStock });
          await db.recordStockMovement({
            productId: item.productId,
            productName: item.productName,
            quantityChange: item.quantity,
            type: "IN_RESTOCK",
            reason: `Annulation de commande ${current.orderNumber}`,
            userEmail: "admin@fxxtyschop.bj",
          });
        }
      }
    }

    // Si livrée, marquer payé
    const paymentStatus = status === "DELIVERED" ? "PAID" : current.paymentStatus;

    const updated: Order = {
      ...current,
      status,
      paymentStatus,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    return updated;
  },

  // --- MOUVEMENTS DE STOCK ---
  async getStockMovements(): Promise<StockMovement[]> {
    return (global.__fxxty_stock_movements || []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

async adjustStock(data: {
  productId: string;
  quantityChange: number;
  type: "IN_RESTOCK" | "OUT_SALE" | "OUT_LOSS" | "CORRECTION";
  reason: string;
  userEmail?: string;
}): Promise<{ movement: StockMovement; currentStock: number }> {
  const prisma = getPrismaClient();

  if (!prisma) {
    throw new Error("Connexion à Neon indisponible.");
  }

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new Error("Produit introuvable.");
    }

    const newStock = product.stock + data.quantityChange;

    if (newStock < 0) {
      throw new Error("Stock insuffisant pour effectuer cette sortie.");
    }

    await tx.product.update({
      where: { id: product.id },
      data: { stock: newStock },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId: product.id,
        productName: product.name,
        quantityChange: data.quantityChange,
        type: data.type,
        reason: data.reason,
        userEmail: data.userEmail,
      },
    });

    return {
      movement: {
        id: movement.id,
        productId: movement.productId,
        productName: movement.productName,
        quantityChange: movement.quantityChange,
        type: movement.type,
        reason: movement.reason,
        userEmail: movement.userEmail ?? undefined,
        createdAt: movement.createdAt.toISOString(),
      },
      currentStock: newStock,
    };
  });
},

  async recordStockMovement(data: Omit<StockMovement, "id" | "createdAt">): Promise<StockMovement> {
    const movement: StockMovement = {
      ...data,
      id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    if (!global.__fxxty_stock_movements) global.__fxxty_stock_movements = [];
    global.__fxxty_stock_movements.unshift(movement);
    return movement;
  },

  // --- PARAMÈTRES BOUTIQUE ---
  async getSettings(): Promise<StoreSettings> {
    return global.__fxxty_settings || STORE_SETTINGS;
  },

  async updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
    global.__fxxty_settings = {
      ...(global.__fxxty_settings || STORE_SETTINGS),
      ...updates,
    };
    return global.__fxxty_settings;
  },
};
