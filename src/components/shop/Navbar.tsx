import { powerseptLogo } from "@/components/shop/brand";
import { CartSheet } from "@/components/shop/CartSheet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useCart, useCategories, useWishlist } from "@/hooks/use-shop";
import { useSearchCatalog } from "@/hooks/use-search";
import { formatPrice } from "@/lib/shop";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Heart, Search, ShoppingCart, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";

export function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const { itemCount } = useCart();
  const { productIds: wishlistIds } = useWishlist();
  const categories = useCategories();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const search = useSearchCatalog();

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = query.trim() === "" ? [] : search(query).products.slice(0, 6);
  const topCategories = categories.slice(0, 4);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex shrink-0 items-center">
          <img src={powerseptLogo} alt="Powersept" className="h-9 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink
            to="/trgovina"
            className={({ isActive }) =>
              cn(
                "rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                isActive && "bg-secondary text-foreground",
              )
            }
          >
            Trgovina
          </NavLink>
          {topCategories.map((category) => (
            <Link
              key={category._id}
              to={`/trgovina?kategorija=${category.slug}`}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="mr-1 hidden gap-2 text-muted-foreground sm:flex"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="size-4" />
            <span className="hidden md:inline">Išči…</span>
            <kbd className="pointer-events-none hidden rounded border bg-muted px-1.5 font-mono text-[10px] md:inline">
              ⌘K
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label={wishlistIds.length > 0 ? `Seznam želja, ${wishlistIds.length}` : "Seznam želja"}
            className="relative hidden sm:inline-flex"
            onClick={() => navigate(isAuthenticated ? "/seznam-zelja" : "/prijava?returnTo=%2Fseznam-zelja")}
          >
            <Heart className="size-5" />
            {wishlistIds.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-coral px-1 text-[11px] font-bold tabular-nums text-white ring-2 ring-card">
                {wishlistIds.length > 9 ? "9+" : wishlistIds.length}
              </span>
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Račun"
            className="hidden sm:inline-flex"
            onClick={() =>
              navigate(
                isAuthenticated ? (user?.isAnonymous === true ? "/prijava" : "/narocila") : "/prijava",
              )
            }
          >
            <User className="size-5" />
          </Button>

          <CartTrigger itemCount={itemCount} />
        </div>
      </div>

      {/* Mobile category row */}
      <div className="border-t border-border/60 lg:hidden">
        <div className="container-page flex items-center gap-1 overflow-x-auto py-2">
          <Link
            to="/trgovina"
            className="shrink-0 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"
          >
            Vse
          </Link>
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/trgovina?kategorija=${category.slug}`}
              className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-20 translate-y-0 p-0 sm:top-24">
          <DialogHeader className="sr-only">
            <DialogTitle>Iskanje izdelkov</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 border-b px-4 py-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Iščite izdelke, npr. „proti glivicam“"
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {query.trim() === "" ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Začnite tipkati za iskanje po katalogu.
              </p>
            ) : results.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Ni zadetkov za „{query}“.
              </p>
            ) : (
              results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                    navigate(`/izdelek/${product.slug}`);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{product.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {product.shortDescription}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-primary">
                    {formatPrice(product.price)}
                  </span>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

function CartTrigger({ itemCount }: { itemCount: number }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const previous = useRef(itemCount);
  const [bump, setBump] = useState(0);

  // Replay the pop animation whenever the count changes.
  useEffect(() => {
    if (itemCount !== previous.current) {
      previous.current = itemCount;
      setBump((value) => value + 1);
    }
  }, [itemCount]);

  return (
    <>
      <Button
        size="icon"
        className="relative rounded-full bg-brand-teal text-white shadow-sm transition-colors hover:bg-brand-teal-deep hover:text-white"
        aria-label={itemCount > 0 ? `Košarica, ${itemCount} izdelkov` : "Košarica"}
        onClick={() => setOpen(true)}
      >
        <motion.span
          key={`icon-${bump}`}
          initial={bump > 0 ? { scale: 1.4, rotate: -12 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 14 }}
          className="flex"
        >
          <ShoppingCart className="size-5" />
        </motion.span>
        {itemCount > 0 && (
          <motion.span
            key={`badge-${bump}`}
            initial={{ scale: 0.2, opacity: 0, y: -8 }}
            animate={{
              scale: [1.55, 0.85, 1.1, 1],
              opacity: 1,
              y: 0,
              rotate: [0, -14, 10, 0],
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute -right-2.5 -top-2.5 flex h-7 min-w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-coral to-brand-coral-strong px-1.5 text-sm font-extrabold tabular-nums text-white shadow-lg ring-[3px] ring-card"
          >
            {itemCount > 9 ? "9+" : itemCount}
          </motion.span>
        )}
      </Button>
      <CartSheet open={open} onOpenChange={setOpen} onGoToCart={() => navigate("/kosarica")} />
    </>
  );
}
