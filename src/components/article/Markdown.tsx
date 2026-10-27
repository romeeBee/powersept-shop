import React from "react";
import { cn } from "@/lib/utils";

/**
 * A deliberately small Markdown renderer: headings, paragraphs, lists,
 * blockquotes, fenced code, rules, images and inline emphasis/links/code.
 * Enough for editorial copy, with no runtime HTML parsing.
 */

type Block =
  | { kind: "heading"; level: 2 | 3 | 4; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "code"; lang: string; code: string }
  | { kind: "image"; alt: string; src: string }
  | { kind: "rule" };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // closing fence
      blocks.push({ kind: "code", lang, code: code.join("\n") });
      continue;
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push({
        kind: "heading",
        level: heading[1].length as 2 | 3 | 4,
        text: heading[2].trim(),
      });
      i++;
      continue;
    }

    if (/^(---|\*\*\*)\s*$/.test(line)) {
      blocks.push({ kind: "rule" });
      i++;
      continue;
    }

    const image = /^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/.exec(line.trim());
    if (image) {
      blocks.push({ kind: "image", alt: image[1], src: image[2] });
      i++;
      continue;
    }

    if (line.startsWith("> ")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quote.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ kind: "quote", text: quote.join(" ") });
      continue;
    }

    if (/^[-*]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
      const ordered = /^\d+\.\s+/.test(line);
      const items: string[] = [];
      while (
        i < lines.length &&
        (ordered ? /^\d+\.\s+/.test(lines[i]) : /^[-*]\s+/.test(lines[i]))
      ) {
        items.push(lines[i].replace(ordered ? /^\d+\.\s+/ : /^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ kind: "list", ordered, items });
      continue;
    }

    const paragraph: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("> ") &&
      !/^#{2,4}\s/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i])
    ) {
      paragraph.push(lines[i]);
      i++;
    }
    if (paragraph.length) blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

/** Anchor id for a heading — kept in sync with the article page's contents rail. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function inline(text: string): React.ReactNode[] {
  const parts = text.split(INLINE).filter((part) => part !== "" && part !== undefined);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={index}
          className="rounded bg-muted px-[0.35em] py-[0.1em] font-mono text-[0.85em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const external = /^https?:\/\//.test(link[2]);
      return (
        <a
          key={index}
          href={link[2]}
          className="link-underline"
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {link[1]}
        </a>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export function Markdown({
  source,
  dropCap = false,
  className,
}: {
  source: string;
  dropCap?: boolean;
  className?: string;
}) {
  const blocks = React.useMemo(() => parseBlocks(source), [source]);
  let paragraphIndex = 0;

  return (
    <div className={cn("reading text-foreground/90", className)}>
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "heading": {
            const id = headingId(block.text);
            if (block.level === 2) {
              return (
                <h2
                  key={index}
                  id={id}
                  className="headline mt-14 mb-4 scroll-mt-24 text-[2rem] leading-[1.1] text-foreground"
                >
                  {inline(block.text)}
                </h2>
              );
            }
            if (block.level === 3) {
              return (
                <h3
                  key={index}
                  id={id}
                  className="mt-10 mb-3 scroll-mt-24 font-sans text-lg font-semibold tracking-tight text-foreground"
                >
                  {inline(block.text)}
                </h3>
              );
            }
            return (
              <h4 key={index} className="kicker mt-8 mb-2 text-muted-foreground">
                {inline(block.text)}
              </h4>
            );
          }
          case "paragraph": {
            const isFirst = paragraphIndex === 0;
            paragraphIndex++;
            return (
              <p
                key={index}
                className={cn("mt-6 first:mt-0 text-pretty", dropCap && isFirst && "drop-cap")}
              >
                {inline(block.text)}
              </p>
            );
          }
          case "quote":
            return (
              <blockquote
                key={index}
                className="my-10 border-l-2 border-signal pl-6 font-display text-[1.6rem] leading-[1.25] text-foreground"
              >
                {inline(block.text)}
              </blockquote>
            );
          case "list":
            return block.ordered ? (
              <ol key={index} className="mt-6 space-y-3 pl-0">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="grid grid-cols-[1.75rem_1fr] gap-2">
                    <span className="kicker pt-[0.45rem] text-signal">
                      {String(itemIndex + 1).padStart(2, "0")}
                    </span>
                    <span>{inline(item)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={index} className="mt-6 space-y-3">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="grid grid-cols-[1.75rem_1fr] gap-2">
                    <span aria-hidden className="pt-[0.65rem] text-signal">
                      <span className="block h-px w-3 bg-current" />
                    </span>
                    <span>{inline(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "code":
            return (
              <pre
                key={index}
                className="my-8 overflow-x-auto rounded-md border border-rule bg-card p-5 font-mono text-[0.8125rem] leading-6"
              >
                <code>{block.code}</code>
              </pre>
            );
          case "image":
            return (
              <figure key={index} className="my-10">
                <img
                  src={block.src}
                  alt={block.alt}
                  loading="lazy"
                  className="w-full rounded-md border border-rule"
                />
                {block.alt && (
                  <figcaption className="mt-3 font-sans text-sm text-muted-foreground">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            );
          case "rule":
            return <hr key={index} className="my-12 border-rule" />;
        }
      })}
    </div>
  );
}
