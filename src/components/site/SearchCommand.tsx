import { useState } from "react";
import { useNavigate } from "react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useContent } from "@/content/store";
import { formatDateShort } from "@/lib/content-utils";

export function SearchCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { published, categories, authors } = useContent();
  const [query, setQuery] = useState("");

  function close(next: boolean) {
    if (!next) setQuery("");
    onOpenChange(next);
  }

  function go(path: string) {
    close(false);
    navigate(path);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={close}
      title="Search SIGNAL"
      description="Find an article, topic or writer"
      className="sm:max-w-2xl"
    >
      <CommandInput
        placeholder="Search articles, topics, writers…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[22rem]">
        <CommandEmpty>Nothing matched that.</CommandEmpty>
        <CommandGroup heading="Articles">
          {published.slice(0, 40).map((article) => (
            <CommandItem
              key={article.slug}
              value={`${article.title} ${article.tags.join(" ")} ${article.category}`}
              onSelect={() => go(`/article/${article.slug}`)}
            >
              <span className="truncate font-medium">{article.title}</span>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                {formatDateShort(article.publishedAt)}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Topics">
          {categories.map((category) => (
            <CommandItem
              key={category.slug}
              value={`topic ${category.name}`}
              onSelect={() => go(`/topic/${category.slug}`)}
            >
              {category.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Writers">
          {authors.map((author) => (
            <CommandItem
              key={author.slug}
              value={`writer ${author.name} ${author.role}`}
              onSelect={() => go(`/author/${author.slug}`)}
            >
              <span>{author.name}</span>
              <span className="ml-auto shrink-0 text-xs text-muted-foreground">{author.role}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
