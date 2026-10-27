# SIGNAL

A technology magazine: front page, articles, topic sections, author pages, archive, search,
an editor area, and the SEO plumbing a publication needs.

React 19 + Vite + Tailwind v4 + react-router. No backend.

## Routes

| Route | Page |
| --- | --- |
| `/` | Front page: lead story, features, topic band, most read, archive strip |
| `/article/:slug` | Article with breadcrumbs, contents rail, reading progress, share, related |
| `/topic/:slug` | Topic section |
| `/writers`, `/author/:slug` | Writer index and profile |
| `/archive` | Everything, grouped by year, filterable by topic |
| `/search?q=` | Full-text search (also `⌘K` anywhere) |
| `/about` | Masthead, editorial standards, pitch guide |
| `/admin/*` | Editor: dashboard, articles, writers, topics, settings |

## Content

Articles, writers, topics and site settings live in `src/content/data.ts`. That file is the
source of truth for the build.

The editor at `/admin` (default passphrase `signal`) writes to the browser's local storage, so
changes are immediate but local to that browser. **Export content** in the editor downloads the
whole bundle as JSON; paste it into `src/content/data.ts` to ship it.

The passphrase gate runs in the browser. It keeps the editor out of a reader's way; it is not
authentication.

## SEO

- `sitemap.xml`, `robots.txt` and `rss.xml` are generated from `src/content/data.ts` by
  `plugins/seo.ts` — served from memory by the dev server, emitted as files in the build.
- Per-page title, description, canonical, Open Graph and Twitter tags come from `<Seo>`
  (`src/components/site/Seo.tsx`).
- JSON-LD per page type in `src/lib/jsonld.ts`: `WebSite`, `NewsArticle`, `Person`,
  `CollectionPage` and `BreadcrumbList` on every page that has a trail.
- `/admin` and `/search` are `noindex` and excluded in robots.txt.

Set the canonical origin in the editor under **Settings → Site URL**, or in `site.url` in
`src/content/data.ts`. It drives canonicals, the sitemap and the feed.

## Notes

- Article copy, writers and topics are sample content written for this template.
- Article bodies use a small Markdown subset: `##`/`###` headings, `>` quotes, `-` and `1.`
  lists, fenced code, images, `**bold**`, `*italic*`, `` `code` ``, `[links](url)`.
- Cover images are generated from the article slug, so the site has no external image
  dependency. Set `coverImage` on an article to use a real photo.
- The footer newsletter form validates and confirms, but is not connected to an email provider.

## Commands

```
npm run dev       # dev server on :5173
npm run build     # typecheck + production build into dist/
npm run preview   # serve the build
npm run lint
```
