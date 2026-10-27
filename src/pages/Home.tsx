import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  FeatureCard,
  LeadCard,
  RankedRow,
  TopicLabel,
  WideCard,
} from "@/components/article/ArticleCard";
import { ArticleCover } from "@/components/article/CoverArt";
import { AuthorAvatar } from "@/components/site/AuthorAvatar";
import { formatDateShort } from "@/lib/content-utils";
import { websiteJsonLd } from "@/lib/jsonld";

export default function Home() {
  const { site, published, categories, authors, getCategory } = useContent();

  const featured = published.filter((article) => article.featured);
  const lead = featured[0] ?? published[0];
  const secondary = featured.slice(1, 3);
  const rest = published.filter((article) => article !== lead && !secondary.includes(article));

  const latest = rest.slice(0, 4);
  const gridArticles = rest.slice(0, 3);
  const spotlightTopic = categories.find((category) =>
    rest.some((article) => article.category === category.slug),
  );
  const spotlightArticles = rest
    .filter((article) => article.category === spotlightTopic?.slug)
    .slice(0, 2);
  const ranked = published.slice(0, 5);
  const archive = rest.slice(3, 9);

  if (!lead) {
    return (
      <div className="container-page py-32 text-center">
        <h1 className="headline text-4xl">Nothing published yet</h1>
        <Link to="/admin" className="link-underline mt-4 inline-block text-sm">
          Write the first article
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`${site.name} — ${site.tagline}`}
        description={site.description}
        path="/"
        jsonLd={websiteJsonLd(site)}
      />

      {/* Lead */}
      <section className="container-page pt-10 sm:pt-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
          <LeadCard article={lead} />

          <aside className="lg:border-l lg:border-rule lg:pl-10">
            <SectionHeading title="Latest" to="/archive" linkLabel="Archive" />
            <ul className="mt-2">
              {latest.map((article) => (
                <li key={article.slug} className="border-b border-rule last:border-b-0">
                  <article className="group py-5">
                    <TopicLabel slug={article.category} />
                    <h3 className="headline mt-2 text-[1.2rem] leading-tight">
                      <Link
                        to={`/article/${article.slug}`}
                        className="transition-colors group-hover:text-signal"
                      >
                        {article.title}
                      </Link>
                    </h3>
                    <time
                      dateTime={article.publishedAt}
                      className="mt-2 block text-xs text-muted-foreground"
                    >
                      {formatDateShort(article.publishedAt)}
                    </time>
                  </article>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* Secondary features */}
      {secondary.length > 0 && (
        <section className="container-page mt-20">
          <SectionHeading title="Features" />
          <div className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2">
            {secondary.map((article) => (
              <FeatureCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Reported this month */}
      <section className="container-page mt-24">
        <SectionHeading title="Reported this month" to="/archive" linkLabel="Everything" />
        <div className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {gridArticles.map((article) => (
            <FeatureCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      {/* Topic spotlight */}
      {spotlightTopic && spotlightArticles.length > 0 && (
        <section className="mt-24 bg-ink py-20 text-paper dark:bg-card dark:text-foreground">
          <div className="container-page">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/15 pb-5 dark:border-rule">
              <div>
                <span className="kicker text-signal">Topic</span>
                <h2 className="headline mt-3 text-[clamp(2.2rem,4vw,3.2rem)]">
                  {spotlightTopic.name}
                </h2>
              </div>
              <Link
                to={`/topic/${spotlightTopic.slug}`}
                className="group inline-flex items-center gap-1.5 text-sm text-paper/70 transition-colors hover:text-signal dark:text-muted-foreground"
              >
                All {spotlightTopic.name.toLowerCase()} reporting
                <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
              </Link>
            </div>

            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              {spotlightArticles.map((article) => (
                <article key={article.slug} className="group">
                  <Link
                    to={`/article/${article.slug}`}
                    className="relative block aspect-[16/9] overflow-hidden rounded-md"
                  >
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                      <ArticleCover
                        slug={article.slug}
                        hue={getCategory(article.category)?.hue ?? 22}
                        image={article.coverImage}
                        title={article.title}
                      />
                    </div>
                  </Link>
                  <h3 className="headline mt-6 text-[1.8rem]">
                    <Link
                      to={`/article/${article.slug}`}
                      className="transition-colors group-hover:text-signal"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-lg font-serif leading-relaxed text-paper/70 dark:text-muted-foreground">
                    {article.standfirst}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ranked + writers */}
      <section className="container-page mt-24 grid gap-16 lg:grid-cols-[1fr_22rem]">
        <div>
          <SectionHeading title="Most read" />
          <div className="mt-4 divide-y divide-rule">
            {ranked.map((article, index) => (
              <RankedRow key={article.slug} article={article} rank={index + 1} />
            ))}
          </div>
        </div>

        <aside>
          <SectionHeading title="Writers" to="/writers" linkLabel="All writers" />
          <ul className="mt-6 space-y-6">
            {authors.slice(0, 5).map((author) => (
              <li key={author.slug}>
                <Link to={`/author/${author.slug}`} className="group flex items-center gap-4">
                  <AuthorAvatar author={author} size={44} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium transition-colors group-hover:text-signal">
                      {author.name}
                    </span>
                    <span className="block truncate text-sm text-muted-foreground">
                      {author.role}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* Archive strip */}
      {archive.length > 0 && (
        <section className="container-page mt-24">
          <SectionHeading title="More from the archive" to="/archive" linkLabel="Open archive" />
          <div className="mt-10 grid gap-x-12 gap-y-12 lg:grid-cols-2">
            {archive.map((article) => (
              <WideCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Issue footer note */}
      <section className="container-page mt-24">
        <div className="flex flex-col gap-6 rounded-lg border border-rule bg-card p-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="headline text-[2rem]">Write for {site.name}</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Pitches from working engineers, researchers and operators.
            </p>
          </div>
          <Link
            to="/about"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Read the pitch guide
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      <div className="h-8" />
    </>
  );
}
