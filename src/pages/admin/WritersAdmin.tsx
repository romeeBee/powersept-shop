import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useContent } from "@/content/store";
import { Seo } from "@/components/site/Seo";
import { AdminHeading, Field, GhostButton, PrimaryButton, inputClass } from "@/admin/ui";
import { AuthorAvatar } from "@/components/site/AuthorAvatar";
import type { Author } from "@/content/types";
import { slugify } from "@/lib/content-utils";
import { cn } from "@/lib/utils";

function emptyAuthor(): Author {
  return {
    slug: "",
    name: "",
    role: "",
    bio: "",
    location: "",
    hue: Math.floor(Math.random() * 360),
    links: {},
  };
}

export default function WritersAdmin() {
  const { authors, articlesByAuthor, saveAuthor, deleteAuthor } = useContent();
  const [editing, setEditing] = useState<{ author: Author; originalSlug?: string } | null>(null);

  function save() {
    if (!editing) return;
    const author = editing.author;
    const finalSlug = author.slug.trim() || slugify(author.name);
    if (!author.name.trim() || !finalSlug) {
      toast.error("A writer needs a name.");
      return;
    }
    saveAuthor({ ...author, slug: finalSlug }, editing.originalSlug);
    setEditing(null);
    toast.success("Writer saved");
  }

  return (
    <>
      <Seo title="Writers" description="Manage writers" path="/admin/writers" noindex />

      <AdminHeading
        title="Writers"
        action={
          <PrimaryButton type="button" onClick={() => setEditing({ author: emptyAuthor() })}>
            <Plus className="size-4" />
            New writer
          </PrimaryButton>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <ul className="space-y-3">
          {authors.map((author) => {
            const count = articlesByAuthor(author.slug).length;
            return (
              <li
                key={author.slug}
                className="flex items-center gap-4 rounded-lg border border-rule bg-background p-4"
              >
                <AuthorAvatar author={author} size={48} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{author.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{author.role}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {count} {count === 1 ? "story" : "stories"}
                </span>
                <GhostButton
                  type="button"
                  onClick={() => setEditing({ author: { ...author }, originalSlug: author.slug })}
                >
                  Edit
                </GhostButton>
                <button
                  type="button"
                  aria-label={`Delete ${author.name}`}
                  onClick={() => {
                    if (count > 0) {
                      toast.error("Reassign this writer's articles first.");
                      return;
                    }
                    deleteAuthor(author.slug);
                    toast.success("Writer removed");
                  }}
                  className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>

        {editing && (
          <aside className="h-fit rounded-lg border border-rule bg-background p-6 lg:sticky lg:top-6">
            <div className="flex items-center gap-4">
              <AuthorAvatar author={editing.author} size={56} />
              <h2 className="font-display text-2xl">
                {editing.originalSlug ? "Edit writer" : "New writer"}
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              <Field label="Name">
                <input
                  value={editing.author.name}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      author: {
                        ...editing.author,
                        name: event.target.value,
                        slug: editing.originalSlug ? editing.author.slug : slugify(event.target.value),
                      },
                    })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Slug">
                <input
                  value={editing.author.slug}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      author: { ...editing.author, slug: slugify(event.target.value) },
                    })
                  }
                  className={cn(inputClass, "font-mono text-xs")}
                />
              </Field>
              <Field label="Role">
                <input
                  value={editing.author.role}
                  onChange={(event) =>
                    setEditing({ ...editing, author: { ...editing.author, role: event.target.value } })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Bio">
                <textarea
                  rows={3}
                  value={editing.author.bio}
                  onChange={(event) =>
                    setEditing({ ...editing, author: { ...editing.author, bio: event.target.value } })
                  }
                  className={cn(inputClass, "resize-y")}
                />
              </Field>
              <Field label="Based in">
                <input
                  value={editing.author.location}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      author: { ...editing.author, location: event.target.value },
                    })
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Avatar hue" hint={`${editing.author.hue}°`}>
                <input
                  type="range"
                  min={0}
                  max={359}
                  value={editing.author.hue}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      author: { ...editing.author, hue: Number(event.target.value) },
                    })
                  }
                  className="w-full accent-[var(--signal)]"
                />
              </Field>
              <Field label="Email">
                <input
                  value={editing.author.links?.email ?? ""}
                  onChange={(event) =>
                    setEditing({
                      ...editing,
                      author: {
                        ...editing.author,
                        links: { ...editing.author.links, email: event.target.value || undefined },
                      },
                    })
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mt-6 flex gap-2">
              <PrimaryButton type="button" onClick={save}>
                Save writer
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
