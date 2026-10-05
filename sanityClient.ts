import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SANITY_DATASET, SANITY_PROJECT_ID } from "@/sanity/config";

/**
 * Odjemalec za branje objavljenih vsebin (novice) iz podatkovnega seta.
 * Enaki podatki se uporabljajo tudi vgrajenem Studiu na /studio.
 */
export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

/** Slika iz Sanity (npr. dokument "novica" → polje image). */
type SanityImageSource = Parameters<typeof builder.image>[0];

/** URL slike z zahtevano velikostjo: `urlFor(doc.image).width(640).url()`. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
