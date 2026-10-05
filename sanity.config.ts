/**
 * Sanity konfiguracija (referenčna).
 *
 * Studio je vgrajen v aplikaciji na poti /studio — glej src/pages/Studio.tsx,
 * kjer se konfiguracija sestavi z istimi podatki (projectId, dataset, sheme).
 * Ta datoteka je namenjena zunanji uporabi (npr. Sanity CLI) in je enaka
 * konfiguraciji vgrajenega Studia.
 */
import { SANITY_DATASET, SANITY_PROJECT_ID, SANITY_STUDIO_NAME, SANITY_STUDIO_TITLE } from "./src/sanity/config";
import { schemaTypes } from "./src/sanity/schema";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

export default defineConfig({
  name: SANITY_STUDIO_NAME,
  title: SANITY_STUDIO_TITLE,
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  basePath: "/powersept-shop/studio",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
