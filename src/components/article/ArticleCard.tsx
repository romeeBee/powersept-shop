import { Link } from "react-router";
import type { Article } from "@/content/types";
import { useContent } from "@/content/store";
import { ArticleCover } from "./CoverArt";
import { AuthorAvatar } from "@/components/site/AuthorAvatar";
import { formatDateShort, readingMinutes } from "@/lib/content-utils";
import { cn } from "@/lib/utils";

export function TopicLabel({ slug, className }: { slug: string; className?: string }) {
  const { getCategory } = useContent();
  const category = getCategory(slug);
  if (!category) return null;
  return (
    <Link
      to={`/topic/${category.slug}`}
      className={cn("kicker text-signal transition-opacity hover:opacity-70", className)}
    >
      {category.name}
    </Link>
  );
}

export function Byline({
  article,
  size = "sm",
  className,
}: {
  article: Article;
  size?: "sm" | "lg";
  className?: string;
}) {
  const { getAuthor } = useContent();
  const author = getAuthor(article.author);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {author && <AuthorAvatar author={author} size={size === "lg" ? 44 : 28} />}
      <div className={cn("leading-tight", size === "lg" ? "text-sm" : "text-[0.8125rem]")}>
        {author && (
          <Link
            to={`/author/${author.slug}`}
            className="font-medium text-foreground transition-colors hover:text-signal"
          >
            {author.name}
          </Link>
        )}
        <div className="mt-0.5 flex items-center gap-4 text-muted-foreground">
          <time dateTime={article.publishedAt}>{formatDateShort(article.publishedAt)}</time>
          <span>{readingMinutes(article.body)} min read</span>
        </div>
      </div>
    </div>
  );
}

type CardProps = {
  article: Article;
  className?: string;
};

/** The single largest item on the front page. */
export function LeadCard({ article, className }: CardProps) {
  const { getCategory } = useContent();
  const hue = getCategory(article.category)?.hue ?? 22;
  return (
    <article className={cn("group grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center", className)}>
      <Link
        to={`/article/${article.slug}`}
        className="relative block aspect-[8/5] overflow-hidden rounded-lg bg-muted"
      >
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]">
          <ArticleCover slug={article.slug} hue={hue} image={article.coverImage} title={article.title} />
        </div>
      </Link>
      <div>
        <TopicLabel slug={article.category} />
        <h2 className="headline mt-4 text-[clamp(2.4rem,4.4vw,3.9rem)]">
          <Link to={`/article/${article.slug}`} className="transition-colors group-hover:text-signal">
            {article.title}
          </Link>
        </h2>
        <p className="mt-5 max-w-xl font-serif text-lg leading-relaxed text-muted-foreground text-pretty">
          {article.standfirst}
        </p>
        <Byline article={article} size="lg" className="mt-7" />
      </div>
    </article>
  );
}

/** Cover on top, used in the main grid. */
export function FeatureCard({ article, className }: CardProps) {
  const { getCategory } = useContent();
  const hue = getCategory(article.category)?.hue ?? 22;
  return (
    <article className={cn("group flex flex-col", className)}>
      <Link
        to={`/article/${article.slug}`}
        className="relative block aspect-[4/3] overflow-hidden rounded-md bg-muted"
      >
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
          <ArticleCover slug={article.slug} hue={hue} image={article.coverImage} title={article.title} />
        </div>
      </Link>
      <TopicLabel slug={article.category} className="mt-5" />
      <h3 className="headline mt-2.5 text-[1.65rem]">
        <Link to={`/article/${article.slug}`} className="transition-colors group-hover:text-signal">
          {article.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground text-pretty">
        {article.standfirst}
      </p>
      <Byline article={article} className="mt-5" />
    </article>
  );
}

/** Horizontal card: small cover beside the headline. */
export function WideCard({ article, className }: CardProps) {
  const { getCategory } = useContent();
  const hue = getCategory(article.category)?.hue ?? 22;
  return (
    <article className={cn("group grid grid-cols-[7.5rem_1fr] gap-5 sm:grid-cols-[11rem_1fr]", className)}>
      <Link
        to={`/article/${article.slug}`}
        className="relative block aspect-square overflow-hidden rounded-md bg-muted"
      >
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]">
          <ArticleCover slug={article.slug} hue={hue} image={article.coverImage} title={article.title} />
        </div>
      </Link>
      <div className="min-w-0">
        <TopicLabel slug={article.category} />
        <h3 className="headline mt-2 text-[1.3rem] sm:text-[1.5rem]">
          <Link to={`/article/${article.slug}`} className="transition-colors group-hover:text-signal">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {article.standfirst}
        </p>
        <Byline article={article} className="mt-4" />
      </div>
    </article>
  );
}

/** Text-only row used in ranked and sidebar lists. */
export function RankedRow({
  article,
  rank,
  className,
}: CardProps & { rank: number }) {
  return (
    <article className={cn("group grid grid-cols-[2.5rem_1fr] gap-3 py-5", className)}>
      <span className="headline text-[1.75rem] leading-none text-signal/35 transition-colors group-hover:text-signal">
        {String(rank).padStart(2, "0")}
      </span>
      <div>
        <h3 className="headline text-[1.2rem] leading-tight">
          <Link to={`/article/${article.slug}`} className="transition-colors group-hover:text-signal">
            {article.title}
          </Link>
        </h3>
        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
          <TopicLabel slug={article.category} />
          <time dateTime={article.publishedAt}>{formatDateShort(article.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}

/** Compact row for author and topic listings. */
export function ListRow({ article, className }: CardProps) {
  const { getCategory } = useContent();
  const hue = getCategory(article.category)?.hue ?? 22;
  return (
    <article
      className={cn(
        "group grid gap-5 border-t border-rule py-8 sm:grid-cols-[1fr_12rem] sm:gap-10",
        className,
      )}
    >
      <div>
        <TopicLabel slug={article.category} />
        <h3 className="headline mt-2.5 text-[1.75rem]">
          <Link to={`/article/${article.slug}`} className="transition-colors group-hover:text-signal">
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground text-pretty">
          {article.standfirst}
        </p>
        <Byline article={article} className="mt-5" />
      </div>
      <Link
        to={`/article/${article.slug}`}
        className="relative order-first block aspect-[4/3] overflow-hidden rounded-md bg-muted sm:order-last sm:aspect-square"
      >
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.05]">
          <ArticleCover slug={article.slug} hue={hue} image={article.coverImage} title={article.title} />
        </div>
      </Link>
    </article>
  );
}
