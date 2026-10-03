import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

/** Ensures the demo catalog exists exactly once per session. */
export function useCatalogSeed() {
  const ensureSeeded = useMutation(api.init.ensureSeeded);
  const seedOnce = useCallback(() => {
    ensureSeeded({ key: "powersept-catalog-v1" }).catch(() => {
      // Seeding failures are non-fatal; catalog may already exist.
    });
  }, [ensureSeeded]);
  return seedOnce;
}

export function useCategories() {
  const categories = useQuery(api.catalog.listCategories);
  return useMemo(
    () => (categories ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );
}

export function useProducts() {
  const products = useQuery(api.catalog.listProducts);
  return useMemo(
    () => (products ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder),
    [products],
  );
}

export function useProduct(slug: string) {
  const product = useQuery(
    api.catalog.getProduct,
    slug ? { slug } : "skip",
  );
  return product;
}

export function useCart() {
  const cart = useQuery(api.cart.getCart);
  const addToCart = useMutation(api.cart.addToCart);
  const setQuantity = useMutation(api.cart.setQuantity);
  const removeFromCart = useMutation(api.cart.removeFromCart);
  const clearCart = useMutation(api.cart.clearCart);

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const add = useCallback(
    async (productId: Id<"products">, quantity = 1) => {
      try {
        await addToCart({ productId, quantity });
        toast.success("Izdelek je dodan v košarico.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Napaka pri dodajanju.");
      }
    },
    [addToCart],
  );

  const setQty = useCallback(
    async (itemId: Id<"cartItems">, quantity: number) => {
      try {
        await setQuantity({ itemId, quantity });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Napaka pri posodabljanju.");
      }
    },
    [setQuantity],
  );

  const remove = useCallback(
    async (itemId: Id<"cartItems">) => {
      try {
        await removeFromCart({ itemId });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Napaka pri odstranjevanju.");
      }
    },
    [removeFromCart],
  );

  const clear = useCallback(async () => {
    try {
      await clearCart({});
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Napaka pri brisanju.");
    }
  }, [clearCart]);

  return { items, subtotal, itemCount, add, setQty, remove, clear, isLoading: cart === undefined };
}

export function useWishlist() {
  const wishlist = useQuery(api.wishlist.listWishlist);
  const toggleWishlist = useMutation(api.wishlist.toggleWishlist);
  const clearWishlist = useMutation(api.wishlist.clearWishlist);
  const addToCart = useMutation(api.cart.addToCart);

  const productIds = wishlist?.productIds ?? [];
  const products = wishlist?.products ?? [];

  const toggle = useCallback(
    async (productId: Id<"products">) => {
      try {
        const result = await toggleWishlist({ productId });
        toast.success(result.added ? "Dodano na seznam želja." : "Odstranjeno s seznama želja.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Napaka pri seznamu želja.");
      }
    },
    [toggleWishlist],
  );

  const clear = useCallback(async () => {
    try {
      await clearWishlist({});
      toast.success("Seznam želja je izprazen.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Napaka pri čiščenju.");
    }
  }, [clearWishlist]);

  /** Move every wished product into the cart (keeps the wishlist intact). */
  const addAllToCart = useCallback(async () => {
    try {
      for (const product of products) {
        if (product.inStock) await addToCart({ productId: product._id, quantity: 1 });
      }
      toast.success("Izdelki so dodani v košarico.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Napaka pri dodajanju.");
    }
  }, [products, addToCart]);

  return {
    productIds,
    products,
    has: useCallback((productId: Id<"products">) => productIds.includes(productId), [productIds]),
    toggle,
    clear,
    addAllToCart,
    isLoading: wishlist === undefined,
  };
}
