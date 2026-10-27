import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { useContent } from "@/content/store";

export function Footer() {
  const { site, categories } = useContent();
  const [email, setEmail] = useState("");

  function subscribe(event: React.FormEvent) {
    event.preventDefault();
    if (!email.includes("@")) {
      toast.error("That email does not look right.");
      return;
    }
    setEmail("");
    toast.success("Thanks for subscribing.");
  }

  return (
    <footer className="mt-24 border-t border-rule">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-sm">
          <Wordmark className="text-3xl" />
          <p className="mt-4 font-serif text-[0.9375rem] leading-relaxed text-muted-foreground">
            {site.description}
          </p>
          <form onSubmit={subscribe} className="mt-7">
            <label htmlFor="footer-email" className="kicker text-foreground">
              One issue a week
            </label>
            <div className="mt-3 flex items-center border-b border-input focus-within:border-signal">
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="shrink-0 p-2 text-muted-foreground transition-colors hover:text-signal"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </form>
        </div>

        <nav aria-label="Topics">
          <h2 className="kicker text-muted-foreground">Topics</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link to={`/topic/${category.slug}`} className="transition-colors hover:text-signal">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Magazine">
          <h2 className="kicker text-muted-foreground">Magazine</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <Link to="/about" className="transition-colors hover:text-signal">
                About
              </Link>
            </li>
            <li>
              <Link to="/writers" className="transition-colors hover:text-signal">
                Writers
              </Link>
            </li>
            <li>
              <Link to="/archive" className="transition-colors hover:text-signal">
                Archive
              </Link>
            </li>
            <li>
              <Link to="/search" className="transition-colors hover:text-signal">
                Search
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Feeds">
          <h2 className="kicker text-muted-foreground">Feeds</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <a href="/rss.xml" className="transition-colors hover:text-signal">
                RSS
              </a>
            </li>
            <li>
              <a href="/sitemap.xml" className="transition-colors hover:text-signal">
                Sitemap
              </a>
            </li>
            <li>
              <a href="/robots.txt" className="transition-colors hover:text-signal">
                robots.txt
              </a>
            </li>
            <li>
              <Link to="/admin" className="transition-colors hover:text-signal">
                Editor login
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-rule">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Published since {site.founded}.
          </p>
          <p className="font-mono">{site.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
