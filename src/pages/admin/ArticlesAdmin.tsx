import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { AdminHeading, inputClass } from "@/admin/ui";
import { formatDateShort } from "@/lib/content-utils";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Filter = "all" | "published" | "draft";

export default function ArticlesAdmin() {
  const { articles, getAuthor, getCategory, deleteArticle } = useContent();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles
      .filter((article) => (filter === "all" ? true : article.status === filter))
      .filter((article) =>
        q ? `${article.title} ${article.tags.join(" ")} ${article.slug}`.toLowerCase().includes(q) : true,
      )
      .slice()
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }, [articles, filter, query]);

  return (
    <>
      <Seo title="Articles" description="Manage articles" path="/admin/articles" noindex />

      <AdminHeading
        title="Articles"
        action={
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-2 rounded-full bg-signal px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="size-4" />
            New article
          </Link>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter by title, slug or tag"
          className={cn(inputClass, "max-w-xs")}
        />
        <div className="flex gap-1 rounded-full border border-rule p-1">
          {(["all", "published", "draft"] as Filter[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={cn(
                "rounded-full px-3 py-1 text-xs capitalize transition-colors",
                filter === option
                  ? "bg-signal text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-rule bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-rule text-left">
              <th className="kicker px-5 py-3 font-normal text-muted-foreground">Title</th>
              <th className="kicker hidden px-5 py-3 font-normal text-muted-foreground md:table-cell">
                Topic
              </th>
              <th className="kicker hidden px-5 py-3 font-normal text-muted-foreground lg:table-cell">
                Writer
              </th>
              <th className="kicker px-5 py-3 font-normal text-muted-foreground">Date</th>
              <th className="kicker px-5 py-3 font-normal text-muted-foreground">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((article) => (
              <tr key={article.slug} className="border-b border-rule last:border-b-0">
                <td className="max-w-sm px-5 py-3">
                  <Link
                    to={`/admin/articles/${article.slug}`}
                    className="block truncate font-medium transition-colors hover:text-signal"
                  >
                    {article.title}
                  </Link>
                  <span className="block truncate font-mono text-xs text-muted-foreground">
                    /article/{article.slug}
                  </span>
                </td>
                <td className="hidden px-5 py-3 text-muted-foreground md:table-cell">
                  {getCategory(article.category)?.name ?? article.category}
                </td>
                <td className="hidden px-5 py-3 text-muted-foreground lg:table-cell">
                  {getAuthor(article.author)?.name ?? article.author}
                </td>
                <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                  {formatDateShort(article.publishedAt)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs",
                      article.status === "published" ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        article.status === "published" ? "bg-signal" : "bg-muted-foreground/40",
                      )}
                    />
                    {article.status}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      to={`/article/${article.slug}`}
                      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`View ${article.title}`}
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                    <Link
                      to={`/admin/articles/${article.slug}`}
                      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`Edit ${article.title}`}
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          aria-label={`Delete ${article.title}`}
                          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete “{article.title}”?</AlertDialogTitle>
                          <AlertDialogDescription>
                            It is removed from the archive, the sitemap and the feed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              deleteArticle(article.slug);
                              toast.success("Article deleted");
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                  No articles match that.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
