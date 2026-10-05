/**
 * Base path the app is served from.
 *
 * - dev preview: "/"  → basename "/"
 * - GitHub Pages: "/powersept-shop/" → basename "/powersept-shop"
 *
 * Lives in its own module because both `main.tsx` (BrowserRouter) and the
 * embedded Sanity Studio (`basePath` must match the real URL) need it, and
 * `main.tsx` cannot be imported from a page without creating a cycle.
 */
export const ROUTER_BASENAME =
  (import.meta.env.BASE_URL || "/").replace(/\/+$/, "") || "/";

/** "/studio" in dev, "/powersept-shop/studio" on GitHub Pages. */
export const STUDIO_BASE_PATH =
  `${ROUTER_BASENAME === "/" ? "" : ROUTER_BASENAME}/studio`;
