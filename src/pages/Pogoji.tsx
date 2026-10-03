import { InfoPage, InfoSection } from "@/components/shop/InfoPage";
import { Link } from "react-router";

export default function Pogoji() {
  return (
    <InfoPage
      title="Pogoji poslovanja"
      lead="Splošni pogoji spletnega trgovine Powersept (powersept.com) — veljajo od dne objave."
    >
      <InfoSection heading="1. Splošno">
        <p>
          Ti pogoji urejajo nakup v spletni trgovini Powersept. Kupec potrdi, da je bil z njimi seznanjen ob oddaji
          naročila. Prodajalec je Powersept d.o.o., Cesta na Brdo 1, 1000 Ljubljana.
        </p>
      </InfoSection>

      <InfoSection heading="2. Postopek nakupa">
        <ul>
          <li>Izberete izdelek in ga dodate v košarico</li>
          <li>Vnesete kontaktne podatke in naslov dostave</li>
          <li>Izberete način plačila (kartica ali UPN)</li>
          <li>Potrdite naročilo — prejmete e-poštno potrdilo s številko naročila</li>
        </ul>
        <p>Kupoprodajna pogodba je sklenjena, ko kupec prejme potrdilo o sprejemu naročila.</p>
      </InfoSection>

      <InfoSection heading="3. Cene in plačilo">
        <p>
          Vse cene so v EUR in vključujejo DDV. Strošek dostave je prikazan v košarici in na blagajni. Naročilo
          je zavezujoče za prodajalca, ko kupec prejme potrdilo.
        </p>
      </InfoSection>

      <InfoSection heading="4. Dostava">
        <p>
          Pošiljke oddajamo prek GLS v 1–2 delovnih dneh. O morebitnih zamemah obvestimo kupca po e-pošti. Za
          podrobnosti glejte stran <Link className="text-foreground underline" to="/dostava">Dostava in vračila</Link>.
        </p>
      </InfoSection>

      <InfoSection heading="5. Odstop od pogodbe in vračila">
        <p>
          Kupec lahko v 14 dneh od prejema odstopi od pogodbe brez navedbe razloga (ZVPot). Vrnjeni izdelek mora
          biti nepoškodovan, v originalni embalaži in nepoškodovanem pečatnem zapiralu. Podrobnosti na strani{" "}
          <Link className="text-foreground underline" to="/dostava">Dostava in vračila</Link>.
        </p>
      </InfoSection>

      <InfoSection heading="6. Reklamacije in jamstvo">
        <p>
          Za izdelke velja zakonsko jamstvo za skladnost blaga (2 leti). Reklamacijo sprejemo na
          info@powersept.com in jo obravnavamo v 8 dneh.
        </p>
      </InfoSection>

      <InfoSection heading="7. Varstvo podatkov">
        <p>
          Osebne podatke obdelujemo skladno z GDPR — več na strani{" "}
          <Link className="text-foreground underline" to="/zasebnost">Politika zasebnosti</Link>.
        </p>
      </InfoSection>

      <InfoSection heading="8. Pritožbe in spori">
        <p>
          Pritožbe pošljite na info@powersept.com. Pridržujemo si pravico do sprememb teh pogojev. Za reševanje
          potrošniških sporov je pristojno Gospodarsko sodišče v Ljubljani.
        </p>
      </InfoSection>
    </InfoPage>
  );
}
