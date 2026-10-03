import { v } from "convex/values";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";

/** Resolve the signed-in (or anonymous) shopper's id. */
async function getShopperId(ctx: QueryCtx | MutationCtx): Promise<string | null> {
  const userId = await getAuthUserId(ctx);
  if (userId !== null) return userId;
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) return null;
  return identity.subject;
}

export const SHIPPING_STANDARD = 3.5;
export const SHIPPING_FREE_THRESHOLD = 50;
export const FREE_SHIPPING = 0;

const PAYMENT_METHODS = ["card", "upn"] as const;

/** Full customer-facing order lifecycle. */
export const ORDER_STATUSES = [
  "prejeto",
  "caka_placilo",
  "placano",
  "v_obdelavi",
  "poslano",
  "dostavljeno",
  "stornirano",
  "zavraceno",
] as const;

async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<string> {
  const userId = await getAuthUserId(ctx);
  if (userId === null) throw new Error("Nepooblaščen dostop.");
  const user = await ctx.db.get(userId);
  if (user === null || user.role !== "admin") {
    throw new Error("Ta funkcija je na voljo samo skrbnikom trgovine.");
  }
  return userId;
}

/** Human readable, stable order number (used on invoices / UPN). */
function makeUpnReference(orderId: Id<"orders">): string {
  const tail = orderId.replace(/[^a-zA-Z0-9]/g, "").slice(-9).toUpperCase();
  return `PS-${tail}`;
}

export const placeOrder = mutation({
  args: {
    contact: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      company: v.optional(v.string()),
    }),
    shippingAddress: v.object({
      street: v.string(),
      city: v.string(),
      postalCode: v.string(),
      country: v.string(),
    }),
    paymentMethod: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { contact, shippingAddress, paymentMethod, note }) => {
    const shopperId = await getShopperId(ctx);
    if (shopperId === null) {
      throw new Error("Za zaključek nakupa se prijavite.");
    }
    const isKnownMethod = PAYMENT_METHODS.some((m) => m === paymentMethod);
    if (!isKnownMethod) {
      throw new Error("Neznan način plačila.");
    }

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", shopperId))
      .unique();
    if (cart === null) throw new Error("Vaša košarica je prazna.");

    const rows = await ctx.db
      .query("cartItems")
      .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
      .collect();
    if (rows.length === 0) throw new Error("Vaša košarica je prazna.");

    // Compute totals server-side; never trust client prices
    let subtotal = 0;
    const items: Array<{
      productId: Id<"products">;
      productName: string;
      unitPrice: number;
      quantity: number;
    }> = [];
    for (const row of rows) {
      const product = await ctx.db.get(row.productId);
      if (product === null) continue;
      subtotal += product.price * row.quantity;
      items.push({
        productId: product._id,
        productName: product.name,
        unitPrice: product.price,
        quantity: row.quantity,
      });
    }
    if (items.length === 0) throw new Error("Vaša košarica je prazna.");

    subtotal = Math.round(subtotal * 100) / 100;
    const shipping =
      subtotal >= SHIPPING_FREE_THRESHOLD ? FREE_SHIPPING : SHIPPING_STANDARD;
    const total = Math.round((subtotal + shipping) * 100) / 100;

    const now = Date.now();
    // Card payments are confirmed immediately; UPN waits for the transfer.
    const initialStatus = paymentMethod === "card" ? "placano" : "caka_placilo";

    const orderId = await ctx.db.insert("orders", {
      userId: shopperId,
      status: initialStatus,
      subtotal,
      shipping,
      total,
      contact: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
      },
      shippingAddress,
      paymentMethod,
      shippingMethod: "gls",
      note: note?.trim() ? note.trim() : undefined,
      statusHistory: [
        {
          status: initialStatus,
          at: now,
          note:
            paymentMethod === "card"
              ? "Naročilo sprejeto in plačilo potrjeno."
              : "Naročilo sprejeto — čakamo na plačilo po UPN.",
        },
      ],
    });

    await ctx.db.patch(orderId, { upnReference: makeUpnReference(orderId) });

    for (const item of items) {
      await ctx.db.insert("orderItems", { orderId, ...item });
    }

    // Empty the cart after a successful order
    for (const row of rows) {
      await ctx.db.delete(row._id);
    }

    return { orderId };
  },
});

export const listMyOrders = query({
  args: {},
  handler: async (ctx) => {
    const shopperId = await getShopperId(ctx);
    if (shopperId === null) return [];

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", shopperId))
      .order("desc")
      .collect();

    const withItems = [];
    for (const order of orders) {
      const items = await ctx.db
        .query("orderItems")
        .withIndex("by_order", (q) => q.eq("orderId", order._id))
        .collect();
      withItems.push({ ...order, items });
    }
    return withItems;
  },
});

