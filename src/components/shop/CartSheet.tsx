import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-shop";
import { SHIPPING_FREE_THRESHOLD, formatPrice, productImages, shippingForSubtotal } from "@/lib/shop";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router";

export function CartSheet({
  open,
  onOpenChange,
  onGoToCart,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoToCart: () => void;
}) {
  const { items, subtotal, setQty, remove } = useCart();

  const shipping = shippingForSubtotal(subtotal);
  const remaining = Math.max(0, SHIPPING_FREE_THRESHOLD - subtotal);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader className="pb-2">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            Košarica
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="size-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">Vaša košarica je prazna</p>
            <p className="text-sm text-muted-foreground">
              Raziskujte katalog in izberite izdelke za vaš profil higene.
            </p>
            <Button onClick={onGoToCart} variant="outline" className="mt-2">
              Nadaljuj z nakupom
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              {items.map((item) => (
                <div key={item._id} className="flex gap-3 py-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                    {productImages[item.slug] ? (
                      <img
                        src={productImages[item.slug]}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="size-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/izdelek/${item.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="line-clamp-2 text-sm font-medium hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {formatPrice(item.price)} / kos
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border">
                        <button
                          className="flex size-7 items-center justify-center rounded-full hover:bg-secondary"
                          onClick={() => setQty(item._id, item.quantity - 1)}
                          aria-label="Zmanjšaj količino"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          className="flex size-7 items-center justify-center rounded-full hover:bg-secondary"
                          onClick={() => setQty(item._id, item.quantity + 1)}
                          aria-label="Povečaj količino"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">
                        {formatPrice(item.lineTotal)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="mt-1 self-start text-muted-foreground transition-colors hover:text-destructive"
                    onClick={() => remove(item._id)}
                    aria-label="Odstrani iz košarice"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>

            <SheetFooter className="border-t px-4 py-4">
              <div className="w-full space-y-1.5 text-sm">
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
                  <p className="rounded-lg bg-brand-coral-soft px-3 py-2 text-xs text-foreground">
                    Za brezplačno dostavo manjka še {formatPrice(remaining)}.
                  </p>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-bold">
                  <span>Skupaj</span>
                  <span>{formatPrice(subtotal + shipping)}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={onGoToCart}>
                Na blagajno
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
