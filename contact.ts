import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/** Contact form submissions (stored so admins can review them). */
export const send = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, { name, email, phone, subject, message }) => {
    if (name.trim().length < 2) throw new Error("Vnesite ime.");
    if (!/.+@.+\..+/.test(email)) throw new Error("Vnesite veljaven e-poštni naslov.");
    if (subject.trim().length < 2) throw new Error("Vnesite zadevo.");
    if (message.trim().length < 10) throw new Error("Sporočilo mora imeti vsaj 10 znakov.");
    await ctx.db.insert("contactMessages", {
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || undefined,
      subject: subject.trim(),
      message: message.trim(),
      handled: false,
    });
    return { ok: true };
  },
});

/** Admin: all contact messages, newest first. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) return null;
    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email ?? ""))
      .unique();
    if (user === null || user.role !== "admin") return null;
    return await ctx.db.query("contactMessages").order("desc").collect();
  },
});
