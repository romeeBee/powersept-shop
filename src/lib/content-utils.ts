import type { Article, Author, Category } from "@/content/types";

/** Stable 32-bit hash — used to derive deterministic cover art from a slug. */
export function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function wordCount(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function readingMinutes(markdown: string): number {
  return Math.max(1, Math.round(wordCount(markdown) / 220));
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  const date = new Date(iso + (iso.length === 10 ? "T12:00:00Z" : ""));
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
    ...opts,
  }).format(date);
}

export function formatDateShort(iso: string): string {
  return formatDate(iso, { day: "2-digit", month: "short", year: "numeric" });
}

export function relativeDate(iso: string): string {
  const then = new Date(iso + (iso.length === 10 ? "T12:00:00Z" : "")).getTime();
  if (Number.isNaN(then)) return iso;
  const days = Math.round((Date.now() - then) / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.round(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export function byNewest(a: Article, b: Article): number {
  return b.publishedAt.localeCompare(a.publishedAt);
}

export function isPublished(article: Article): boolean {
  return article.status === "published";
}

export function findCategory(categories: Category[], slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function findAuthor(authors: Author[], slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function articleDescription(article: Article): string {
  return article.seo?.description || article.standfirst;
}

export function searchArticles(articles: Article[], query: string): Article[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return articles
    .map((article) => {
      const haystack = [
        article.title,
        article.standfirst,
        article.tags.join(" "),
        article.category,
        article.body.slice(0, 2000),
      ]
        .join(" ")
        .toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (article.title.toLowerCase().includes(term)) score += 6;
        if (article.tags.some((t) => t.includes(term))) score += 3;
        if (haystack.includes(term)) score += 1;
      }
      return { article, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || byNewest(a.article, b.article))
    .map((r) => r.article);
}

/** Plain-text excerpt from a Markdown body. */
export function excerpt(markdown: string, length = 180): string {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^[#>\-\d.]+\s*/gm, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > length ? text.slice(0, length).replace(/\s\S*$/, "") + "…" : text;
}
