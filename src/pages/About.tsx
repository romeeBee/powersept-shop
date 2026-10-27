import { Link } from "react-router";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { AuthorAvatar } from "@/components/site/AuthorAvatar";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import type { Crumb } from "@/lib/jsonld";

export default function About() {
  const { site, authors, categories } = useContent();
  const crumbs: Crumb[] = [{ label: site.name, to: "/" }, { label: "About" }];

  return (
    <>
      <Seo
        title="About"
        description={`${site.name}: ${site.description}`}
        path="/about"
        jsonLd={breadcrumbJsonLd(site, crumbs)}
      />

      <div className="container-page pt-10">
        <Breadcrumbs items={crumbs} />
      </div>

      <header className="container-page mt-10">
        <h1 className="headline max-w-4xl text-[clamp(2.8rem,7vw,5.5rem)] text-balance">
          {site.tagline}
        </h1>
      </header>

      <section className="container-page mt-16 grid gap-14 lg:grid-cols-[minmax(0,42rem)_1fr]">
        <div className="reading text-foreground/90">
          <p className="drop-cap">
            {site.name} covers the technology industry the way a trade publication covers an
            industry: close to the engineering, sceptical of the announcement, and interested in
            what a decision costs.
          </p>
          <p className="mt-6">
            We publish one issue a week and run longer investigations when they are ready rather
            than when the calendar says so. Every story names its sources or explains why it
            cannot.
          </p>

          <h2 className="headline mt-14 mb-4 text-[2rem]">How we work</h2>
          <ul className="mt-6 space-y-3">
            <li className="grid grid-cols-[1.75rem_1fr] gap-2">
              <span aria-hidden className="pt-[0.65rem] text-signal">
                <span className="block h-px w-3 bg-current" />
              </span>
              <span>
                Reporters do not hold stock in companies on their beat, and disclosures run at the
                foot of any story where a conflict exists.
              </span>
            </li>
            <li className="grid grid-cols-[1.75rem_1fr] gap-2">
              <span aria-hidden className="pt-[0.65rem] text-signal">
                <span className="block h-px w-3 bg-current" />
              </span>
              <span>
                Corrections are appended to the article and dated. We do not quietly edit
                published copy.
              </span>
            </li>
            <li className="grid grid-cols-[1.75rem_1fr] gap-2">
              <span aria-hidden className="pt-[0.65rem] text-signal">
                <span className="block h-px w-3 bg-current" />
              </span>
              <span>
                Sponsored content is labelled in the headline and written by the sponsor, never by
                the newsroom.
              </span>
            </li>
          </ul>

          <h2 className="headline mt-14 mb-4 text-[2rem]">Pitching</h2>
          <p className="mt-6">
            We take pitches from working engineers, researchers and operators. Send two
            paragraphs: what you know that is not public, and how you know it. Include a link to
            anything you have written before, published or not.
          </p>
          <p className="mt-6">
            Rates are set per piece before commissioning. We pay on acceptance, not on
            publication.
          </p>
          <p className="mt-6">
            Pitches go to{" "}
            <a href="mailto:pitches@signal.press" className="link-underline">
              pitches@signal.press
            </a>
            . Corrections go to{" "}
            <a href="mailto:corrections@signal.press" className="link-underline">
              corrections@signal.press
            </a>
            .
          </p>
        </div>

        <aside className="space-y-12">
          <div>
            <h2 className="kicker border-b border-rule pb-3 text-foreground">Masthead</h2>
            <ul className="mt-6 space-y-5">
              {authors.map((author) => (
                <li key={author.slug}>
                  <Link to={`/author/${author.slug}`} className="group flex items-center gap-4">
                    <AuthorAvatar author={author} size={40} />
                    <span>
                      <span className="block font-medium transition-colors group-hover:text-signal">
                        {author.name}
                      </span>
                      <span className="block text-sm text-muted-foreground">{author.role}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="kicker border-b border-rule pb-3 text-foreground">Beats</h2>
            <ul className="mt-6 space-y-4">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/topic/${category.slug}`}
                    className="font-display text-xl transition-colors hover:text-signal"
                  >
                    {category.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
