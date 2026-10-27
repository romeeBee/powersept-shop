import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { TopicLabel } from "@/components/article/ArticleCard";
import { formatDateShort, readingMinutes } from "@/lib/content-utils";
import { breadcrumbJsonLd, collectionJsonLd } from "@/lib/jsonld";
import type { Crumb } from "@/lib/jsonld";
import { cn } from "@/lib/utils";

export default function Archive() {
  const { site, published, categories } = useContent();
  const [topic, setTopic] = useState<string | null>(null);

  const filtered = useMemo(
    () => (topic ? published.filter((article) => article.category === topic) : published),
    [published, topic],
  );

  const years = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const article of filtered) {
      const year = article.publishedAt.slice(0, 4);
      map.set(year, [...(map.get(year) ?? []), article]);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const crumbs: Crumb[] = [{ label: site.name, to: "/" }, { label: "Archive" }];

  return (
    <>
      <Seo
        title="Archive"
        description={`Every story published by ${site.name}.`}
        path="/archive"
        jsonLd={[
          collectionJsonLd(site, "Archive", `Every story published by ${site.name}.`, "/archive", published),
          breadcrumbJsonLd(site, crumbs),
        ]}
      />

      <div className="container-page pt-10">
        <Breadcrumbs items={crumbs} />
      </div>

      <header className="container-page mt-10">
        <h1 className="headline text-[clamp(3rem,8vw,6rem)]">Archive</h1>
      </header>

      <div className="container-page mt-10 border-b border-rule pb-5">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setTopic(null)}
            className={cn(
              "kicker shrink-0 rounded-full border px-4 py-1.5 transition-colors",
              topic === null
                ? "border-signal bg-signal text-primary-foreground"
                : "border-rule text-muted-foreground hover:text-foreground",
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setTopic(category.slug)}
              className={cn(
                "kicker shrink-0 rounded-full border px-4 py-1.5 transition-colors",
                topic === category.slug
                  ? "border-signal bg-signal text-primary-foreground"
                  : "border-rule text-muted-foreground hover:text-foreground",
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <section className="container-page mt-14">
        {years.map(([year, entries]) => (
          <div key={year} className="mb-16 grid gap-6 lg:grid-cols-[8rem_1fr]">
            <h2 className="headline text-4xl text-muted-foreground/50">{year}</h2>
            <ul>
              {entries.map((article) => (
                <li key={article.slug} className="border-t border-rule">
                  <Link
                    to={`/article/${article.slug}`}
                    className="group grid gap-2 py-5 sm:grid-cols-[1fr_9rem_5rem] sm:items-baseline sm:gap-6"
                  >
                    <span>
                      <span className="headline block text-[1.4rem] leading-tight transition-colors group-hover:text-signal">
                        {article.title}
                      </span>
                      <span className="mt-1.5 block text-sm text-muted-foreground">
                        {article.standfirst}
                      </span>
                    </span>
                    <span className="sm:text-right">
                      <TopicLabel slug={article.category} />
                    </span>
                    <span className="text-xs text-muted-foreground sm:text-right">
                      <time dateTime={article.publishedAt} className="block">
                        {formatDateShort(article.publishedAt)}
                      </time>
                      <span className="block">{readingMinutes(article.body)} min</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="font-serif text-lg text-muted-foreground">Nothing here yet.</p>
        )}
      </section>
    </>
  );
}
