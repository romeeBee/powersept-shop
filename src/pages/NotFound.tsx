import { Link } from "react-router";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";

export default function NotFound() {
  const { site, published } = useContent();

  return (
    <>
      <Seo
        title="Page not found"
        description="That page does not exist."
        path="/404"
        noindex
      />
      <div className="container-page flex min-h-[60vh] flex-col justify-center py-24">
        <span className="kicker text-signal">404</span>
        <h1 className="headline mt-4 text-[clamp(3rem,9vw,7rem)]">Nothing filed here</h1>
        <p className="mt-6 max-w-lg font-serif text-lg text-muted-foreground">
          The page you asked for is not part of the {site.name} archive.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            to="/"
            className="rounded-full bg-signal px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Front page
          </Link>
          <Link
            to="/archive"
            className="rounded-full border border-rule px-6 py-3 text-sm transition-colors hover:border-signal hover:text-signal"
          >
            Browse the archive
          </Link>
        </div>

        {published.length > 0 && (
          <div className="mt-16 border-t border-rule pt-8">
            <h2 className="kicker text-muted-foreground">Latest</h2>
            <ul className="mt-5 space-y-3">
              {published.slice(0, 3).map((article) => (
                <li key={article.slug}>
                  <Link
                    to={`/article/${article.slug}`}
                    className="font-display text-xl transition-colors hover:text-signal"
                  >
                    {article.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
