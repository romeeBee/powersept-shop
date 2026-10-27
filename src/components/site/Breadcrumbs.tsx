import { Link } from "react-router";
import { ChevronRight } from "lucide-react";
import type { Crumb } from "@/lib/jsonld";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("kicker text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.to && !last ? (
                <Link to={item.to} className="transition-colors hover:text-signal">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "text-foreground")}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight aria-hidden className="size-3 text-muted-foreground/60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
