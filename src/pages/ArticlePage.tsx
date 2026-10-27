import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, ArrowRight, Link2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Markdown, headingId } from "@/components/article/Markdown";
import { ArticleCover } from "@/components/article/CoverArt";
import { FeatureCard, TopicLabel } from "@/components/article/ArticleCard";
import { AuthorAvatar } from "@/components/site/AuthorAvatar";
import { SectionHeading } from "@/components/site/SectionHeading";
import NotFound from "./NotFound";
import { articleDescription, formatDate, readingMinutes } from "@/lib/content-utils";
import { absolute, articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import type { Crumb } from "@/lib/jsonld";

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function onScroll() {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(1, window.scrollY / height) : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return progress;
}

function headingsOf(body: string) {
  return body
    .split("\n")
    .filter((line) => /^##\s+/.test(line))
    .map((line) => {
      const text = line.replace(/^##\s+/, "").trim();
      return { text, id: headingId(text) };
    });
}

export default function ArticlePage() {
  const { slug = "" } = useParams();
  const { site, getArticle, getAuthor, getCategory, published, related } = useContent();
  const progress = useReadingProgress();

  const article = getArticle(slug);
  const headings = useMemo(() => (article ? headingsOf(article.body) : []), [article]);

  if (!article || article.status !== "published") return <NotFound />;

  const author = getAuthor(article.author);
  const category = getCategory(article.category);
  const index = published.findIndex((entry) => entry.slug === article.slug);
  const newer = index > 0 ? published[index - 1] : undefined;
  const older = index >= 0 && index < published.length - 1 ? published[index + 1] : undefined;
  const relatedArticles = related(article, 3);
  const path = `/article/${article.slug}`;
  const url = absolute(site, path);

  const crumbs: Crumb[] = [
    { label: site.name, to: "/" },
    ...(category ? [{ label: category.name, to: `/topic/${category.slug}` }] : []),
    { label: article.title },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  }

  return (
    <>
      <Seo
        title={article.seo?.title ?? article.title}
        description={articleDescription(article)}
        path={path}
        image={article.seo?.image ?? article.coverImage}
        type="article"
        publishedTime={article.publishedAt}
        modifiedTime={article.updatedAt}
        authorName={author?.name}
        section={category?.name}
        tags={article.tags}
        jsonLd={[
          articleJsonLd(site, article, author, category),
          breadcrumbJsonLd(site, crumbs),
        ]}
      />

      <div
        aria-hidden
        className="fixed top-12 left-0 z-50 h-0.5 bg-signal transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />

      <article>
        <header className="container-page pt-10">
          <Breadcrumbs items={crumbs} />

          <div className="mx-auto mt-8 max-w-4xl text-center">
            <TopicLabel slug={article.category} />
            <h1 className="headline mt-4 text-[clamp(2.6rem,6vw,4.75rem)] text-balance">
              {article.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-serif text-xl leading-relaxed text-muted-foreground text-pretty">
              {article.standfirst}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {author && (
                <Link to={`/author/${author.slug}`} className="group flex items-center gap-3">
                  <AuthorAvatar author={author} size={40} />
                  <span className="text-left text-sm leading-tight">
                    <span className="block font-medium transition-colors group-hover:text-signal">
                      {author.name}
                    </span>
                    <span className="block text-muted-foreground">{author.role}</span>
                  </span>
                </Link>
              )}
              <div className="text-left text-sm leading-tight text-muted-foreground">
                <time dateTime={article.publishedAt} className="block">
                  {formatDate(article.publishedAt)}
                </time>
                <span className="block">{readingMinutes(article.body)} min read</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container-page mt-12">
          <div className="relative mx-auto aspect-[21/9] max-w-6xl overflow-hidden rounded-lg bg-muted">
            <ArticleCover
              slug={article.slug}
              hue={category?.hue ?? 22}
              image={article.coverImage}
              title={article.title}
            />
          </div>
        </div>

        <div className="container-page mt-16">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[13rem_minmax(0,42rem)_13rem]">
            {/* Contents */}
            <nav aria-label="On this page" className="hidden lg:block">
              <div className="sticky top-24">
                <h2 className="kicker text-muted-foreground">Contents</h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className="block leading-snug text-muted-foreground transition-colors hover:text-signal"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="min-w-0">
              <Markdown source={article.body} dropCap />

              {article.tags.length > 0 && (
                <div className="mt-14 flex flex-wrap gap-2 border-t border-rule pt-8">
                  {article.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/search?q=${encodeURIComponent(tag)}`}
                      className="rounded-full border border-rule px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-signal hover:text-signal"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              {author && (
                <div className="mt-12 flex gap-5 rounded-lg border border-rule bg-card p-7">
                  <AuthorAvatar author={author} size={56} />
                  <div>
                    <Link
                      to={`/author/${author.slug}`}
                      className="font-display text-2xl transition-colors hover:text-signal"
                    >
                      {author.name}
                    </Link>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {author.bio}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Share rail */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <h2 className="kicker text-muted-foreground">Share</h2>
                <div className="mt-4 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={copyLink}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-signal"
                  >
                    <Link2 className="size-4" />
                    Copy link
                  </button>
                  <a
                    href={`https://x.com/intent/post?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-signal"
                  >
                    <Share2 className="size-4" />
                    Post on X
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-signal"
                  >
                    <Share2 className="size-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Prev / next */}
      <nav className="container-page mt-24">
        <div className="mx-auto grid max-w-6xl gap-6 border-t border-rule pt-10 sm:grid-cols-2">
          {older ? (
            <Link to={`/article/${older.slug}`} className="group">
              <span className="kicker inline-flex items-center gap-2 text-muted-foreground">
                <ArrowLeft className="size-3.5" />
                Previous
              </span>
              <p className="headline mt-3 text-2xl transition-colors group-hover:text-signal">
                {older.title}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {newer && (
            <Link to={`/article/${newer.slug}`} className="group sm:text-right">
              <span className="kicker inline-flex items-center gap-2 text-muted-foreground">
                Next
                <ArrowRight className="size-3.5" />
              </span>
              <p className="headline mt-3 text-2xl transition-colors group-hover:text-signal">
                {newer.title}
              </p>
            </Link>
          )}
        </div>
      </nav>

      {relatedArticles.length > 0 && (
        <section className="container-page mt-24">
          <SectionHeading title="Related reporting" />
          <div className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((entry) => (
              <FeatureCard key={entry.slug} article={entry} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
