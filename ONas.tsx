import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplets, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Vodikov peroksid + srebro",
    text: "Aktivna formula temelji na vodikovem peroksidu in srebrovih ionih, ki delujejo proti glivicam, bakterijam in plesni — brez klorovih vonjav.",
  },
  {
    icon: Leaf,
    title: "Profesionalna kakovost",
    text: "Iste formulacije uporabljajo v kozmetičnih salonih, zdravstvu in vzgojnih ustanovah. Primerno tudi za domačo uporabo.",
  },
  {
    icon: Sparkles,
    title: "Brez vonja in madežev",
    text: "Razkužila ne puščajo madežev in so brez močnega vonja — varno za igrače, tekstil, keramiko in občutljive površine.",
  },
  {
    icon: Droplets,
    title: "Majhna poraba, dolga obstojnost",
    text: "Eno pakiranje zadošča za večmesečno redno uporabo. Na voljo so tudi polnilne doze za ponovno polnjenje.",
  },
];

export default function ONas() {
  return (
    <main className="container-page py-10">
      <header className="mb-10 max-w-3xl">
        <Badge className="mb-4 bg-brand-teal text-white">O Powersept</Badge>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Profesionalna dezinfekcija, ustvarjena za vsak dom
        </h1>
        <p className="mt-4 text-muted-foreground">
          Powersept je slovenska znamka higienskih izdelkov, razvitih za zahtevne profesionalce in prenesenih v
          vsakdanjo rabo. Naša formula združuje vodikov peroksid in srebrove ione — učinkovito, varno in brez
          neprijetnih vonjav.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {PILLARS.map((pillar) => (
          <section key={pillar.title} className="card-clinical p-6">
            <div className="flex size-11 items-center justify-center rounded-xl bg-brand-teal-soft">
              <pillar.icon className="size-5 text-brand-teal" />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold">{pillar.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.text}</p>
          </section>
        ))}
      </div>

      <section className="card-clinical mt-8 p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold">Zakaj zaupajo Powersept</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="font-display text-3xl font-bold text-brand-teal">4</p>
            <p className="mt-1 text-sm text-muted-foreground">
              specializirane linije: proti glivicam, dezinfekcija površin, otroške površine in odstranjevanje plesni
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-brand-teal">7</p>
            <p className="mt-1 text-sm text-muted-foreground">
              izdelkov v trgovini — od 200 ml škropilnic do 1 l profesionalnega pakiranja
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-brand-teal">B2B</p>
            <p className="mt-1 text-sm text-muted-foreground">
              sodelovanje saloni, zdravstvu in vzgojnim ustanovam z ugodnimi pogoji
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/trgovina">Oglejte si izdelke</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/kontakt">Stopite v stik</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