export const getOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    const shopperId = await getShopperId(ctx);
    if (shopperId === null) return null;

    const order = await ctx.db.get(orderId);
    if (order === null || order.userId !== shopperId) return null;

    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .collect();
    return { ...order, items };
  },
});

/** Internal: full order payload for the GLS label action (no auth on read,
 *  only ever called from server code that already verified the caller). */
export const getOrderInternal = internalQuery({
  args: { orderId: v.id("orders") },
  handler: async (ctx, { orderId }) => {
    const order = await ctx.db.get(orderId);
    if (order === null) return null;
    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .collect();
    return { ...order, items };
  },
});

/** Internal: persist GLS shipment data returned by the label action. */
export const attachGlsShipment = internalMutation({
  args: {
    orderId: v.id("orders"),
    gls: v.object({
      parcelId: v.optional(v.number()),
      trackingNumber: v.optional(v.string()),
      mode: v.optional(v.string()),
      labelPdfBase64: v.optional(v.string()),
      createdAt: v.optional(v.number()),
      error: v.optional(v.string()),
    }),
    /** When true the order moves to "poslano" (shipped). */
    markShipped: v.optional(v.boolean()),
  },
  handler: async (ctx, { orderId, gls, markShipped }) => {
    const order = await ctx.db.get(orderId);
    if (order === null) throw new Error("Naročilo ne obstaja.");

    const patch: Partial<Doc<"orders">> = { gls };
    if (markShipped && order.status !== "dostavljeno") {
      patch.status = "poslano";
      patch.statusHistory = [
        ...(order.statusHistory ?? []),
        {
          status: "poslano",
          at: Date.now(),
          note: gls.trackingNumber
            ? `Poslano prek GLS — št. pošiljke ${gls.trackingNumber}`
            : "Poslano prek GLS.",
        },
      ];
    }
    await ctx.db.patch(orderId, patch);
    return { ok: true };
  },
});

// ---------------------------------------------------------------------------
// Admin (shop backend)
// ---------------------------------------------------------------------------

/** Who am I as a shop admin? Returns null when not signed in / not admin. */
export const adminState = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return { isAdmin: false, hasAdmin: false };
    const user = await ctx.db.get(userId);
    const admins = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .take(1);
    return { isAdmin: user?.role === "admin", hasAdmin: admins.length > 0 };
  },
});

/** One-time bootstrap: lets the first visitor claim the admin role while no
 *  admin exists yet. Once an admin exists this always fails. */
export const claimAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Niste prijavljeni.");
    const user = await ctx.db.get(userId);
    if (user === null || user.email !== "info@smartads.si") {
  throw new Error("Za skrbnika potrebujete pravi e-poštni račun.");
}
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), "admin"))
      .take(1);
    if (existing.length > 0) {
      throw new Error("Skrbnik je že določen. Kontaktirajte obstoječega skrbnika.");
    }
    await ctx.db.patch(userId, { role: "admin" });
    return { ok: true };
  },
});

/** Admin gate reused by the GLS action (throws for non-admins). */
export const adminGate = internalQuery({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return { ok: true };
  },
});

/** Admin: every order (newest first) with its line items. */
export const listAllOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (user === null || user.role !== "admin") return null;

    const orders = await ctx.db.query("orders").order("desc").collect();
    const result = [];
    for (const order of orders) {
      const items = await ctx.db
        .query("orderItems")
        .withIndex("by_order", (q) => q.eq("orderId", order._id))
        .collect();
      result.push({ ...order, items });
    }
    return result;
  },
});

/** Admin: simple dashboard counters. */
export const adminStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (user === null || user.role !== "admin") return null;

    const orders = await ctx.db.query("orders").collect();
    const customers = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("isAnonymous"), true))
      .collect();
    const revenue = orders
      .filter((o) => o.status !== "stornirano" && o.status !== "zavraceno")
      .reduce((sum, o) => sum + o.total, 0);
    const open = orders.filter(
      (o) => o.status !== "dostavljeno" && o.status !== "stornirano" && o.status !== "zavraceno",
    ).length;
    return {
      orderCount: orders.length,
      customerCount: customers.length,
      revenue: Math.round(revenue * 100) / 100,
      openOrders: open,
    };
  },
});

/** Admin: move an order through the lifecycle with an audit entry. */
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, { orderId, status, note }) => {
    await requireAdmin(ctx);
    if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
      throw new Error("Neznan status naročila.");
    }
    const order = await ctx.db.get(orderId);
    if (order === null) throw new Error("Naročilo ne obstaja.");
    await ctx.db.patch(orderId, {
      status,
      statusHistory: [
        ...(order.statusHistory ?? []),
        { status, at: Date.now(), note: note?.trim() || undefined },
      ],
    });
    return { ok: true };
  },
});
