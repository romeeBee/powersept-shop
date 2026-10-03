import { InfoPage, InfoSection } from "@/components/shop/InfoPage";
import { SHIPPING_FREE_THRESHOLD, SHIPPING_STANDARD, formatPrice } from "@/lib/shop";
import { Truck } from "lucide-react";

export default function Dostava() {
  return (
    <InfoPage
      title="Dostava in vračila"
      lead="Pošiljke oddajamo prek kurirske službe GLS — dostava po Sloveniji v 1–2 delovnih dneh, s sledenjem v realnem času."
    >
      <InfoSection heading="Dostava prek GLS">
        <p>
          Vsako naročilo oddamo v dostavo prek <strong className="text-foreground">GLS</strong>. Ko je pošiljka
          predana kurirju, v razdelku <strong className="text-foreground">Moja naročila</strong> prejmete številko
          pošiljke in povezavo za spletno sledenje.
        </p>
        <ul>
          <li>Dostava po Sloveniji: 1–2 delovna dneva od oddaje</li>
          <li>Obvestilo o dostavi po e-pošti in SMS-u s strani GLS</li>
          <li>Možnost prestavitve dostave ali prevzema na GLS točki</li>
        </ul>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-brand-teal-soft/60 p-4 text-foreground">
          <Truck className="size-5 shrink-0 text-brand-teal" />
          <span className="text-sm">
            Standardna dostava {formatPrice(SHIPPING_STANDARD)} — pri naročilih nad {formatPrice(SHIPPING_FREE_THRESHOLD)}{" "}
            <strong>brezplačna</strong>.
          </span>
        </div>
      </InfoSection>

      <InfoSection heading="Cenik dostave">
        <ul>
          <li>Dostava na naslov (GLS): {formatPrice(SHIPPING_STANDARD)}</li>
          <li>Naročila od {formatPrice(SHIPPING_FREE_THRESHOLD)} naprej: brezplačna dostava</li>
          <li>Dostava izven Slovenije: po dogovoru (kontaktirajte nas)</li>
        </ul>
      </InfoSection>

      <InfoSection heading="Vračila in odstop od pogodbe">
        <p>
          Imate pravico do odstopa od pogodbe v 14 dneh od prejema brez navedbe razloga (ZVPot-1). Izdelek mora biti
          nepoškodovan in v originalni embalaži.
        </p>
        <ul>
          <li>O nameri vračila nas obvestite na info@powersept.com</li>
          <li>Pošiljko vračajte na: Powersept d.o.o., Cesta na Brdo 1, 1000 Ljubljana</li>
          <li>Povračilo izvedemo v 14 dneh po prejemu vračila</li>
          <li>Poškodovani ali odprti izdelki zaradi narave higienskega proizvoda niso sprejeti</li>
        </ul>
      </InfoSection>

      <InfoSection heading="Reklamacije">
        <p>
          Če je izdelek poškodovan ali neustrezen, nam pišite na info@powersept.com s fotografijo in številko
          naročila. Reklamacijo obravnavamo v 8 dneh in ponudimo zamenjavo ali vračilo kupnine.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
