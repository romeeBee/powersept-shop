import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SearchCommand } from "./SearchCommand";
import { Wordmark } from "./Wordmark";
import { useContent } from "@/content/store";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

function todayLabel() {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export function Header() {
  const { categories, site } = useContent();
  const { dark, toggle } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 120);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const links = [
    ...categories.map((category) => ({ to: `/topic/${category.slug}`, label: category.name })),
    { to: "/writers", label: "Writers" },
    { to: "/about", label: "About" },
  ];

  return (
    <header>
      <div className="container-page">
        <div className="relative flex items-center justify-between py-6 sm:py-8">
          <span className="kicker hidden text-muted-foreground lg:block">{todayLabel()}</span>

          <Link
            to="/"
            aria-label={`${site.name} home`}
            className="lg:absolute lg:left-1/2 lg:-translate-x-1/2"
          >
            <Wordmark className="text-[2.1rem] sm:text-[2.6rem]" />
          </Link>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Search className="size-[1.05rem]" />
            </button>
            <button
              type="button"
              onClick={toggle}
              aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {dark ? <Sun className="size-[1.05rem]" /> : <Moon className="size-[1.05rem]" />}
            </button>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Menu"
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
                >
                  <Menu className="size-[1.15rem]" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[19rem] p-0">
                <SheetTitle className="sr-only">Sections</SheetTitle>
                <div className="px-6 pt-8">
                  <Wordmark className="text-3xl" />
                </div>
                <nav className="mt-8 flex flex-col">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "headline border-t border-rule px-6 py-4 text-2xl transition-colors",
                          isActive ? "text-signal" : "hover:text-signal",
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "sticky top-0 z-40 border-y border-rule bg-background/80 backdrop-blur-md transition-shadow",
          scrolled && "shadow-[0_1px_0_0_var(--rule)]",
        )}
      >
        <div className="container-page flex h-12 items-center gap-6">
          <Link
            to="/"
            aria-hidden={!scrolled}
            tabIndex={scrolled ? 0 : -1}
            className={cn(
              "hidden shrink-0 overflow-hidden transition-all duration-300 lg:block",
              scrolled ? "w-[6.5rem] opacity-100" : "w-0 opacity-0",
            )}
          >
            <Wordmark className="text-xl" />
          </Link>
          <nav className="no-scrollbar -mx-1 flex flex-1 items-center gap-5 overflow-x-auto">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "kicker shrink-0 whitespace-nowrap px-1 py-3 transition-colors",
                    isActive ? "text-signal" : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden shrink-0 items-center gap-2 rounded-full border border-rule px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground lg:flex"
          >
            <Search className="size-3.5" />
            Search
            <kbd className="font-mono text-[0.6875rem] text-muted-foreground/70">⌘K</kbd>
          </button>
        </div>
      </div>

      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
