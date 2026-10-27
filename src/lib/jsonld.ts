import type { Article, Author, Category, SiteSettings } from "@/content/types";
import { articleDescription, readingMinutes } from "./content-utils";

export type Crumb = { label: string; to?: string };

export function absolute(site: SiteSettings, path: string): string {
  return site.url.replace(/\/+$/, "") + path;
}

export function websiteJsonLd(site: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: site.tagline,
    url: absolute(site, "/"),
    description: site.description,
    publisher: { "@type": "Organization", name: site.name, url: absolute(site, "/") },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absolute(site, "/search?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(site: SiteSettings, crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      ...(crumb.to ? { item: absolute(site, crumb.to) } : {}),
    })),
  };
}

export function articleJsonLd(
  site: SiteSettings,
  article: Article,
  author: Author | undefined,
  category: Category | undefined,
) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: articleDescription(article),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    articleSection: category?.name,
    keywords: article.tags.join(", "),
    wordCount: article.body.split(/\s+/).length,
    timeRequired: `PT${readingMinutes(article.body)}M`,
    inLanguage: site.locale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absolute(site, `/article/${article.slug}`),
    },
    ...(article.coverImage || article.seo?.image ? { image: [article.seo?.image ?? article.coverImage] } : {}),
    author: author
      ? {
          "@type": "Person",
          name: author.name,
          jobTitle: author.role,
          url: absolute(site, `/author/${author.slug}`),
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: absolute(site, "/"),
    },
  };
}

export function personJsonLd(site: SiteSettings, author: Author) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: absolute(site, `/author/${author.slug}`),
    worksFor: { "@type": "Organization", name: site.name, url: absolute(site, "/") },
    ...(author.location ? { homeLocation: { "@type": "Place", name: author.location } } : {}),
  };
}

export function collectionJsonLd(
  site: SiteSettings,
  name: string,
  description: string,
  path: string,
  articles: Article[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absolute(site, path),
    hasPart: articles.slice(0, 20).map((article) => ({
      "@type": "NewsArticle",
      headline: article.title,
      url: absolute(site, `/article/${article.slug}`),
      datePublished: article.publishedAt,
    })),
  };
}
