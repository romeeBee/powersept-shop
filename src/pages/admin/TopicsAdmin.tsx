import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { AdminHeading, Field, GhostButton, PrimaryButton, inputClass } from "@/admin/ui";
import { CoverArt } from "@/components/article/CoverArt";
import type { Category } from "@/content/types";
import { slugify } from "@/lib/content-utils";
import { cn } from "@/lib/utils";

function emptyCategory(): Category {
  return { slug: "", name: "", description: "", hue: Math.floor(Math.random() * 360) };
}

export default function TopicsAdmin() {
  const { categories, articlesByCategory, saveCategory, deleteCategory } = useContent();
  const [editing, setEditing] = useState<{ category: Category; originalSlug?: string } | null>(null);

  function save() {
    if (!editing) return;
    const category = editing.category;
    const finalSlug = category.slug.trim() || slugify(category.name);
    if (!category.name.trim() || !finalSlug) {
      toast.error("A topic needs a name.");
      return;
    }
    saveCategory({ ...category, slug: finalSlug }, editing.originalSlug);
    setEditing(null);
    toast.success("Topic saved");
  }

  return (
    <>
      <Seo title="Topics" description="Manage topics" path="/admin/topics" noindex />

      <AdminHeading
        title="Topics"
        action={
          <PrimaryButton type="button" onClick={() => setEditing({ category: emptyCategory() })}>
            <Plus className="size-4" />
            New topic
          </PrimaryButton>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <ul className="grid gap-4 sm:grid-cols-2">
          {categories.map((category) => {
            const count = articlesByCategory(category.slug).length;
            return (
              <li
                key={category.slug}
                className="overflow-hidden rounded-lg border border-rule bg-background"
              >
                <div className="relative h-20">
                  <CoverArt seed={category.slug} hue={category.hue} label={category.name} />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-2xl">{category.name}</h2>
                      <p className="font-mono text-xs text-muted-foreground">/topic/{category.slug}</p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {count} {count === 1 ? "story" : "stories"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="mt-5 flex items-center gap-2">
                    <GhostButton
                      type="button"
                      onClick={() =>
                        setEditing({ category: { ...category }, originalSlug: category.slug })
                      }
                    >
                      Edit
                    </GhostButton>
                    <button
                      type="button"
                      aria-label={`Delete ${category.name}`}
                      onClick={() => {
                        if (count > 0) {
                          toast.error("Move this topic's articles first.");
                          return;
                        }
                        deleteCategory(category.slug);
                        toast.success("Topic removed");
                      }}
                      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {editing && (
          <aside className="h-fit rounded-lg border border-rule bg-background p-6 lg:sticky lg:top-6">
            <h2 className="font-display text-2xl">
              {editing.originalSlug ? "Edit topic" : "New topic"}
            </h2>

            <div className="relative mt-5 h-24 overflow-hidden rounded-md">
              <CoverArt
                seed={editing.category.slug || "preview"}
                hue={editing.category.hue}
                label={editing.category.name}
              />
            </div>

            <div className="mt-5 grid gap-4">
              <Field label="Name">
                <input
                  value={editing.category.name}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      category: {
                        ...editing.category,
                        name: event.target.value,
                        slug: editing.originalSlug
                          ? editing.category.slug
                          : slugify(event.target.value),
                      },
                    })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Slug">
                <input
                  value={editing.category.slug}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      category: { ...editing.category, slug: slugify(event.target.value) },
                    })
                  }
                  className={cn(inputClass, "font-mono text-xs")}
                />
              </Field>
              <Field label="Description" hint="Shown on the topic page header.">
                <textarea
                  rows={3}
                  value={editing.category.description}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      category: { ...editing.category, description: event.target.value },
                    })
                  }
                  className={cn(inputClass, "resize-y")}
                />
              </Field>
              <Field label="Cover hue" hint={`${editing.category.hue}°`}>
                <input
                  type="range"
                  min={0}
                  max={359}
                  value={editing.category.hue}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      category: { ...editing.category, hue: Number(event.target.value) },
                    })
                  }
                  className="w-full accent-[var(--signal)]"
                />
              </Field>
            </div>

            <div className="mt-6 flex gap-2">
              <PrimaryButton type="button" onClick={save}>
                Save topic
              </PrimaryButton>
              <GhostButton type="button" onClick={() => setEditing(null)}>
                Cancel
              </GhostButton>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
