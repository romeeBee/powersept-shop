import { useParams } from "react-router";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { LeadCard, ListRow } from "@/components/article/ArticleCard";
import NotFound from "./NotFound";
import { breadcrumbJsonLd, collectionJsonLd } from "@/lib/jsonld";
import type { Crumb } from "@/lib/jsonld";

export default function Topic() {
  const { slug = "" } = useParams();
  const { site, getCategory, articlesByCategory } = useContent();
  const category = getCategory(slug);
  if (!category) return <NotFound />;

  const articles = articlesByCategory(category.slug);
  const [lead, ...rest] = articles;
  const path = `/topic/${category.slug}`;
  const crumbs: Crumb[] = [
    { label: site.name, to: "/" },
    { label: "Topics", to: "/archive" },
    { label: category.name },
  ];

  return (
    <>
      <Seo
        title={category.name}
        description={category.description}
        path={path}
        jsonLd={[
          collectionJsonLd(site, category.name, category.description, path, articles),
          breadcrumbJsonLd(site, crumbs),
        ]}
      />

      <div className="container-page pt-10">
        <Breadcrumbs items={crumbs} />
      </div>

      <header className="container-page mt-10 border-b border-rule pb-12">
        <div
          aria-hidden
          className="mb-8 h-1 w-24 rounded-full"
          style={{ background: `hsl(${category.hue} 70% 50%)` }}
        />
        <h1 className="headline text-[clamp(3rem,8vw,6rem)]">{category.name}</h1>
        <p className="mt-5 max-w-2xl font-serif text-lg leading-relaxed text-muted-foreground">
          {category.description}
        </p>
        <p className="kicker mt-8 text-muted-foreground">
          {articles.length} {articles.length === 1 ? "story" : "stories"}
        </p>
      </header>

      {lead && (
        <section className="container-page mt-14">
          <LeadCard article={lead} />
        </section>
      )}

      {rest.length > 0 && (
        <section className="container-page mt-20">
          {rest.map((article) => (
            <ListRow key={article.slug} article={article} />
          ))}
        </section>
      )}

      {articles.length === 0 && (
        <section className="container-page mt-20">
          <p className="font-serif text-lg text-muted-foreground">
            Nothing published under {category.name} yet.
          </p>
        </section>
      )}
    </>
  );
}
