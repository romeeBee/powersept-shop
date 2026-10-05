import { v } from "convex/values";
import { query } from "./_generated/server";

export const listCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").withIndex("by_slug").collect();
  },
});

export const listProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getProduct = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});
