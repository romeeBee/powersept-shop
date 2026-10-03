import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove

      // Shop profile extras (optional — filled in on registration / profile page)
      phone: v.optional(v.string()),
      company: v.optional(v.string()),
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // add other tables here

    categories: defineTable({
      name: v.string(),
      slug: v.string(),
      description: v.string(),
      sortOrder: v.number(),
    }).index("by_slug", ["slug"]),

    products: defineTable({
      name: v.string(),
      slug: v.string(),
      categoryId: v.id("categories"),
      shortDescription: v.string(),
      description: v.string(),
      benefits: v.array(v.string()),
      usage: v.array(v.string()),
      ingredients: v.string(),
      volumeMl: v.number(),
      price: v.number(),
      isFeatured: v.boolean(),
      inStock: v.boolean(),
      sortOrder: v.number(),
    })
      .index("by_slug", ["slug"])
      .index("by_category", ["categoryId"]),

    carts: defineTable({
      userId: v.string(),
    }).index("by_user", ["userId"]),

    cartItems: defineTable({
      cartId: v.id("carts"),
      productId: v.id("products"),
      quantity: v.number(),
    })
      .index("by_cart", ["cartId"])
      .index("by_cart_product", ["cartId", "productId"]),

    wishlistItems: defineTable({
      userId: v.string(),
      productId: v.id("products"),
    }).index("by_user", ["userId"]),

    orders: defineTable({
      userId: v.string(),
      /**
       * Order lifecycle: prejeto -> placano | v_obdelavi -> poslano ->
       * dostavljeno (plus stornirano / zavraceno as terminal states).
       */
      status: v.string(),
      subtotal: v.number(),
      shipping: v.number(),
      total: v.number(),
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
      /** Carrier used for fulfilment (only "gls" for now). */
      shippingMethod: v.optional(v.string()),
      /** Payment reference shown to the customer for UPN transfers. */
      upnReference: v.optional(v.string()),
      /** Optional customer note passed from checkout. */
      note: v.optional(v.string()),
      /** Append-only audit trail of status changes. */
      statusHistory: v.optional(
        v.array(
          v.object({
            status: v.string(),
            at: v.number(),
            note: v.optional(v.string()),
          }),
        ),
      ),
      /** GLS shipment data (filled by the GLS integration). */
      gls: v.optional(
        v.object({
          parcelId: v.optional(v.number()),
          trackingNumber: v.optional(v.string()),
          /** "live" when real MyGLS credentials are configured, else "demo". */
          mode: v.optional(v.string()),
          /** Base64 encoded PDF label, ready for download/print. */
          labelPdfBase64: v.optional(v.string()),
          createdAt: v.optional(v.number()),
          error: v.optional(v.string()),
        }),
      ),
    })
      .index("by_user", ["userId"])
      .index("by_status", ["status"]),

    orderItems: defineTable({
      orderId: v.id("orders"),
      productId: v.id("products"),
      productName: v.string(),
      unitPrice: v.number(),
      quantity: v.number(),
    }).index("by_order", ["orderId"]),

    contactMessages: defineTable({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
      subject: v.string(),
      message: v.string(),
      handled: v.boolean(),
    }).index("by_handled", ["handled"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
