"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { createHash } from "node:crypto";

/**
 * GLS (MyGLS) shipping integration.
 *
 * Creates a real GLS parcel + printable PDF label through the MyGLS REST API
 * (https://api.mygls.si/ParcelService.svc/json) and stores the tracking data
 * on the order.
 *
 * Required environment variables (set them in Convex deployment settings):
 *   GLS_CLIENT_NUMBER  – MyGLS client number (e.g. 100123456)
 *   GLS_USERNAME       – MyGLS API user
 *   GLS_PASSWORD       – MyGLS API password (sent as SHA-512 byte array)
 *   GLS_TEST           – optional, "true" to hit apitest.mygls.si
 *
 * When credentials are missing the action runs in DEMO mode: it generates a
 * locally derived tracking number so the whole flow still works end-to-end.
 */

const SENDER = {
  name: process.env.GLS_SENDER_NAME || "Powersept d.o.o.",
  street: process.env.GLS_SENDER_STREET || "Cesta na Brdo 1",
  city: process.env.GLS_SENDER_CITY || "Ljubljana",
  postalCode: process.env.GLS_SENDER_POSTAL || "1000",
  country: "SI",
  contactName: process.env.GLS_SENDER_CONTACT || "Powersept",
  contactEmail: process.env.GLS_SENDER_EMAIL || "info@powersept.com",
  contactPhone: process.env.GLS_SENDER_PHONE || "+386 1 000 00 00",
};

function apiRoot(): string {
  const test = process.env.GLS_TEST === "true" ? "test." : "";
  return `https://api${test}mygls.si/ParcelService.svc/json`;
}

function hasCredentials(): boolean {
  return Boolean(
    process.env.GLS_CLIENT_NUMBER &&
      process.env.GLS_USERNAME &&
      process.env.GLS_PASSWORD,
  );
}

/** MyGLS expects the password as SHA-512 digest bytes (0-255 array). */
function hashPassword(plaintext: string): number[] {
  return Array.from(createHash("sha512").update(plaintext, "utf8").digest());
}

function splitHouseNumber(street: string): { street: string; houseNumber: string } {
  const match = street.trim().match(/^(.*?)[\s,]+(\d+[\/a-zA-Z]*)$/);
  if (match) return { street: match[1].trim(), houseNumber: match[2] };
  return { street: street.trim(), houseNumber: "1" };
}

function glsAddress(input: {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}) {
  const { street, houseNumber } = splitHouseNumber(input.street);
  return {
    Name: input.name,
    Street: street,
    HouseNumber: houseNumber,
    HouseNumberInfo: "",
    ZipCode: input.postalCode,
    City: input.city,
    CountryIsoCode: (input.country || "SI").slice(0, 2).toUpperCase(),
    ContactName: input.contactName,
    ContactEmail: input.contactEmail,
    ContactPhone: input.contactPhone,
  };
}

type ShipmentResult = {
  parcelId?: number;
  trackingNumber?: string;
  mode: "live" | "demo";
  labelPdfBase64?: string;
  error?: string;
};

async function postJson(path: string, payload: unknown): Promise<any> {
  const response = await fetch(`${apiRoot()}/${path}`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`GLS ${path} vrnil HTTP ${response.status}.`);
  }
  return await response.json();
}

