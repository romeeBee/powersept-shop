import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { useCart, useWishlist } from "@/hooks/use-shop";
import { formatPrice } from "@/lib/shop";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

export default function SeznamZelja() {
  const { products, isLoading, clear, addAllToCart } = useWishlist();
  const { add } = useCart();
  const [busy, setBusy] = useState(false);

  if (isLoading) {
    return (
      <main className="container-page py-20 text-center">
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (products.length === 0) {
    return (
      <main className="container-page py-20">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
            <Heart className="size-7 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Seznam želja je prazen</h1>
          <p className="text-muted-foreground">
            Označite izdelke s srcem in jih shranite za pozneje.
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link to="/trgovina">Raziskuj trgovino</Link>
          </Button>
        </div>
      </main>
    );
  }

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  async function handleAddAll() {
    setBusy(true);
    try {
      await addAllToCart();
    } finally {
      setBusy(false);
    }
  }

  async function handleClear() {
    try {
      await clear();
    } catch {
      toast.error("Čiščenje seznama ni uspelo.");
    }
  }

  return (
    <main className="container-page py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Seznam želja</h1>
          <p className="mt-2 text-muted-foreground">
            {products.length} {products.length === 1 ? "izdelek" : products.length === 2 ? "izdelka" : "izdelkov"} shranjenih
            za pozneje — skupna vrednost {formatPrice(totalValue)}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAddAll} disabled={busy} className="gap-2">
            <ShoppingCart className="size-4" />
            Dodaj vse v košarico
          </Button>
          <Button variant="outline" onClick={handleClear} className="gap-2 text-muted-foreground">
            <Trash2 className="size-4" />
            Počisti seznam
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <WishlistCard key={product._id} product={product} onAdd={() => add(product._id)} />
        ))}
      </div>
    </main>
  );
}

function WishlistCard({
  product,
  onAdd,
}: {
  product: Parameters<typeof ProductCard>[0]["product"];
  onAdd: () => void;
}) {
  return (
    <div className="relative">
      <ProductCard product={product} />
      <Button
        size="sm"
        variant="secondary"
        className="absolute right-3 top-3 shadow-sm"
        onClick={onAdd}
        disabled={!product.inStock}
      >
        Hitro v košarico
      </Button>
    </div>
  );
}
