import { ProductCard } from "@/components/shop/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories, useProducts } from "@/hooks/use-shop";
import { useSearchCatalog } from "@/hooks/use-search";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

type SortOption = "privzeto" | "cena-narascajoce" | "cena-padajoce" | "ime";

export default function Trgovina() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("kategorija");
  const categories = useCategories();
  const products = useProducts();
  const search = useSearchCatalog();

  const [query, setQuery] = useState(searchParams.get("iskanje") ?? "");
  const [sort, setSort] = useState<SortOption>("privzeto");

  useEffect(() => {
    setQuery(searchParams.get("iskanje") ?? "");
  }, [searchParams]);

  const { products: searchResults } = search(query);

  const visibleProducts = useMemo(() => {
    let list = query.trim() === "" ? products : searchResults;
    if (activeCategory) {
      const category = categories.find((c) => c.slug === activeCategory);
      if (category) {
        list = list.filter((p) => p.categoryId === category._id);
      }
    }
    const sorted = [...list];
    switch (sort) {
      case "cena-narascajoce":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "cena-padajoce":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "ime":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "sl"));
        break;
      default:
        break;
    }
    return sorted;
  }, [products, searchResults, query, activeCategory, categories, sort]);

  const activeCategoryDoc = categories.find((c) => c.slug === activeCategory);

  function selectCategory(slug: string | null) {
    const next = new URLSearchParams(searchParams);
    if (slug === null) {
      next.delete("kategorija");
    } else {
      next.set("kategorija", slug);
    }
    setSearchParams(next);
  }

  return (
    <main className="container-page py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          {activeCategoryDoc ? activeCategoryDoc.name : "Trgovina"}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {activeCategoryDoc
            ? activeCategoryDoc.description
            : "Celoten katalog Powersept izdelkov za profesionalno higieno — proti glivicam, plesni in bakterijam."}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Category sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Kategorije
          </h2>
          <nav className="flex flex-wrap gap-2 lg:flex-col">
            <button
              onClick={() => selectCategory(null)}
              className={cn(
                "rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-secondary",
                activeCategory === null && "bg-secondary text-foreground",
              )}
            >
              Vse kategorije
              <span className="ml-1.5 text-xs text-muted-foreground">({products.length})</span>
            </button>
            {categories.map((category) => {
              const count = products.filter((p) => p.categoryId === category._id).length;
              return (
                <button
                  key={category._id}
                  onClick={() => selectCategory(category.slug)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-secondary",
                    activeCategory === category.slug && "bg-secondary text-foreground",
                  )}
                >
                  {category.name}
                  <span className="ml-1.5 text-xs text-muted-foreground">({count})</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Products */}
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="relative min-w-0 flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Išči v katalogu…"
                className="pl-9"
              />
            </div>
            <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
              <SelectTrigger className="w-[190px]">
                <SelectValue placeholder="Razvrsti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="privzeto">Privzeto razvrščanje</SelectItem>
                <SelectItem value="cena-narascajoce">Cena: od nižje k višji</SelectItem>
                <SelectItem value="cena-padajoce">Cena: od višje k nižji</SelectItem>
                <SelectItem value="ime">Po imenu (A–Ž)</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {visibleProducts.length} {visibleProducts.length === 1 ? "izdelek" : "izdelkov"}
            </span>
          </div>

          {visibleProducts.length === 0 ? (
            <div className="card-clinical flex flex-col items-center gap-2 py-16 text-center">
              <Search className="size-8 text-muted-foreground" />
              <p className="font-medium">Ni zadetkov</p>
              <p className="text-sm text-muted-foreground">
                Poskusite z drugim iskalnim nizom ali izberite drugo kategorijo.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
