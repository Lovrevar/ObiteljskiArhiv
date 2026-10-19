import { SEO } from "@/components/SEO";
import { PageIntro } from "@/components/PageIntro";

const policies = [
  {
    title: "Podaci o trgovcu",
    content: (
      <>
        <p className="mb-4">
          <strong>Naziv društva:</strong> PANNONIA GROUP d.o.o.
          <br />
          <strong>OIB:</strong> 90422856156
          <br />
          <strong>Sjedište:</strong> Josipa Jurja Strossmayera 341, 31000 Osijek, Hrvatska
        </p>
        <p>
          Za sva pitanja vezana uz narudžbe, proizvode ili ostvarivanje prava kupaca možete nas kontaktirati putem kontakt podataka objavljenih na ovoj web stranici.
        </p>
      </>
    ),
  },
  {
    title: "Pravila dostave",
    content: (
      <>
        <p className="mb-4">
          Narudžbe obrađujemo u najkraćem mogućem roku nakon zaprimanja potvrde o plaćanju.
        </p>
        <p className="mb-4">
          Standardno vrijeme obrade narudžbe iznosi 1 do 3 radna dana, dok se isporuka unutar Republike Hrvatske u pravilu izvršava u roku od 2 do 5 radnih dana, ovisno o odabranoj dostavnoj službi.
        </p>
        <p className="mb-4">
          Za narudžbe izvan Republike Hrvatske vrijeme isporuke može biti dulje, ovisno o zemlji odredišta i dostavnoj službi.
        </p>
        <p>
          Kupac je odgovoran za točnost podataka o adresi dostave. PANNONIA GROUP d.o.o. ne odgovara za kašnjenja ili nemogućnost isporuke uzrokovanu netočnim ili nepotpunim podacima koje je unio kupac.
        </p>
      </>
    ),
  },
  {
    title: "Pravila povrata",
    content: (
      <>
        <p className="mb-4">
          Kupac ima pravo jednostrano raskinuti ugovor u roku od 14 dana od dana primitka proizvoda, bez navođenja razloga, sukladno važećim propisima Republike Hrvatske.
        </p>
        <p className="mb-4">Kako bi ostvario pravo na povrat, proizvod mora biti:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground">
          <li>nekorišten,</li>
          <li>neoštećen,</li>
          <li>vraćen u izvornom stanju,</li>
          <li>vraćen sa svom pripadajućom opremom i ambalažom, ako je primjenjivo.</li>
        </ul>
        <p className="mb-4">
          Trošak povrata proizvoda snosi kupac, osim ako je proizvod isporučen oštećen ili pogrešan.
        </p>
        <p className="mb-4">
          Povrat uplaćenog iznosa izvršit će se najkasnije u roku od 14 dana od dana zaprimanja vraćenog proizvoda ili dokaza da je proizvod poslan natrag.
        </p>
        <p>
          Ako je proizvod izrađen prema posebnim zahtjevima kupca ili personaliziran, pravo na povrat ne primjenjuje se osim u slučaju materijalnog nedostatka ili pogreške u izradi.
        </p>
      </>
    ),
  },
  {
    title: "Pravila privatnosti",
    content: (
      <>
        <p className="mb-4">Vaša privatnost nam je važna.</p>
        <p className="mb-4">Prikupljamo isključivo osobne podatke koji su nužni za:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground">
          <li>obradu narudžbe,</li>
          <li>isporuku proizvoda,</li>
          <li>izdavanje računa,</li>
          <li>komunikaciju s kupcima,</li>
          <li>ispunjavanje zakonskih obveza.</li>
        </ul>
        <p className="mb-4">
          Prikupljeni podaci neće biti prodani niti ustupljeni trećim stranama, osim kada je to potrebno radi izvršenja narudžbe (primjerice dostavnoj službi ili pružatelju usluge online plaćanja).
        </p>
        <p className="mb-4">Kupac ima pravo zatražiti:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground">
          <li>pristup svojim osobnim podacima,</li>
          <li>ispravak netočnih podataka,</li>
          <li>brisanje podataka kada za to postoje zakonski uvjeti,</li>
          <li>ograničenje obrade podataka,</li>
          <li>prenosivost podataka.</li>
        </ul>
        <p>
          Obrada osobnih podataka provodi se u skladu s Općom uredbom o zaštiti podataka (GDPR).
        </p>
      </>
    ),
  },
  {
    title: "Uvjeti korištenja",
    content: (
      <>
        <p className="mb-4">
          Korištenjem ove web stranice prihvaćate ove uvjete korištenja.
        </p>
        <p className="mb-4">
          Sav sadržaj objavljen na stranici, uključujući tekstove, fotografije, grafike, ilustracije, dizajn, logotipe i ostali sadržaj, vlasništvo je društva PANNONIA GROUP d.o.o. ili se koristi uz odgovarajuća prava.
        </p>
        <p className="mb-4">
          Zabranjeno je kopiranje, distribucija ili korištenje sadržaja bez prethodnog pisanog odobrenja.
        </p>
        <p className="mb-4">
          Zadržavamo pravo izmjene sadržaja web stranice, cijena proizvoda, ponude te ovih uvjeta korištenja u bilo kojem trenutku bez prethodne najave.
        </p>
        <p>
          Kupac je odgovoran za točnost svih podataka unesenih prilikom narudžbe.
        </p>
      </>
    ),
  },
  {
    title: "Politika kolačića",
    content: (
      <>
        <p className="mb-4">
          Ova web stranica koristi kolačiće (cookies) kako bi omogućila ispravno funkcioniranje stranice, poboljšala korisničko iskustvo i analizirala korištenje web stranice.
        </p>
        <p className="mb-4">Koristimo sljedeće vrste kolačića:</p>
        <div className="mb-4">
          <p className="font-medium text-foreground mb-1">Nužni kolačići</p>
          <p className="text-muted-foreground">
            Neophodni su za osnovne funkcionalnosti web stranice, uključujući navigaciju, sigurnost i proces kupnje.
          </p>
        </div>
        <div className="mb-4">
          <p className="font-medium text-foreground mb-1">Analitički kolačići</p>
          <p className="text-muted-foreground">
            Koriste se za anonimno prikupljanje statističkih podataka o korištenju web stranice kako bismo mogli poboljšavati sadržaj i korisničko iskustvo.
          </p>
        </div>
        <div className="mb-4">
          <p className="font-medium text-foreground mb-1">Marketinški kolačići</p>
          <p className="text-muted-foreground">
            Ako koristimo alate poput Meta Pixela ili Google Analyticsa, određeni kolačići mogu se koristiti za mjerenje učinkovitosti marketinških kampanja i prikaz relevantnih oglasa.
          </p>
        </div>
        <p>
          Korisnik u svakom trenutku može promijeniti postavke kolačića putem postavki svojeg internetskog preglednika ili alata za upravljanje privolama na ovoj web stranici.
        </p>
      </>
    ),
  },
  {
    title: "Izjava o jednostranom raskidu ugovora",
    content: (
      <>
        <p className="mb-4">
          Kupac koji je potrošač ima pravo, bez navođenja razloga, jednostrano raskinuti ugovor sklopljen na daljinu u roku od 14 dana od dana kada je preuzeo proizvod.
        </p>
        <p className="mb-4">
          Za ostvarivanje prava na jednostrani raskid potrebno je prije isteka roka od 14 dana poslati nedvosmislenu izjavu putem e-maila ili drugog dostupnog kontaktnog kanala.
        </p>
        <p className="mb-4">Izjava treba sadržavati:</p>
        <ul className="list-disc list-inside mb-4 space-y-1 text-muted-foreground">
          <li>ime i prezime kupca,</li>
          <li>adresu,</li>
          <li>broj narudžbe,</li>
          <li>datum narudžbe,</li>
          <li>datum primitka proizvoda,</li>
          <li>izjavu da se ugovor jednostrano raskida.</li>
        </ul>
        <p className="mb-4">
          Kupac je dužan vratiti proizvod najkasnije u roku od 14 dana od dana slanja izjave o raskidu ugovora.
        </p>
        <p>
          Povrat sredstava izvršit će se istim načinom plaćanja kojim je izvršena kupnja, osim ako se kupac i trgovac drugačije ne dogovore.
        </p>
      </>
    ),
  },
];

