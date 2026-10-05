import { HeroArt } from "@/components/shop/HeroArt";
import { ProductCard } from "@/components/shop/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCategories, useProducts, useCart } from "@/hooks/use-shop";
import { formatPrice } from "@/lib/shop";
import {
  ArrowRight,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router";

export default function Landing() {
  const navigate = useNavigate();
  const categories = useCategories();
  const products = useProducts();
  const { add } = useCart();

  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const heroProduct = products.find((p) => p.slug === "powersept-proti-glivicam-200ml");

  return (
    <main>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="bg-grid-soft absolute inset-0" aria-hidden />
        <div className="bg-blob-mint absolute -left-32 top-10 size-96 rounded-full" aria-hidden />
        <div className="bg-blob-coral absolute -right-24 bottom-0 size-96 rounded-full" aria-hidden />

        <div className="container-page relative grid gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="flex flex-col justify-center">
            <Badge variant="outline" className="mb-5 w-fit gap-1.5 border-brand-teal/30 bg-brand-teal-soft px-3 py-1.5 text-xs font-semibold text-brand-teal">
              <Sparkles className="size-3.5" />
              Profesionalna higiena za podjetja in domove
            </Badge>
            <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-6xl">
              Sredstvo proti glivicam, plesni in bakterijam —{" "}
              <span className="text-brand-teal">dokazano deluje</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Pršilo proti glivicam na nohtih z aplikatorjem, razkužilo za
              površine brez vonja in zanesljivo odstranjevanje plesni. Vodikov
              peroksid in srebrovi ioni — brez izpiranja, varno za vsakdanjo
              uporabo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="gap-2" onClick={() => navigate("/trgovina")}>
                Raziskuj trgovino
                <ArrowRight className="size-4" />
              </Button>
              {heroProduct && (
                <Button size="lg" variant="outline" onClick={() => navigate(`/izdelek/${heroProduct.slug}`)}>
                  Najbolj prodajan izdelek
                </Button>
              )}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-brand-mint" /> Brez vonja in izpiranja
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-brand-mint" /> 100 % biorazgradljivo
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-brand-mint" /> Primerno za nosečnice
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {heroProduct ? (
              <HeroArt product={heroProduct} onAdd={() => add(heroProduct._id)} />
            ) : (
              <div className="flex h-80 w-full max-w-md items-center justify-center rounded-2xl bg-secondary">
                <span className="text-sm text-muted-foreground">Nalaganje izdelkov…</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="border-y bg-card">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Dokazano učinkovito",
              text: "Do 99,9 % manj bakterij na površinah ob redni uporabi.",
            },
            {
              icon: Leaf,
              title: "Okolju prijazno",
              text: "Po delovanju razpade na vodo in kisik — 100 % biorazgradljivo.",
            },
            {
              icon: Truck,
              title: "Hitra dostava",
              text: "Po vsej Sloveniji; brezplačno nad 50 €.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-teal-soft">
                <item.icon className="size-5 text-brand-teal" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CATEGORIES ============ */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">Kategorije izdelkov</h2>
            <p className="mt-2 text-muted-foreground">
              Sredstvo proti glivicam na nohtih, razkužilo za površine, razkužilo
              za igrače in sredstvo za odstranjevanje plesni — za vsak izziv
              higene prava rešitev.
            </p>
          </div>
          <Link to="/trgovina" className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-teal hover:underline sm:flex">
            Vsi izdelki <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/trgovina?kategorija=${category.slug}`}
              className="card-clinical group p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-brand-teal-soft text-lg font-bold text-brand-teal">
                {category.name.charAt(0)}
              </div>
              <h3 className="font-semibold">{category.name}</h3>
              <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
                {category.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-teal">
                Oglej si <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="bg-secondary/50 py-16">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold">Najbolj prodajani izdelki</h2>
              <p className="mt-2 text-muted-foreground">
                Izbrana razkužila in sredstva za nego, ki jih kupci najraje
                priporočajo naprej.
              </p>
            </div>
            <Link to="/trgovina" className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-teal hover:underline sm:flex">
              Celoten katalog <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ B2B CTA ============ */}
      <section className="container-page py-16">
        <div className="relative overflow-hidden rounded-2xl bg-brand-teal-deep px-6 py-12 text-center sm:px-12">
          <div className="bg-blob-coral absolute -right-20 -top-20 size-64 rounded-full" aria-hidden />
          <div className="bg-blob-mint absolute -bottom-24 -left-16 size-72 rounded-full" aria-hidden />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance font-display text-3xl font-bold text-white">
              Potrebujete zaloge za vaše podjetje?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-teal-100">
              Razkužilo za površine po količini za ordinacije, salone, čistilne
              službe in druge poslovne uporabnike. Ustvarite račun in izkoristite
              enostavno naročanje ter pregled nad vsemi naročili.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" className="gap-2" onClick={() => navigate("/prijava")}>
                Ustvari poslovni račun
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                onClick={() => navigate("/trgovina")}
              >
                Poglej katalog
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
