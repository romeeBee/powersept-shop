import { Link, useParams } from "react-router";
import { Github, Globe, Mail, Twitter } from "lucide-react";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { AuthorAvatar } from "@/components/site/AuthorAvatar";
import { ListRow } from "@/components/article/ArticleCard";
import NotFound from "./NotFound";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/jsonld";
import type { Crumb } from "@/lib/jsonld";
import { formatDateShort } from "@/lib/content-utils";

export default function Author() {
  const { slug = "" } = useParams();
  const { site, getAuthor, articlesByAuthor, getCategory } = useContent();
  const author = getAuthor(slug);
  if (!author) return <NotFound />;

  const articles = articlesByAuthor(author.slug);
  const beats = Array.from(new Set(articles.map((article) => article.category)));
  const path = `/author/${author.slug}`;
  const crumbs: Crumb[] = [
    { label: site.name, to: "/" },
    { label: "Writers", to: "/writers" },
    { label: author.name },
  ];

  const links = [
    author.links?.x && { href: author.links.x, label: "X", Icon: Twitter },
    author.links?.github && { href: author.links.github, label: "GitHub", Icon: Github },
    author.links?.site && { href: author.links.site, label: "Website", Icon: Globe },
    author.links?.email && { href: `mailto:${author.links.email}`, label: author.links.email, Icon: Mail },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof Mail }[];

  return (
    <>
      <Seo
        title={author.name}
        description={`${author.role} at ${site.name}. ${author.bio}`}
        path={path}
        type="profile"
        jsonLd={[personJsonLd(site, author), breadcrumbJsonLd(site, crumbs)]}
      />

      <div className="container-page pt-10">
        <Breadcrumbs items={crumbs} />
      </div>

      <header className="container-page mt-10 border-b border-rule pb-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-end">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            <AuthorAvatar author={author} size={112} className="shadow-sm" />
            <div>
              <span className="kicker text-signal">{author.role}</span>
              <h1 className="headline mt-3 text-[clamp(2.6rem,6vw,4.5rem)]">{author.name}</h1>
              <p className="mt-4 max-w-xl font-serif text-lg leading-relaxed text-muted-foreground text-pretty">
                {author.bio}
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-6 text-sm lg:grid-cols-1 lg:border-l lg:border-rule lg:pl-10">
            <div>
              <dt className="kicker text-muted-foreground">Based in</dt>
              <dd className="mt-1.5">{author.location}</dd>
            </div>
            <div>
              <dt className="kicker text-muted-foreground">Published</dt>
              <dd className="mt-1.5">
                {articles.length} {articles.length === 1 ? "story" : "stories"}
                {articles[0] && (
                  <span className="mt-0.5 block text-muted-foreground">
                    Latest {formatDateShort(articles[0].publishedAt)}
                  </span>
                )}
              </dd>
            </div>
            {beats.length > 0 && (
              <div className="col-span-2 lg:col-span-1">
                <dt className="kicker text-muted-foreground">Beats</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {beats.map((beat) => {
                    const category = getCategory(beat);
                    if (!category) return null;
                    return (
                      <Link
                        key={beat}
                        to={`/topic/${beat}`}
                        className="rounded-full border border-rule px-3 py-1 text-xs transition-colors hover:border-signal hover:text-signal"
                      >
                        {category.name}
                      </Link>
                    );
                  })}
                </dd>
              </div>
            )}
            {links.length > 0 && (
              <div className="col-span-2 lg:col-span-1">
                <dt className="kicker text-muted-foreground">Elsewhere</dt>
                <dd className="mt-2 flex flex-wrap items-center gap-4">
                  {links.map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-signal"
                    >
                      <Icon className="size-4" />
                      <span className="text-xs">{label}</span>
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      <section className="container-page mt-14">
        {articles.length === 0 ? (
          <p className="font-serif text-lg text-muted-foreground">
            No published stories from {author.name} yet.
          </p>
        ) : (
          articles.map((article) => <ListRow key={article.slug} article={article} />)
        )}
      </section>
    </>
  );
}
