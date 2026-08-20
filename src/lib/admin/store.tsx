"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  AdminCategory,
  AdminOrder,
  AdminProduct,
  OrderStatus,
} from "@/lib/admin/types";

type AdminStoreValue = {
  products: AdminProduct[];
  productsLoading: boolean;
  productsError: string | null;
  categories: AdminCategory[];
  orders: AdminOrder[];
  ordersLoading: boolean;
  ordersError: string | null;
  productCountByCategory: Record<string, number>;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  createProduct: (
    input: Omit<AdminProduct, "id" | "updatedAt">,
  ) => Promise<AdminProduct>;
  updateProduct: (
    id: string,
    patch: Partial<AdminProduct>,
  ) => Promise<AdminProduct | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  createCategory: (input: Omit<AdminCategory, "id">) => Promise<AdminCategory>;
  updateCategory: (id: string, patch: Partial<AdminCategory>) => Promise<AdminCategory>;
  deleteCategory: (id: string) => Promise<boolean>;
  updateOrder: (
    id: string,
    patch: Partial<AdminOrder>,
  ) => Promise<AdminOrder | null>;
  setOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
};

const AdminStoreContext = createContext<AdminStoreValue | null>(null);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const refreshCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const json = (await res.json()) as {
        success?: boolean;
        data?: AdminCategory[];
        error?: string;
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudieron cargar las categorías.");
      }
      setCategories(json.data);
    } catch (error) {
      console.error("refresh categories error", error);
    }
  }, []);

  const refreshProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const res = await fetch("/api/admin/products");
      const json = (await res.json()) as {
        success?: boolean;
        data?: AdminProduct[];
        error?: string;
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudieron cargar los productos.");
      }
      setProducts(json.data);
    } catch (error) {
      setProductsError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los productos.",
      );
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const refreshOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await fetch("/api/admin/orders");
      const json = (await res.json()) as {
        success?: boolean;
        data?: AdminOrder[];
        error?: string;
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudieron cargar los pedidos.");
      }
      setOrders(json.data);
    } catch (error) {
      setOrdersError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los pedidos.",
      );
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCategories();
    void refreshProducts();
    void refreshOrders();
  }, [refreshCategories, refreshProducts, refreshOrders]);

  const productCountByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of categories) map[c.id] = 0;
    for (const p of products) {
      map[p.categoryId] = (map[p.categoryId] ?? 0) + 1;
    }
    return map;
  }, [products, categories]);

  const value: AdminStoreValue = {
    products,
    productsLoading,
    productsError,
    categories,
    orders,
    ordersLoading,
    ordersError,
    productCountByCategory,
    refreshProducts,
    refreshOrders,
    createProduct: async (input) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = (await res.json()) as {
        success?: boolean;
        data?: AdminProduct;
        error?: string;
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudo crear el producto.");
      }
      setProducts((prev) => [json.data!, ...prev]);
      return json.data;
    },
    updateProduct: async (id, patch) => {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = (await res.json()) as {
        success?: boolean;
        data?: AdminProduct;
        error?: string;
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudo actualizar el producto.");
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? json.data! : p)),
      );
      return json.data;
    },
    deleteProduct: async (id) => {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as {
        success?: boolean;
        error?: string;
      };
      if (!res.ok || !json.success) {
        throw new Error(json.error || "No se pudo eliminar el producto.");
      }
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    },
    createCategory: async (input) => {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const json = (await res.json()) as {
        success?: boolean;
        data?: AdminCategory;
        error?: string;
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudo crear la categoría.");
      }
      setCategories((prev) => [...prev, json.data!]);
      return json.data;
    },
    updateCategory: async (id, patch) => {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = (await res.json()) as {
        success?: boolean;
        data?: AdminCategory;
        error?: string;
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudo actualizar la categoría.");
      }
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? json.data! : c)),
      );
      return json.data;
    },
    deleteCategory: async (id) => {
      const linked = products.some((p) => p.categoryId === id);
      if (linked) return false;
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = (await res.json()) as {
        success?: boolean;
        error?: string;
      };
      if (!res.ok || !json.success) {
        throw new Error(json.error || "No se pudo eliminar la categoría.");
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      return true;
    },
    updateOrder: async (id, patch) => {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = (await res.json()) as {
        success?: boolean;
        data?: AdminOrder;
        error?: string;
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudo actualizar el pedido.");
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? json.data! : o)),
      );
      return json.data;
    },
    setOrderStatus: async (id, status) => {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        data?: AdminOrder;
        error?: string;
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "No se pudo actualizar el estado.");
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? json.data! : o)),
      );
    },
  };

  return (
    <AdminStoreContext.Provider value={value}>
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore() {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) {
    throw new Error("useAdminStore must be used within AdminStoreProvider");
  }
  return ctx;
}
