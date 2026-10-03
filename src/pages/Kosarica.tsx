import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-shop";
import { SHIPPING_FREE_THRESHOLD, formatPrice, productImages, shippingForSubtotal } from "@/lib/shop";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router";

export default function Kosarica() {
  const { items, subtotal, setQty, remove, clear, isLoading } = useCart();
  const shipping = shippingForSubtotal(subtotal);
  const remaining = Math.max(0, SHIPPING_FREE_THRESHOLD - subtotal);

  if (isLoading) {
    return (
      <main className="container-page py-20 text-center">
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container-page py-20">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
            <ShoppingBag className="size-7 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Vaša košarica je prazna</h1>
          <p className="text-muted-foreground">
            Poiščite prave izdelke za vaš izziv higene in jih dodajte v košarico.
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link to="/trgovina">Raziskuj trgovino</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container-page py-10">
      <h1 className="mb-8 font-display text-3xl font-bold">Košarica</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Line items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="card-clinical flex gap-4 p-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                {productImages[item.slug] ? (
                  <img src={productImages[item.slug]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ShoppingBag className="size-7 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/izdelek/${item.slug}`}
                  className="font-medium hover:underline"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.price)} / kos
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center rounded-full border">
                    <button
                      className="flex size-8 items-center justify-center rounded-full hover:bg-secondary"
                      onClick={() => setQty(item._id, item.quantity - 1)}
                      aria-label="Zmanjšaj količino"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      className="flex size-8 items-center justify-center rounded-full hover:bg-secondary"
                      onClick={() => setQty(item._id, item.quantity + 1)}
                      aria-label="Povečaj količino"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <span className="font-bold">{formatPrice(item.lineTotal)}</span>
                </div>
              </div>
              <button
                className="self-start text-muted-foreground transition-colors hover:text-destructive"
                onClick={() => remove(item._id)}
                aria-label="Odstrani iz košarice"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}

          <div className="flex justify-between">
            <Button asChild variant="outline">
              <Link to="/trgovina">Nadaljuj z nakupom</Link>
            </Button>
            <Button variant="ghost" onClick={clear} className="text-muted-foreground">
              Počisti košarico
            </Button>
          </div>
        </div>

        {/* Summary */}
        <aside className="card-clinical h-fit space-y-4 p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold">Povzetek naročila</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vmesna vsota</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dostava</span>
              <span className="font-medium">
                {shipping === 0 ? "Brezplačna" : formatPrice(shipping)}
              </span>
            </div>
            {remaining > 0 && (
              <p className="rounded-lg bg-brand-coral-soft px-3 py-2 text-xs">
                Za brezplačno dostavo manjka še {formatPrice(remaining)}.
              </p>
            )}
            <Separator className="my-3" />
            <div className="flex justify-between text-lg font-bold">
              <span>Skupaj</span>
              <span>{formatPrice(subtotal + shipping)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Cene vključujejo DDV.</p>
          </div>
          <Button asChild size="lg" className="w-full">
            <Link to="/blagajna">Nadaljuj na blagajno</Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Za zaključek nakupa se boste prijavili.
          </p>
        </aside>
      </div>
    </main>
  );
}
