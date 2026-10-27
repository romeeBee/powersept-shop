import { useEffect } from "react";
import { useContent } from "@/content/store";

type SeoProps = {
  title: string;
  description: string;
  /** Path beginning with "/" — combined with the site URL for the canonical tag. */
  path: string;
  image?: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  /** One or more JSON-LD objects emitted as <script type="application/ld+json">. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const MANAGED = "data-seo-managed";

function setMeta(attr: "name" | "property", key: string, value: string) {
  const el = document.createElement("meta");
  el.setAttribute(attr, key);
  el.setAttribute("content", value);
  el.setAttribute(MANAGED, "");
  document.head.appendChild(el);
}

/**
 * Head management for a client-rendered site: title, description, canonical,
 * Open Graph, Twitter cards and JSON-LD structured data.
 */
export function Seo({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  authorName,
  section,
  tags,
  noindex,
  jsonLd,
}: SeoProps) {
  const { site } = useContent();

  useEffect(() => {
    const base = site.url.replace(/\/+$/, "");
    const url = base + path;
    const fullTitle = title === site.name ? title : `${title} — ${site.name}`;

    document.title = fullTitle;
    document.documentElement.lang = site.locale;

    document.head.querySelectorAll(`[${MANAGED}]`).forEach((el) => el.remove());

    setMeta("name", "description", description);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", type === "profile" ? "profile" : type);
    setMeta("property", "og:url", url);
    setMeta("property", "og:site_name", site.name);
    setMeta("property", "og:locale", site.locale);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    if (image) {
      setMeta("property", "og:image", image);
      setMeta("name", "twitter:image", image);
    }
    if (publishedTime) setMeta("property", "article:published_time", publishedTime);
    if (modifiedTime) setMeta("property", "article:modified_time", modifiedTime);
    if (authorName) setMeta("property", "article:author", authorName);
    if (section) setMeta("property", "article:section", section);
    tags?.forEach((tag) => setMeta("property", "article:tag", tag));
    if (noindex) setMeta("name", "robots", "noindex, nofollow");

    const canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    canonical.setAttribute("href", url);
    canonical.setAttribute(MANAGED, "");
    document.head.appendChild(canonical);

    if (jsonLd) {
      const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      for (const block of blocks) {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute(MANAGED, "");
        script.textContent = JSON.stringify(block);
        document.head.appendChild(script);
      }
    }

    return () => {
      document.head.querySelectorAll(`[${MANAGED}]`).forEach((el) => el.remove());
    };
  }, [
    title,
    description,
    path,
    image,
    type,
    publishedTime,
    modifiedTime,
    authorName,
    section,
    noindex,
    site.url,
    site.name,
    site.locale,
    JSON.stringify(tags),
    JSON.stringify(jsonLd),
  ]);

  return null;
}