export default function PoliciesPage() {
  const anchor = (index: number) => `pravilo-${index + 1}`;

  return (
    <>
      <SEO
        title="Pravila: Dostava, povrat, privatnost | Obiteljski Arhiv"
        description="Pravila dostave, povrata, privatnosti i uvjeti korištenja Obiteljskog Arhiva."
        path="/policies"
        noindex
      />
      <main>
        <PageIntro eyebrow="PRAVILA" title="Pravila" />

        <section className="pb-24 lg:pb-32">
          <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
            <nav aria-label="Sadržaj pravila" className="lg:col-span-3">
              <div className="border-t border-ink/70 pt-5 lg:sticky lg:top-28">
                <p className="font-serif text-[20px] italic text-ink">Sadržaj</p>
                <ol className="mt-3 space-y-2 font-sans text-[14px]">
                  {policies.map((policy, i) => (
                    <li key={policy.title}>
                      <a href={`#${anchor(i)}`} className="text-ink-soft transition-colors hover:text-burgundy">
                        {policy.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            <div className="lg:col-span-8 lg:col-start-5">
              {policies.map((policy, i) => (
                <article key={policy.title} id={anchor(i)} className="scroll-mt-28 border-t border-ink/70 py-10 first:pt-8">
                  <h2 className="h-sub">{policy.title}</h2>
                  <div className="mt-5 max-w-[42rem] font-sans text-[15px] leading-[1.8] text-ink-soft [&_strong]:font-medium [&_strong]:text-ink">
                    {policy.content}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
