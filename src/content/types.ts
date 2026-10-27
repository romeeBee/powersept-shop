export type ArticleStatus = "published" | "draft";

export type Category = {
  slug: string;
  name: string;
  /** One line shown on the topic page header. */
  description: string;
  /** Hue (0-360) used to tint the generated cover art for this topic. */
  hue: number;
};

export type Author = {
  slug: string;
  name: string;
  role: string;
  /** Short bio, 1-2 sentences. */
  bio: string;
  location: string;
  hue: number;
  links?: {
    x?: string;
    github?: string;
    site?: string;
    email?: string;
  };
};

export type Article = {
  slug: string;
  title: string;
  /** The standfirst / deck shown under the headline. */
  standfirst: string;
  category: string;
  author: string;
  /** ISO date, e.g. "2026-09-14". */
  publishedAt: string;
  updatedAt?: string;
  status: ArticleStatus;
  featured?: boolean;
  tags: string[];
  /** Optional cover image URL. When absent the cover is generated from the slug. */
  coverImage?: string;
  seo?: {
    title?: string;
    description?: string;
    image?: string;
  };
  /** Article body in a small Markdown subset. */
  body: string;
};

export type SiteSettings = {
  name: string;
  tagline: string;
  description: string;
  /** Absolute origin used for canonical URLs, sitemap and RSS. No trailing slash. */
  url: string;
  locale: string;
  founded: string;
};

export type ContentBundle = {
  site: SiteSettings;
  categories: Category[];
  authors: Author[];
  articles: Article[];
};
