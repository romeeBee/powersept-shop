import { InfoPage, InfoSection } from "@/components/shop/InfoPage";
import { SHIPPING_FREE_THRESHOLD, SHIPPING_STANDARD, formatPrice } from "@/lib/shop";
import { CreditCard, Landmark, ShieldCheck } from "lucide-react";

export default function Placila() {
  return (
    <InfoPage
      title="Načini plačila"
      lead="Varno plačevanje s kartico ali klasično nakazilo po UPN — cene so vedno vključno z DDV."
    >
      <InfoSection heading="Plačilo s kartico">
        <div className="mb-3 flex items-center gap-3 text-foreground">
          <CreditCard className="size-5 text-brand-teal" />
          <span className="font-semibold">Visa, Mastercard, Maestro</span>
        </div>
        <p>
          Plačilo se ob oddaji naročila samodejno potrdi, naročilo pa takoj prejme status „Plačano“ in gre v
          pripravo. Kartični podatki se ne shranjujejo na naših strežnikih — obdelavo vodi ponudnik plačilnega
          prometa.
        </p>
        <p className="flex items-center gap-2 text-foreground">
          <ShieldCheck className="size-4 text-brand-mint" /> Povezava je zaščitena s SSL/TLS.
        </p>
      </InfoSection>

      <InfoSection heading="UPN po e-bančništvu">
        <div className="mb-3 flex items-center gap-3 text-foreground">
          <Landmark className="size-5 text-brand-teal" />
          <span className="font-semibold">Prosta izbira (UPN)</span>
        </div>
        <p>
          Po oddaji naročila prejmete e-pošto z vsemi podatki za plačilo: znesek, referenco in namen nakazila.
          Naročilo s statusom „Čaka na plačilo“ pošljemo takoj, ko plačilo prispe na naš račun (običajno 1–2
          delovna dneva).
        </p>
        <ul>
          <li>Prepis nakazila opravite v svoji banki (spletno/mobilno bančništvo)</li>
          <li>Sklic: referenca, ki je napisana na potrdilu o naročilu</li>
          <li>Blago rezerviramo 5 delovnih dni od oddaje naročila</li>
        </ul>
      </InfoSection>

      <InfoSection heading="Cene in DDV">
        <p>
          Vse cene v trgovini so v evrih (EUR) in vključujejo 25 % DDV. Storitev dostave se prišteje vrednosti
          košarice: {formatPrice(SHIPPING_STANDARD)}, pri naročilih nad {formatPrice(SHIPPING_FREE_THRESHOLD)} je brezplačna.
        </p>
      </InfoSection>

      <InfoSection heading="Račun za podjetja (B2B)">
        <p>
          Za podjetja in javni sektor izstavimo račun z DDV — ob oddaji naročila vpišite naziv podjetja in davčno
          številko v opombo. Račun prejmete po e-pošti skupaj s potrdilom o naročilu.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
