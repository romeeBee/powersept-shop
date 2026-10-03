import { powerseptLogo } from "@/components/shop/brand";
import { useCategories } from "@/hooks/use-shop";
import { Link } from "react-router";

export function Footer() {
  const categories = useCategories();

  return (
    <footer className="border-t bg-card">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="space-y-3">
          <img src={powerseptLogo} alt="Powersept" className="h-9 w-auto" />
          <p className="max-w-xs text-sm text-muted-foreground">
            Profesionalna dezinfekcija in nega — izdelki proti glivicam, plesni
            ter nezaželenim mikroorganizmom v gospodinjstvih in poslovnih prostorih.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Kategorije</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category._id}>
                <Link
                  to={`/trgovina?kategorija=${category.slug}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Trgovina</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/trgovina" className="transition-colors hover:text-foreground">
                Vsi izdelki
              </Link>
            </li>
            <li>
              <Link to="/seznam-zelja" className="transition-colors hover:text-foreground">
                Seznam želja
              </Link>
            </li>
            <li>
              <Link to="/narocila" className="transition-colors hover:text-foreground">
                Moja naročila
              </Link>
            </li>
            <li>
              <Link to="/prijava" className="transition-colors hover:text-foreground">
                Prijava / Registracija
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Informacije</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/dostava" className="transition-colors hover:text-foreground">
                Dostava in vračila
              </Link>
            </li>
            <li>
              <Link to="/placila" className="transition-colors hover:text-foreground">
                Načini plačila
              </Link>
            </li>
            <li>
              <Link to="/pogoji" className="transition-colors hover:text-foreground">
                Pogoji poslovanja
              </Link>
            </li>
            <li>
              <Link to="/zasebnost" className="transition-colors hover:text-foreground">
                Politika zasebnosti
              </Link>
            </li>
            <li>
              <Link to="/kontakt" className="transition-colors hover:text-foreground">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t py-4">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Powersept. Vse pravice pridržane. Cene vključujejo DDV.</span>
          <Link to="/o-nas" className="transition-colors hover:text-foreground">
            O nas
          </Link>
          <Link to="/pogoji" className="transition-colors hover:text-foreground">
            Pogoji
          </Link>
          <Link to="/zasebnost" className="transition-colors hover:text-foreground">
            Zasebnost
          </Link>
        </div>
      </div>
    </footer>
  );
}