async function createLiveShipment(args: {
  reference: string;
  content: string;
  delivery: {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  };
  parcelCount: number;
}): Promise<ShipmentResult> {
  const auth = {
    Username: process.env.GLS_USERNAME,
    Password: hashPassword(process.env.GLS_PASSWORD as string),
  };
  const payload = {
    ...auth,
    ParcelList: [
      {
        ClientNumber: Number(process.env.GLS_CLIENT_NUMBER),
        ClientReference: args.reference,
        Content: args.content,
        PickupAddress: glsAddress({ ...SENDER, contactName: SENDER.contactName }),
        DeliveryAddress: glsAddress(args.delivery),
        PickupDate: Date.now(),
        Count: args.parcelCount,
        CODAmount: 0,
        CODReference: "",
        ServiceList: [],
      },
    ],
  };

  const prepared = await postJson("PrepareLabels", payload);
  const info = prepared?.ParcelInfoList?.[0];
  if (!info) {
    throw new Error(
      `GLS ni vrnil podatkov o pošiljki: ${JSON.stringify(prepared).slice(0, 300)}`,
    );
  }

  const parcelId: number | undefined =
    typeof info.ParcelId === "number" ? info.ParcelId : undefined;

  // Fetch the printable label (A4 2x2 sheet) as raw bytes -> base64 PDF.
  let labelPdfBase64: string | undefined;
  try {
    const printed = await postJson("GetPrintedLabels", {
      ...auth,
      ParcelIdList: parcelId !== undefined ? [parcelId] : [],
      PrintPosition: 1,
      ShowPrintDialog: 0,
      TypeOfPrinter: "A4_2x2",
    });
    const labels: number[] | undefined = printed?.Labels;
    if (Array.isArray(labels) && labels.length > 0) {
      labelPdfBase64 = Buffer.from(labels).toString("base64");
    }
  } catch {
    // Label printing is non-fatal: the parcel still exists in GLS.
  }

  const trackingNumber =
    (typeof info.ParcelNumber === "string" && info.ParcelNumber) ||
    (typeof info.TrackId === "string" && info.TrackId) ||
    (parcelId !== undefined ? String(parcelId) : undefined);

  return { parcelId, trackingNumber, mode: "live", labelPdfBase64 };
}

function createDemoShipment(reference: string): ShipmentResult {
  // Deterministic-looking local tracking number (GLS format is ~11 digits).
  const seed = createHash("sha512").update(reference).digest();
  const digits = Array.from(seed.slice(0, 6))
    .map((b) => String(b % 10))
    .join("");
  const parcelId = Number(digits.slice(0, 6));
  return {
    parcelId,
    trackingNumber: `38${digits}`,
    mode: "demo",
  };
}

export const createShipment = action({
  args: {
    orderId: v.id("orders"),
    /** Move the order to "poslano" once the label exists. */
    markShipped: v.optional(v.boolean()),
  },
  handler: async (ctx, { orderId, markShipped }): Promise<ShipmentResult> => {
    // Only shop admins may create shipments.
    await ctx.runQuery(internal.orders.adminGate, {});

    const order = await ctx.runQuery(internal.orders.getOrderInternal, {
      orderId,
    });
    if (order === null) throw new Error("Naročilo ne obstaja.");
    if (order.gls?.trackingNumber && !markShipped) {
      // Idempotency: return existing shipment unless explicitly re-requested.
      return {
        parcelId: order.gls.parcelId,
        trackingNumber: order.gls.trackingNumber,
        mode: (order.gls.mode as "live" | "demo") || "demo",
        labelPdfBase64: order.gls.labelPdfBase64,
      };
    }

    const reference = order.upnReference || `PS-${order._id.slice(-9).toUpperCase()}`;
    const itemCount = order.items.reduce(
      (sum: number, item: { quantity: number }) => sum + item.quantity,
      0,
    );

    let result: ShipmentResult;
    if (hasCredentials()) {
      try {
        result = await createLiveShipment({
          reference,
          content: order.items
            .map((i: { productName: string }) => i.productName)
            .join(", ")
            .slice(0, 60),
          delivery: {
            name: order.contact.company || order.contact.name,
            street: order.shippingAddress.street,
            city: order.shippingAddress.city,
            postalCode: order.shippingAddress.postalCode,
            country: order.shippingAddress.country,
            contactName: order.contact.name,
            contactEmail: order.contact.email,
            contactPhone: order.contact.phone,
          },
          parcelCount: Math.max(1, itemCount),
        });
      } catch (error) {
        result = {
          mode: "live",
          error: error instanceof Error ? error.message : "Neznana napaka GLS.",
        };
      }
    } else {
      result = createDemoShipment(reference);
    }

    await ctx.runMutation(internal.orders.attachGlsShipment, {
      orderId,
      gls: {
        parcelId: result.parcelId,
        trackingNumber: result.trackingNumber,
        mode: result.mode,
        labelPdfBase64: result.labelPdfBase64,
        createdAt: Date.now(),
        error: result.error,
      },
      markShipped: markShipped !== false && result.error === undefined,
    });

    return result;
  },
});
