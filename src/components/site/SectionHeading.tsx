import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  to,
  linkLabel,
  className,
}: {
  title: string;
  to?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4 border-b border-rule pb-3", className)}>
      <h2 className="kicker text-foreground">{title}</h2>
      {to && (
        <Link
          to={to}
          className="group inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-signal"
        >
          {linkLabel ?? "All"}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      )}
    </div>
  );
}
