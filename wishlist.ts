import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

/** Resolve the signed-in (or anonymous) shopper's id. */
async function getShopperId(ctx: QueryCtx | MutationCtx): Promise<string | null> {
  const userId = await getAuthUserId(ctx);
  if (userId !== null) return userId;
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) return null;
  return identity.subject;
}

export const listWishlist = query({
  args: {},
  handler: async (ctx) => {
    const shopperId = await getShopperId(ctx);
    if (shopperId === null) return { productIds: [], products: [] };

    const rows = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user", (q) => q.eq("userId", shopperId))
      .collect();

    const products = [];
    for (const row of rows) {
      const product = await ctx.db.get(row.productId);
      if (product !== null) products.push(product);
    }
    return {
      productIds: rows.map((r) => r.productId),
      products,
    };
  },
});

export const toggleWishlist = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => {
    const shopperId = await getShopperId(ctx);
    if (shopperId === null) {
      throw new Error("Za seznam želja se prijavite.");
    }

    const product = await ctx.db.get(productId);
    if (product === null) throw new Error("Izdelek ne obstaja.");

    const rows = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user", (q) => q.eq("userId", shopperId))
      .collect();
    const existing = rows.find((r) => r.productId === productId);

    if (existing !== undefined) {
      await ctx.db.delete(existing._id);
      return { added: false };
    }
    await ctx.db.insert("wishlistItems", { userId: shopperId, productId });
    return { added: true };
  },
});

/** Remove a single product without toggling (used by the wishlist page). */
export const removeFromWishlist = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, { productId }) => {
    const shopperId = await getShopperId(ctx);
    if (shopperId === null) {
      throw new Error("Za seznam želja se prijavite.");
    }
    const rows = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user", (q) => q.eq("userId", shopperId))
      .collect();
    for (const row of rows) {
      if (row.productId === productId) await ctx.db.delete(row._id);
    }
    return { ok: true };
  },
});

/** Empty the whole wishlist. */
export const clearWishlist = mutation({
  args: {},
  handler: async (ctx) => {
    const shopperId = await getShopperId(ctx);
    if (shopperId === null) return { ok: false };
    const rows = await ctx.db
      .query("wishlistItems")
      .withIndex("by_user", (q) => q.eq("userId", shopperId))
      .collect();
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }
    return { ok: true };
  },
});
