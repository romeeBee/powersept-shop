import { InfoPage, InfoSection } from "@/components/shop/InfoPage";

export default function Zasebnost() {
  return (
    <InfoPage
      title="Politika zasebnosti"
      lead="Kako obdelujemo vaše osebne podatke v skladu z Uredbo (EU) 2016/679 (GDPR)."
    >
      <InfoSection heading="Upravljavec">
        <p>
          Powersept d.o.o., Cesta na Brdo 1, 1000 Ljubljana. Za vprašanja o varstvu podatkov pišite na
          info@powersept.com.
        </p>
      </InfoSection>

      <InfoSection heading="Katere podatke zbiramo">
        <ul>
          <li>Ime, priimek, e-poštni naslov in telefonsko številko (ob prijavi/naročilu)</li>
          <li>Naslov za dostavo in podatke o podjetju, če jih vpišete</li>
          <li>Podatke o naročilih in plačilih (zneski, statusi, številka pošiljke GLS)</li>
          <li>Seznam želja in vsebino košarice, povezano z vašim računom</li>
          <li>Podatke o prijavi (čas, naprava) za varovanje računa</li>
        </ul>
      </InfoSection>

      <InfoSection heading="Namen obdelave in pravna podlaga">
        <ul>
          <li>Izvedba pogodbe — obdelava naročila, dostave in plačil (člen 6(1)(b) GDPR)</li>
          <li>Zakonske obveznosti — računovodstvo in davčna evidenca (člen 6(1)(c))</li>
          <li>Naš zakoniti interes — varovanje računa, prevara in izboljšava storitve (člen 6(1)(f))</li>
          <li>Soglasje — obvestila o novostih (če ste jih prijavili; odjava je mogoča kadarkoli)</li>
        </ul>
      </InfoSection>

      <InfoSection heading="Hramba in prejemniki">
        <p>
          Podatke o naročilih hranimo 10 let (zakonski rok), podatke računa do izbrisa. Dostop imajo le
          pooblasčeni sodelavci in pogodbeni izvajalci (GLS za dostavo, ponudnik plačil, ponudnik gostovanja),
          vezani na pogodbeno zaupnost.
        </p>
      </InfoSection>

      <InfoSection heading="Vaše pravice">
        <ul>
          <li>Dostop, popravek, izbris („pravica do pozabe“)</li>
          <li>Omejitev obdelave in ugovor</li>
          <li>Prenosnost podatkov in preklic soglasja</li>
          <li>Pritožba pri Informacijskem pooblaščencu RS</li>
        </ul>
        <p>Za uveljavljanje pravice pišite na info@powersept.com; odgovorimo v 30 dneh.</p>
      </InfoSection>
    </InfoPage>
  );
}
