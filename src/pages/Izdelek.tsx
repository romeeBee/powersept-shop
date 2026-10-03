import { powerseptLogo } from "@/components/shop/brand";
import { ProductCard } from "@/components/shop/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart, useCategories, useProduct, useProducts, useWishlist } from "@/hooks/use-shop";
import { productImages, formatPrice } from "@/lib/shop";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

export default function Izdelek() {
  const { slug = "" } = useParams();
  const product = useProduct(slug);
  const products = useProducts();
  const categories = useCategories();
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setQuantity(1);
    setActiveImage(0);
  }, [slug]);

  if (product === undefined) {
    return (
      <main className="container-page py-20 text-center">
        <div className="mx-auto size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="mt-4 text-sm text-muted-foreground">Nalaganje izdelka…</p>
      </main>
    );
  }

  if (product === null) {
    return (
      <main className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Izdelek ni najden</h1>
        <p className="mt-2 text-muted-foreground">
          Izdelek, ki ga iščete, ne obstaja več v našem katalogu.
        </p>
        <Button asChild className="mt-6">
          <Link to="/trgovina">Nazaj v trgovino</Link>
        </Button>
      </main>
    );
  }

  const image = productImages[product.slug];
  const wished = has(product._id);
  const category = categories.find((c) => c._id === product.categoryId);
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p._id !== product._id)
    .slice(0, 3);

  const galleryImages = [image].filter(Boolean);

  return (
    <main className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Domov</Link>
        <ChevronRight className="size-3.5" />
        <Link to="/trgovina" className="hover:text-foreground">Trgovina</Link>
        {category && (
          <>
            <ChevronRight className="size-3.5" />
            <Link to={`/trgovina?kategorija=${category.slug}`} className="hover:text-foreground">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-3.5" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="card-clinical flex h-96 items-center justify-center overflow-hidden bg-gradient-to-b from-secondary to-card p-8">
            <img
              src={galleryImages[activeImage]}
              alt={product.name}
              className="max-h-full w-auto object-contain"
            />
          </div>
          {galleryImages.length > 1 && (
            <div className="mt-3 flex gap-2">
              {galleryImages.map((src, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    "flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border-2 bg-secondary p-1.5 transition-colors",
                    activeImage === index ? "border-brand-teal" : "border-transparent",
                  )}
                >
                  <img src={src} alt="" className="max-h-full w-auto object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Buy panel */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {category && (
              <Badge variant="outline" className="border-brand-teal/30 bg-brand-teal-soft text-brand-teal">
                {category.name}
              </Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-brand-coral text-white">Najbolj prodajan</Badge>
            )}
            <Badge variant="outline" className="gap-1">
              <PackageCheck className="size-3" />
              {product.inStock ? "Na zalogi" : "Trenutno ni na zalogi"}
            </Badge>
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-muted-foreground">{product.shortDescription}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-4xl font-extrabold text-brand-teal">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-muted-foreground">
              {product.volumeMl} ml · z DDV
            </span>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border">
              <button
                className="flex size-10 items-center justify-center rounded-full hover:bg-secondary"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Zmanjšaj količino"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                className="flex size-10 items-center justify-center rounded-full hover:bg-secondary"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                aria-label="Povečaj količino"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 gap-2 sm:flex-none sm:px-10"
              disabled={!product.inStock}
              onClick={() => add(product._id, quantity)}
            >
              <ShoppingCart className="size-4" />
              Dodaj v košarico
            </Button>
            <motion.div
              animate={wished ? { scale: [1, 1.45, 0.9, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Button
                size="lg"
                variant="outline"
                className="gap-2"
                onClick={() => toggle(product._id)}
                aria-label={wished ? "Odstrani s seznama želja" : "Dodaj na seznam želja"}
              >
                <Heart
                  className={cn(
                    "size-4 transition-colors duration-200",
                    wished && "fill-brand-coral text-brand-coral",
                  )}
                />
              </Button>
            </motion.div>
          </div>

          <div className="mt-6 grid gap-3 rounded-xl border bg-secondary/50 p-4 text-sm sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <Truck className="size-4 text-brand-teal" />
              Dostava 2–3 delovne dni
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-brand-teal" />
              Varno plačilo po kartici ali UPN
            </span>
          </div>

          {/* Description tabs */}
          <Tabs defaultValue="opis" className="mt-8">
            <TabsList>
              <TabsTrigger value="opis">Opis</TabsTrigger>
              <TabsTrigger value="uporaba">Uporaba</TabsTrigger>
              <TabsTrigger value="sestava">Sestava</TabsTrigger>
            </TabsList>
            <TabsContent value="opis" className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.description}
              <ul className="mt-4 space-y-2">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2">
                    <PackageCheck className="mt-0.5 size-4 shrink-0 text-brand-mint" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="uporaba" className="mt-4">
              <ol className="space-y-3">
                {product.usage.map((step, index) => (
                  <li key={step} className="flex items-start gap-3 text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-teal text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </TabsContent>
            <TabsContent value="sestava" className="mt-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Vsebuje:</strong> {product.ingredients}
              </p>
              <p className="mt-3">
                Prostornina: {product.volumeMl} ml. Izdelek je že pripravljen za uporabo.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-bold">Podobni izdelki</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
