import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { productImages, formatPrice } from "@/lib/shop";
import type { ProductDoc } from "@/lib/shop";
import { ShoppingCart, Sparkles } from "lucide-react";
import { Link } from "react-router";

export function HeroArt({ product, onAdd }: { product: ProductDoc; onAdd: () => void }) {
  const image = productImages[product.slug];

  return (
    <div className="relative w-full max-w-md">
      <div className="bg-blob-teal absolute inset-0 scale-110 rounded-full" aria-hidden />
      <div className="card-clinical relative overflow-hidden bg-gradient-to-b from-secondary/60 to-card p-6">
        <div className="flex items-center justify-between">
          <Badge className="bg-brand-coral text-white hover:bg-brand-coral">Priljubljen izdelek</Badge>
          <span className="text-xs font-medium text-muted-foreground">
            {product.volumeMl} ml
          </span>
        </div>
        <div className="mt-4 flex h-56 items-center justify-center">
          {image && (
            <img
              src={image}
              alt={product.name}
              className="max-h-full w-auto object-contain drop-shadow-lg"
            />
          )}
        </div>
        <div className="mt-4">
          <Link to={`/izdelek/${product.slug}`} className="font-display text-lg font-bold hover:underline">
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {product.shortDescription}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-2xl font-extrabold text-brand-teal">{formatPrice(product.price)}</p>
            <p className="text-xs text-muted-foreground">z DDV</p>
          </div>
          <Button className="gap-2" onClick={onAdd}>
            <ShoppingCart className="size-4" />
            V košarico
          </Button>
        </div>
      </div>
      <div className="absolute -right-3 -top-3 flex items-center gap-1 rounded-full bg-white px-3 py-1.5 shadow-md ring-1 ring-border">
        <Sparkles className="size-3.5 text-brand-coral" />
        <span className="text-xs font-semibold">Aplikator vključen</span>
      </div>
    </div>
  );
}
