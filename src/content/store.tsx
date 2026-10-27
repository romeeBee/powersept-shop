import { articles as seedArticles, authors as seedAuthors, categories as seedCategories, site as seedSite } from "./data";
import type { Article, Author, Category, ContentBundle, SiteSettings } from "./types";
import { byNewest } from "@/lib/content-utils";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "signal.content.v1";

function seedBundle(): ContentBundle {
  return structuredClone({
    site: seedSite,
    categories: seedCategories,
    authors: seedAuthors,
    articles: seedArticles,
  });
}

function loadBundle(): ContentBundle {
  if (typeof window === "undefined") return seedBundle();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedBundle();
    const parsed = JSON.parse(raw) as Partial<ContentBundle>;
    if (!parsed || !Array.isArray(parsed.articles)) return seedBundle();
    const base = seedBundle();
    return {
      site: { ...base.site, ...parsed.site },
      categories: parsed.categories?.length ? parsed.categories : base.categories,
      authors: parsed.authors?.length ? parsed.authors : base.authors,
      articles: parsed.articles,
    };
  } catch {
    return seedBundle();
  }
}

type ContentValue = ContentBundle & {
  /** Published articles, newest first. */
  published: Article[];
  getArticle: (slug: string) => Article | undefined;
  getCategory: (slug: string) => Category | undefined;
  getAuthor: (slug: string) => Author | undefined;
  articlesByCategory: (slug: string) => Article[];
  articlesByAuthor: (slug: string) => Article[];
  related: (article: Article, limit?: number) => Article[];
  saveArticle: (article: Article, originalSlug?: string) => void;
  deleteArticle: (slug: string) => void;
  saveAuthor: (author: Author, originalSlug?: string) => void;
  deleteAuthor: (slug: string) => void;
  saveCategory: (category: Category, originalSlug?: string) => void;
  deleteCategory: (slug: string) => void;
  saveSite: (site: SiteSettings) => void;
  resetContent: () => void;
  isModified: boolean;
};

const ContentContext = createContext<ContentValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [bundle, setBundle] = useState<ContentBundle>(() => loadBundle());
  const [isModified, setIsModified] = useState<boolean>(
    () => typeof window !== "undefined" && !!window.localStorage.getItem(STORAGE_KEY),
  );

  const persist = useCallback((next: ContentBundle) => {
    setBundle(next);
    setIsModified(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage full or unavailable — the in-memory copy still works */
    }
  }, []);

  // Keep other tabs of the admin in sync.
  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_KEY) setBundle(loadBundle());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<ContentValue>(() => {
    const published = bundle.articles.filter((a) => a.status === "published").sort(byNewest);

    const upsert = <T extends { slug: string }>(list: T[], item: T, originalSlug?: string): T[] => {
      const key = originalSlug ?? item.slug;
      const index = list.findIndex((entry) => entry.slug === key);
      if (index === -1) return [item, ...list];
      const next = list.slice();
      next[index] = item;
      return next;
    };

    return {
      ...bundle,
      published,
      isModified,
      getArticle: (slug) => bundle.articles.find((a) => a.slug === slug),
      getCategory: (slug) => bundle.categories.find((c) => c.slug === slug),
      getAuthor: (slug) => bundle.authors.find((a) => a.slug === slug),
      articlesByCategory: (slug) => published.filter((a) => a.category === slug),
      articlesByAuthor: (slug) => published.filter((a) => a.author === slug),
      related: (article, limit = 3) => {
        const scored = published
          .filter((a) => a.slug !== article.slug)
          .map((a) => {
            let score = a.category === article.category ? 3 : 0;
            score += a.tags.filter((t) => article.tags.includes(t)).length * 2;
            if (a.author === article.author) score += 1;
            return { a, score };
          })
          .filter((entry) => entry.score > 0)
          .sort((x, y) => y.score - x.score || byNewest(x.a, y.a));
        const picks = scored.map((entry) => entry.a);
        for (const fallback of published) {
          if (picks.length >= limit) break;
          if (fallback.slug !== article.slug && !picks.includes(fallback)) picks.push(fallback);
        }
        return picks.slice(0, limit);
      },
      saveArticle: (article, originalSlug) =>
        persist({ ...bundle, articles: upsert(bundle.articles, article, originalSlug) }),
      deleteArticle: (slug) =>
        persist({ ...bundle, articles: bundle.articles.filter((a) => a.slug !== slug) }),
      saveAuthor: (author, originalSlug) =>
        persist({ ...bundle, authors: upsert(bundle.authors, author, originalSlug) }),
      deleteAuthor: (slug) =>
        persist({ ...bundle, authors: bundle.authors.filter((a) => a.slug !== slug) }),
      saveCategory: (category, originalSlug) =>
        persist({ ...bundle, categories: upsert(bundle.categories, category, originalSlug) }),
      deleteCategory: (slug) =>
        persist({ ...bundle, categories: bundle.categories.filter((c) => c.slug !== slug) }),
      saveSite: (nextSite) => persist({ ...bundle, site: nextSite }),
      resetContent: () => {
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        setBundle(seedBundle());
        setIsModified(false);
      },
    };
  }, [bundle, isModified, persist]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}
