import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Shopper profile (name / phone / company) used to pre-fill checkout and to
 * show on the account page. Separate from users.ts, which is read-only.
 */
export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (user === null) return null;
    return {
      name: user.name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      company: user.company ?? "",
      isAnonymous: user.isAnonymous === true,
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    company: v.optional(v.string()),
  },
  handler: async (ctx, { name, phone, company }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) throw new Error("Niste prijavljeni.");
    const user = await ctx.db.get(userId);
    if (user === null || user.isAnonymous === true) {
      throw new Error("Profil je na voljo samo prijavljenim uporabnikom.");
    }
    const trimmed = name.trim();
    if (trimmed.length < 2) throw new Error("Vnesite ime in priimek.");
    await ctx.db.patch(userId, {
      name: trimmed,
      phone: phone?.trim() || undefined,
      company: company?.trim() || undefined,
    });
    return { ok: true };
  },
});
