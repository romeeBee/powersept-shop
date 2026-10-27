import { useMemo } from "react";
import { useSearchParams } from "react-router";
import { Search as SearchIcon } from "lucide-react";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ListRow } from "@/components/article/ArticleCard";
import { searchArticles } from "@/lib/content-utils";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import type { Crumb } from "@/lib/jsonld";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const { site, published } = useContent();
  const query = params.get("q") ?? "";

  const results = useMemo(() => searchArticles(published, query), [published, query]);
  const crumbs: Crumb[] = [{ label: site.name, to: "/" }, { label: "Search" }];

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = String(new FormData(event.currentTarget).get("q") ?? "").trim();
    setParams(value ? { q: value } : {});
  }

  return (
    <>
      <Seo
        title={query ? `Search: ${query}` : "Search"}
        description={`Search the ${site.name} archive.`}
        path="/search"
        noindex
        jsonLd={breadcrumbJsonLd(site, crumbs)}
      />

      <div className="container-page pt-10">
        <Breadcrumbs items={crumbs} />
      </div>

      <header className="container-page mt-10 border-b border-rule pb-10">
        <h1 className="headline text-[clamp(3rem,8vw,6rem)]">Search</h1>
        <form onSubmit={submit} className="mt-8 flex max-w-2xl items-center gap-3 border-b border-input pb-3 focus-within:border-signal">
          <SearchIcon className="size-5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            key={query}
            name="q"
            defaultValue={query}
            placeholder="Topic, headline, tag…"
            className="w-full bg-transparent font-serif text-xl outline-none placeholder:text-muted-foreground/60"
          />
        </form>
      </header>

      <section className="container-page mt-10">
        {query && (
          <p className="kicker text-muted-foreground">
            {results.length} {results.length === 1 ? "result" : "results"} for “{query}”
          </p>
        )}
        <div className="mt-6">
          {results.map((article) => (
            <ListRow key={article.slug} article={article} />
          ))}
        </div>
        {query && results.length === 0 && (
          <p className="font-serif text-lg text-muted-foreground">
            Nothing matched. Try a broader term.
          </p>
        )}
      </section>
    </>
  );
}
