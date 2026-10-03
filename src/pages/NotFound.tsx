import { Button } from "@/components/ui/button";
import { ArrowLeft, SearchX } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
        <SearchX className="size-7 text-muted-foreground" />
      </div>
      <div>
        <p className="font-display text-6xl font-extrabold text-brand-teal">404</p>
        <h1 className="mt-3 font-display text-2xl font-bold">Stran ni bila najdena</h1>
        <p className="mt-2 text-muted-foreground">
          Naslov, ki ste ga odprli, ne obstaja ali pa je bil premaknjen.
        </p>
      </div>
      <Button asChild size="lg" className="gap-2">
        <Link to="/">
          <ArrowLeft className="size-4" />
          Nazaj na domačo stran
        </Link>
      </Button>
    </main>
  );
}
