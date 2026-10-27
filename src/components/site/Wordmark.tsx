import { useContent } from "@/content/store";
import { cn } from "@/lib/utils";

export function Wordmark({ className }: { className?: string }) {
  const { site } = useContent();
  return (
    <span
      className={cn(
        "font-display leading-none tracking-[0.14em] text-foreground transition-colors",
        className,
      )}
    >
      {site.name}
      <span className="text-signal">.</span>
    </span>
  );
}
