import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/** Resolve the signed-in (or anonymous) shopper's id for cart scoping. */
async function getShopperId(ctx: QueryCtx | MutationCtx): Promise<string | null> {
  const userId = await getAuthUserId(ctx);
  if (userId !== null) return userId;
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) return null;
  return identity.subject;
}

async function getOrCreateCart(ctx: MutationCtx, shopperId: string) {
  const existing = await ctx.db
    .query("carts")
    .withIndex("by_user", (q) => q.eq("userId", shopperId))
    .unique();
  if (existing !== null) return existing;
  const cartId = await ctx.db.insert("carts", { userId: shopperId });
  return await ctx.db.get(cartId);
}

export const getCart = query({
  args: {},
  handler: async (ctx) => {
    const shopperId = await getShopperId(ctx);
    if (shopperId === null) return { items: [], subtotal: 0 };

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", shopperId))
      .unique();
    if (cart === null) return { items: [], subtotal: 0 };

    const rows = await ctx.db
      .query("cartItems")
      .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
      .collect();

    const items = [];
    let subtotal = 0;
    for (const row of rows) {
      const product = await ctx.db.get(row.productId);
      if (product === null) continue;
      const lineTotal = Math.round(product.price * row.quantity * 100) / 100;
      subtotal += lineTotal;
      items.push({
        _id: row._id,
        productId: product._id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        volumeMl: product.volumeMl,
        quantity: row.quantity,
        lineTotal,
      });
    }
    return { items, subtotal: Math.round(subtotal * 100) / 100 };
  },
});

export const addToCart = mutation({
  args: { productId: v.id("products"), quantity: v.optional(v.number()) },
  handler: async (ctx, { productId, quantity }) => {
    const shopperId = await getShopperId(ctx);
    if (shopperId === null) {
      throw new Error("Za dodajanje v košarico se prijavite.");
    }
    const qty = Math.max(1, Math.min(99, quantity ?? 1));

    const product = await ctx.db.get(productId);
    if (product === null || !product.inStock) {
      throw new Error("Izdelek ni več na zalogi.");
    }

    const cart = await getOrCreateCart(ctx, shopperId);
    if (cart === null) throw new Error("Košarice ni bilo mogoče ustvariti.");

    const existing = await ctx.db
      .query("cartItems")
      .withIndex("by_cart_product", (q) =>
        q.eq("cartId", cart._id).eq("productId", productId),
      )
      .unique();

    if (existing !== null) {
      await ctx.db.patch(existing._id, {
        quantity: Math.min(99, existing.quantity + qty),
      });
    } else {
      await ctx.db.insert("cartItems", {
        cartId: cart._id,
        productId,
        quantity: qty,
      });
    }
    return { ok: true };
  },
});

export const setQuantity = mutation({
  args: { itemId: v.id("cartItems"), quantity: v.number() },
  handler: async (ctx, { itemId, quantity }) => {
    const shopperId = await getShopperId(ctx);
    if (shopperId === null) throw new Error("Nepooblaščen dostop.");

    const item = await ctx.db.get(itemId);
    if (item === null) return { ok: false };
    const cart = await ctx.db.get(item.cartId);
    if (cart === null || cart.userId !== shopperId) {
      throw new Error("Nepooblaščen dostop.");
    }

    if (quantity <= 0) {
      await ctx.db.delete(itemId);
    } else {
      await ctx.db.patch(itemId, { quantity: Math.min(99, quantity) });
    }
    return { ok: true };
  },
});

export const removeFromCart = mutation({
  args: { itemId: v.id("cartItems") },
  handler: async (ctx, { itemId }) => {
    const shopperId = await getShopperId(ctx);
    if (shopperId === null) throw new Error("Nepooblaščen dostop.");

    const item = await ctx.db.get(itemId);
    if (item === null) return { ok: false };
    const cart = await ctx.db.get(item.cartId);
    if (cart === null || cart.userId !== shopperId) {
      throw new Error("Nepooblaščen dostop.");
    }
    await ctx.db.delete(itemId);
    return { ok: true };
  },
});

export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const shopperId = await getShopperId(ctx);
    if (shopperId === null) return { ok: false };

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", shopperId))
      .unique();
    if (cart === null) return { ok: true };

    const rows = await ctx.db
      .query("cartItems")
      .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
      .collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
    return { ok: true };
  },
});
