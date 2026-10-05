import protiGlivicam from "@/assets/products/proti-glivicam.jpg";
import dodatnaDoza from "@/assets/products/dodatna-doza.jpg";
import paket from "@/assets/products/paket.jpg";
import home from "@/assets/products/home.jpg";
import povrsine from "@/assets/products/povrsine.jpg";
import smartKids from "@/assets/products/smart-kids.jpg";
import stopPlesen from "@/assets/products/stop-plesen.jpg";
import type { Id } from "@/convex/_generated/dataModel";

export type CategoryDoc = {
  _id: Id<"categories">;
  _creationTime: number;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

export type ProductDoc = {
  _id: Id<"products">;
  _creationTime: number;
  name: string;
  slug: string;
  categoryId: Id<"categories">;
  shortDescription: string;
  description: string;
  benefits: string[];
  usage: string[];
  ingredients: string;
  volumeMl: number;
  price: number;
  isFeatured: boolean;
  inStock: boolean;
  sortOrder: number;
};

export const SHIPPING_STANDARD = 3.5;
export const SHIPPING_FREE_THRESHOLD = 50;

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("sl-SI", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("sl-SI", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
}

export function shippingForSubtotal(subtotal: number): number {
  return subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_STANDARD;
}

/** Slovenian labels for every order status in the lifecycle. */
const ORDER_STATUS_LABELS: Record<string, string> = {
  prejeto: "Prejeto",
  caka_placilo: "Čaka na plačilo",
  placano: "Plačano",
  v_obdelavi: "V obdelavi",
  poslano: "Poslano",
  dostavljeno: "Dostavljeno",
  stornirano: "Stornirano",
  zavraceno: "Vračilo",
};

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

/** Badge classes per status (keeps the brand palette: mint = good, coral = pending). */
export function orderStatusTone(status: string): string {
  switch (status) {
    case "placano":
    case "dostavljeno":
      return "bg-brand-mint text-white";
    case "poslano":
      return "bg-brand-teal text-white";
    case "stornirano":
    case "zavraceno":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-brand-coral-soft text-foreground";
  }
}

/** Public GLS tracking page for a parcel number (Slovenia). */
export function glsTrackingUrl(trackingNumber: string): string {
  return `https://gls-group.com/SI/sl/sledenje-posiljki?parcelNumber=${encodeURIComponent(
    trackingNumber,
  )}`;
}

/** Map of product slug -> imported product photo (from powersept.com). */
export const productImages: Record<string, string> = {
  "powersept-proti-glivicam-200ml": protiGlivicam,
  "powersept-dodatna-doza-200ml": dodatnaDoza,
  "powersept-proti-glivicam-paket": paket,
  "powersept-home-500ml": home,
  "powersept-povrsine-1l": povrsine,
  "powersept-smart-kids-200ml": smartKids,
  "powersept-stop-plesen-750ml": stopPlesen,
};
