import fs from "node:fs/promises";
import path from "node:path";
import type { Plugin } from "vite";
import { transformWithEsbuild } from "vite";

type SiteSettings = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  locale: string;
};

type Entry = { slug: string };
type Article = Entry & {
  title: string;
  standfirst: string;
  status: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  seo?: { description?: string };
};

type Content = {
  site: SiteSettings;
  categories: Entry[];
  authors: Entry[];
  articles: Article[];
};

const DATA_FILE = "src/content/data.ts";

/**
 * Loads the seed content module without a build step by transpiling it and
 * importing it as a data URL. The module is pure data, so it has no imports to
 * resolve.
 */
async function loadContent(root: string): Promise<Content | null> {
  try {
    const file = path.join(root, DATA_FILE);
    const source = await fs.readFile(file, "utf8");
    const { code } = await transformWithEsbuild(source, file, { loader: "ts", format: "esm" });
    const url = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
    const mod = (await import(/* @vite-ignore */ url)) as Content;
    return { site: mod.site, categories: mod.categories, authors: mod.authors, articles: mod.articles };
  } catch (error) {
    console.warn(`[seo] could not read ${DATA_FILE}:`, (error as Error).message);
    return null;
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function published(content: Content): Article[] {
  return content.articles
    .filter((article) => article.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function buildSitemap(content: Content): string {
  const base = content.site.url.replace(/\/+$/, "");
  const posts = published(content);
  const latest = posts[0]?.publishedAt ?? new Date().toISOString().slice(0, 10);

  const urls: { loc: string; lastmod: string; changefreq: string; priority: string }[] = [
    { loc: "/", lastmod: latest, changefreq: "daily", priority: "1.0" },
    { loc: "/archive", lastmod: latest, changefreq: "daily", priority: "0.7" },
    { loc: "/writers", lastmod: latest, changefreq: "monthly", priority: "0.5" },
    { loc: "/about", lastmod: latest, changefreq: "yearly", priority: "0.4" },
  ];

  for (const category of content.categories) {
    const newest = posts.find((article) => article.category === category.slug);
    urls.push({
      loc: `/topic/${category.slug}`,
      lastmod: newest?.publishedAt ?? latest,
      changefreq: "weekly",
      priority: "0.7",
    });
  }

  for (const author of content.authors) {
    urls.push({
      loc: `/author/${author.slug}`,
      lastmod: latest,
      changefreq: "monthly",
      priority: "0.5",
    });
  }

  for (const article of posts) {
    urls.push({
      loc: `/article/${article.slug}`,
      lastmod: article.updatedAt ?? article.publishedAt,
      changefreq: "monthly",
      priority: "0.9",
    });
  }

  const body = urls
    .map(
      (url) =>
        `  <url>\n    <loc>${escapeXml(base + url.loc)}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function buildRobots(content: Content): string {
  const base = content.site.url.replace(/\/+$/, "");
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /search",
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ].join("\n");
}

export function buildRss(content: Content): string {
  const base = content.site.url.replace(/\/+$/, "");
  const posts = published(content).slice(0, 20);
  const items = posts
    .map((article) => {
      const link = `${base}/article/${article.slug}`;
      const date = new Date(`${article.publishedAt}T12:00:00Z`).toUTCString();
      return `    <item>\n      <title>${escapeXml(article.title)}</title>\n      <link>${escapeXml(link)}</link>\n      <guid isPermaLink="true">${escapeXml(link)}</guid>\n      <pubDate>${date}</pubDate>\n      <category>${escapeXml(article.category)}</category>\n      <description>${escapeXml(article.seo?.description ?? article.standfirst)}</description>\n    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${escapeXml(content.site.name)}</title>\n    <link>${escapeXml(base)}</link>\n    <description>${escapeXml(content.site.description)}</description>\n    <language>${content.site.locale}</language>\n    <atom:link href="${escapeXml(`${base}/rss.xml`)}" rel="self" type="application/rss+xml" />\n${items}\n  </channel>\n</rss>\n`;
}

/**
 * Generates sitemap.xml, robots.txt and rss.xml from the seed content — served
 * from memory in dev, emitted as files in the production build.
 */
export function seoPlugin(): Plugin {
  let root = process.cwd();

  const files: Record<string, { type: string; build: (content: Content) => string }> = {
    "/sitemap.xml": { type: "application/xml", build: buildSitemap },
    "/robots.txt": { type: "text/plain", build: buildRobots },
    "/rss.xml": { type: "application/rss+xml", build: buildRss },
  };

  return {
    name: "signal-seo",
    configResolved(config) {
      root = config.root;
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url ?? "").split("?")[0];
        const match = files[url];
        if (!match) return next();
        const content = await loadContent(root);
        if (!content) return next();
        res.setHeader("Content-Type", `${match.type}; charset=utf-8`);
        res.end(match.build(content));
      });
    },
    async generateBundle() {
      const content = await loadContent(root);
      if (!content) return;
      for (const [url, match] of Object.entries(files)) {
        this.emitFile({
          type: "asset",
          fileName: url.replace(/^\//, ""),
          source: match.build(content),
        });
      }
    },
  };
}
