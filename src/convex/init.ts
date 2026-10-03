import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/** Runs once from the app on first load; idempotent via seedCatalog guard. */
export const ensureSeeded = mutation({
  args: { key: v.string() },
  handler: async (ctx, { key }): Promise<{ seeded: boolean; reason?: string }> => {
    void key;
    const result = await ctx.runMutation(internal.seed.seedCatalog, {});
    return result as { seeded: boolean; reason?: string };
  },
});
