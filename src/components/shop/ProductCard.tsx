import { powerseptLogo } from "@/components/shop/brand";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart, useWishlist } from "@/hooks/use-shop";
import { productImages, formatPrice } from "@/lib/shop";
import { cn } from "@/lib/utils";
import type { ProductDoc } from "@/lib/shop";
import { motion } from "framer-motion";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router";

export function ProductCard({ product }: { product: ProductDoc }) {
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const image = productImages[product.slug];
  const wished = has(product._id);

  return (
    <div className="card-clinical group flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <Link
        to={`/izdelek/${product.slug}`}
        className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-b from-secondary to-card p-4"
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <img src={powerseptLogo} alt={product.name} className="h-16 w-auto opacity-40" />
        )}
        {product.isFeatured && (
          <Badge className="absolute left-3 top-3 bg-brand-teal text-primary-foreground">
            Najbolj prodajan
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          to={`/izdelek/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug hover:underline"
        >
          {product.name}
        </Link>
        <p className="line-clamp-2 text-xs text-muted-foreground">{product.shortDescription}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-bold text-primary">{formatPrice(product.price)}</span>
          <div className="flex items-center gap-1">
            <motion.div
              animate={wished ? { scale: [1, 1.5, 0.85, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="shrink-0"
            >
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label={wished ? "Odstrani s seznama želja" : "Dodaj na seznam želja"}
                onClick={() => toggle(product._id)}
              >
                <Heart
                  className={cn(
                    "size-4 transition-colors duration-200",
                    wished ? "fill-brand-coral text-brand-coral" : "text-muted-foreground",
                  )}
                />
              </Button>
            </motion.div>
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => add(product._id)}
              disabled={!product.inStock}
            >
              <ShoppingCart className="size-3.5" />
              V košarico
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
