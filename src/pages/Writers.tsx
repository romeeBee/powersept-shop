import { Link } from "react-router";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { AuthorAvatar } from "@/components/site/AuthorAvatar";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import type { Crumb } from "@/lib/jsonld";

export default function Writers() {
  const { site, authors, articlesByAuthor } = useContent();
  const crumbs: Crumb[] = [{ label: site.name, to: "/" }, { label: "Writers" }];

  return (
    <>
      <Seo
        title="Writers"
        description={`The people reporting for ${site.name}.`}
        path="/writers"
        jsonLd={breadcrumbJsonLd(site, crumbs)}
      />

      <div className="container-page pt-10">
        <Breadcrumbs items={crumbs} />
      </div>

      <header className="container-page mt-10 border-b border-rule pb-12">
        <h1 className="headline text-[clamp(3rem,8vw,6rem)]">Writers</h1>
      </header>

      <section className="container-page">
        {authors.map((author) => {
          const count = articlesByAuthor(author.slug).length;
          return (
            <article
              key={author.slug}
              className="group grid gap-6 border-b border-rule py-10 sm:grid-cols-[6rem_1fr_8rem] sm:items-center"
            >
              <Link to={`/author/${author.slug}`} aria-label={author.name}>
                <AuthorAvatar author={author} size={88} />
              </Link>
              <div>
                <span className="kicker text-signal">{author.role}</span>
                <h2 className="headline mt-2 text-[2rem]">
                  <Link
                    to={`/author/${author.slug}`}
                    className="transition-colors group-hover:text-signal"
                  >
                    {author.name}
                  </Link>
                </h2>
                <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground text-pretty">
                  {author.bio}
                </p>
              </div>
              <div className="text-sm text-muted-foreground sm:text-right">
                <span className="block">{author.location}</span>
                <span className="block">
                  {count} {count === 1 ? "story" : "stories"}
                </span>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
