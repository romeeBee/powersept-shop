import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Eye, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { Field, GhostButton, PrimaryButton, inputClass } from "@/admin/ui";
import { Markdown } from "@/components/article/Markdown";
import { ArticleCover } from "@/components/article/CoverArt";
import type { Article } from "@/content/types";
import { excerpt, readingMinutes, slugify, wordCount } from "@/lib/content-utils";
import { absolute } from "@/lib/jsonld";
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

function emptyArticle(category: string, author: string): Article {
  return {
    slug: "",
    title: "",
    standfirst: "",
    category,
    author,
    publishedAt: new Date().toISOString().slice(0, 10),
    status: "draft",
    featured: false,
    tags: [],
    body: "",
  };
}

/** Remounts the editor when the route points at a different article. */
export default function ArticleEditorRoute() {
  const { slug } = useParams();
  return <ArticleEditor key={slug ?? "new"} slug={slug} />;
}

function ArticleEditor({ slug }: { slug?: string }) {
  const navigate = useNavigate();
  const { site, categories, authors, getArticle, saveArticle, deleteArticle } = useContent();

  const isNew = !slug || slug === "new";
  const existing = isNew ? undefined : getArticle(slug);

  const [draft, setDraft] = useState<Article>(
    () => existing ?? emptyArticle(categories[0]?.slug ?? "", authors[0]?.slug ?? ""),
  );
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [tab, setTab] = useState<"preview" | "snippet">("preview");
  const [dirty, setDirty] = useState(false);

  const category = categories.find((entry) => entry.slug === draft.category);
  const minutes = useMemo(() => readingMinutes(draft.body || " "), [draft.body]);
  const words = useMemo(() => wordCount(draft.body || ""), [draft.body]);

  function update<K extends keyof Article>(key: K, value: Article[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setDirty(true);
  }

  function onTitleChange(value: string) {
    setDraft((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
    setDirty(true);
  }

  function save() {
    const finalSlug = draft.slug.trim() || slugify(draft.title);
    if (!draft.title.trim()) {
      toast.error("The article needs a title.");
      return;
    }
    if (!finalSlug) {
      toast.error("The article needs a slug.");
      return;
    }
    const clash = getArticle(finalSlug);
    if (clash && clash.slug !== existing?.slug) {
      toast.error("Another article already uses that slug.");
      return;
    }
    const next: Article = {
      ...draft,
      slug: finalSlug,
      tags: draft.tags.map((tag) => tag.trim()).filter(Boolean),
      updatedAt: existing ? new Date().toISOString().slice(0, 10) : undefined,
    };
    saveArticle(next, existing?.slug);
    setDirty(false);
    toast.success(existing ? "Article saved" : "Article created");
    if (!existing) navigate(`/admin/articles/${finalSlug}`, { replace: true });
  }

  const metaTitle = draft.seo?.title || draft.title || "Untitled";
  const metaDescription = draft.seo?.description || draft.standfirst || excerpt(draft.body, 150);

  return (
    <>
      <Seo
        title={isNew ? "New article" : `Editing ${draft.title}`}
        description="Article editor"
        path="/admin/articles"
        noindex
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/admin/articles"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-signal"
        >
          <ArrowLeft className="size-4" />
          All articles
        </Link>

        <div className="flex items-center gap-2">
          {dirty && <span className="kicker text-muted-foreground">Unsaved</span>}
          {!isNew && (
            <Link to={`/article/${draft.slug}`}>
              <GhostButton type="button">
                <Eye className="size-4" />
                View
              </GhostButton>
            </Link>
          )}
          {!isNew && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <GhostButton type="button" className="hover:border-destructive hover:text-destructive">
                  <Trash2 className="size-4" />
                  Delete
                </GhostButton>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete “{draft.title}”?</AlertDialogTitle>
                  <AlertDialogDescription>
                    It is removed from the archive, the sitemap and the feed.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      deleteArticle(draft.slug);
                      toast.success("Article deleted");
                      navigate("/admin/articles");
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <PrimaryButton type="button" onClick={save}>
            <Save className="size-4" />
            Save
          </PrimaryButton>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="space-y-6">
          <section className="rounded-lg border border-rule bg-background p-6">
            <div className="grid gap-5">
              <Field label="Headline">
                <input
                  value={draft.title}
                  onChange={(event) => onTitleChange(event.target.value)}
                  placeholder="The last easy node"
                  className={cn(inputClass, "font-display text-2xl")}
                />
              </Field>

              <Field label="Standfirst" hint="One or two sentences under the headline.">
                <textarea
                  value={draft.standfirst}
                  onChange={(event) => update("standfirst", event.target.value)}
                  rows={2}
                  className={cn(inputClass, "resize-y")}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Slug">
                  <input
                    value={draft.slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      update("slug", slugify(event.target.value));
                    }}
                    className={cn(inputClass, "font-mono text-xs")}
                  />
                </Field>
                <Field label="Published date">
                  <input
                    type="date"
                    value={draft.publishedAt}
                    onChange={(event) => update("publishedAt", event.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Topic">
                  <select
                    value={draft.category}
                    onChange={(event) => update("category", event.target.value)}
                    className={inputClass}
                  >
                    {categories.map((entry) => (
                      <option key={entry.slug} value={entry.slug}>
                        {entry.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Writer">
                  <select
                    value={draft.author}
                    onChange={(event) => update("author", event.target.value)}
                    className={inputClass}
                  >
                    {authors.map((entry) => (
                      <option key={entry.slug} value={entry.slug}>
                        {entry.name}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Status">
                  <select
                    value={draft.status}
                    onChange={(event) =>
                      update("status", event.target.value as Article["status"])
                    }
                    className={inputClass}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </Field>
                <Field label="Tags" hint="Comma separated.">
                  <input
                    value={draft.tags.join(", ")}
                    onChange={(event) => update("tags", event.target.value.split(","))}
                    className={inputClass}
                  />
                </Field>
              </div>

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={!!draft.featured}
                  onChange={(event) => update("featured", event.target.checked)}
                  className="size-4 accent-[var(--signal)]"
                />
                Run on the front page as a feature
              </label>
            </div>
          </section>

          <section className="rounded-lg border border-rule bg-background p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium">Body</h2>
              <span className="text-xs text-muted-foreground">
                {words.toLocaleString("en-GB")} words, {minutes} min
              </span>
            </div>
            <textarea
              value={draft.body}
              onChange={(event) => update("body", event.target.value)}
              rows={26}
              spellCheck
              placeholder={"Opening paragraph.\n\n## A section\n\n> A pull quote\n\n- A list item"}
              className={cn(inputClass, "mt-4 resize-y font-mono text-[0.8125rem] leading-6")}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              Markdown: ## headings, &gt; quotes, - lists, ```fences```, **bold**, [links](url).
            </p>
          </section>

          <section className="rounded-lg border border-rule bg-background p-6">
            <h2 className="text-sm font-medium">Search and social</h2>
            <div className="mt-5 grid gap-5">
              <Field label="Meta title" hint="Falls back to the headline.">
                <input
                  value={draft.seo?.title ?? ""}
                  onChange={(event) =>
                    update("seo", { ...draft.seo, title: event.target.value || undefined })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Meta description" hint="Falls back to the standfirst.">
                <textarea
                  value={draft.seo?.description ?? ""}
                  onChange={(event) =>
                    update("seo", { ...draft.seo, description: event.target.value || undefined })
                  }
                  rows={2}
                  className={cn(inputClass, "resize-y")}
                />
              </Field>
              <Field label="Cover image URL" hint="Leave empty to use the generated cover.">
                <input
                  value={draft.coverImage ?? ""}
                  onChange={(event) => update("coverImage", event.target.value || undefined)}
                  className={cn(inputClass, "font-mono text-xs")}
                />
              </Field>
              <Field label="Social image URL" hint="Used for Open Graph and Twitter cards.">
                <input
                  value={draft.seo?.image ?? ""}
                  onChange={(event) =>
                    update("seo", { ...draft.seo, image: event.target.value || undefined })
                  }
                  className={cn(inputClass, "font-mono text-xs")}
                />
              </Field>
            </div>
          </section>
        </div>

        {/* Preview rail */}
        <aside className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)] xl:overflow-y-auto">
          <div className="flex gap-1 rounded-full border border-rule p-1">
            {(["preview", "snippet"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTab(option)}
                className={cn(
                  "flex-1 rounded-full px-3 py-1.5 text-xs capitalize transition-colors",
                  tab === option
                    ? "bg-signal text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {option === "snippet" ? "Search result" : "Preview"}
              </button>
            ))}
          </div>

          {tab === "preview" ? (
            <div className="mt-4 overflow-hidden rounded-lg border border-rule bg-background">
              <div className="relative aspect-[16/9] bg-muted">
                <ArticleCover
                  slug={draft.slug || "preview"}
                  hue={category?.hue ?? 22}
                  image={draft.coverImage}
                  title={draft.title || "Preview"}
                />
              </div>
              <div className="p-6">
                <span className="kicker text-signal">{category?.name ?? "Topic"}</span>
                <h3 className="headline mt-2 text-3xl">{draft.title || "Untitled"}</h3>
                <p className="mt-3 font-serif text-sm leading-relaxed text-muted-foreground">
                  {draft.standfirst}
                </p>
                <div className="mt-6 border-t border-rule pt-6">
                  <Markdown source={draft.body || "_Nothing written yet._"} className="text-base" />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-5">
              <div className="rounded-lg border border-rule bg-background p-5">
                <span className="kicker text-muted-foreground">Google result</span>
                <p className="mt-4 truncate font-mono text-xs text-muted-foreground">
                  {absolute(site, `/article/${draft.slug || "slug"}`)}
                </p>
                <p className="mt-1 text-lg leading-snug text-[#1a0dab] dark:text-[#8ab4f8]">
                  {metaTitle} — {site.name}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {metaDescription || "No description yet."}
                </p>
              </div>

              <div className="rounded-lg border border-rule bg-background p-5">
                <span className="kicker text-muted-foreground">Social card</span>
                <div className="mt-4 overflow-hidden rounded-md border border-rule">
                  <div className="relative aspect-[1.91/1] bg-muted">
                    <ArticleCover
                      slug={draft.slug || "preview"}
                      hue={category?.hue ?? 22}
                      image={draft.seo?.image ?? draft.coverImage}
                      title={draft.title || "Preview"}
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-medium">{metaTitle}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {metaDescription}
                    </p>
                  </div>
                </div>
              </div>

              <ul className="rounded-lg border border-rule bg-background p-5 text-sm">
                <li className="flex items-center justify-between gap-4 py-1.5">
                  <span className="text-muted-foreground">Meta title length</span>
                  <span className={cn(metaTitle.length > 60 && "text-destructive")}>
                    {metaTitle.length}/60
                  </span>
                </li>
                <li className="flex items-center justify-between gap-4 py-1.5">
                  <span className="text-muted-foreground">Description length</span>
                  <span className={cn(metaDescription.length > 160 && "text-destructive")}>
                    {metaDescription.length}/160
                  </span>
                </li>
                <li className="flex items-center justify-between gap-4 py-1.5">
                  <span className="text-muted-foreground">Reading time</span>
                  <span>{minutes} min</span>
                </li>
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
