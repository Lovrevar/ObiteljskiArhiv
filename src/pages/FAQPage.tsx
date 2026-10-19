import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PageIntro } from "@/components/PageIntro";
import { cn } from "@/lib/utils";

const faqData = [
  { q: 'Mogu li odmah naručiti knjigu?', a: 'Da! Knjige su stigle i spremne su za prodaju. Odaberite knjigu ili složite obiteljsku kolekciju, dodajte je u košaricu i dovršite kupnju. Informacije o obradi narudžbi i dostavi nalaze se na stranici Pravila, a trošak dostave prikazuje se pri plaćanju.' },
  { q: 'Što je obiteljski arhiv?', a: 'To je kolekcija knjiga u kojoj svaki član obitelji dokumentira svoj život. Zajedno tvore kompletnu obiteljsku povijest. Privatnu knjižnicu za buduće generacije.' },
  { q: 'Mogu li kupiti više knjiga za cijelu obitelj?', a: 'Apsolutno. To je cijela ideja, svaki član obitelji dobiva svoju knjigu, a zajedno gradite obiteljsku knjižnicu.' },
  { q: 'Po čemu se razlikujete od drugih?', a: 'Drugi prodaju jednu knjigu kao poklon. Mi prodajemo ideju kolekcije, dokumentiranja života cijele obitelji, poput privatnog obiteljskog arhiva koji traje generacijama.' },
  { q: 'Za koga je ova knjiga?', a: 'Za svakog člana obitelji čija priča zaslužuje biti sačuvana : roditelje, bake, djedove, tete, ujake, braću, sestre.' },
  { q: 'Piše li osoba rukom?', a: 'Da. Knjiga je osmišljena za ručno ispunjavanje, čineći je još osobnijom i autentičnijom.' },
  { q: 'Je li teško ispuniti?', a: 'Nimalo. Knjiga koristi pažljiva pitanja koja olakšavaju razmišljanje i prirodno pisanje, čak i osobama koje inače ne pišu mnogo.' },
  { q: 'Sadrži li prostor za fotografije?', a: 'Da. Knjiga uključuje posebne stranice za fotografije na kraju.' },
  { q: 'Kako graditi obiteljski arhiv?', a: 'Započnite s jednom knjigom za jednog člana obitelji. Kad ju ispuni, kupite sljedeću za drugog člana. S vremenom ćete imati kompletnu obiteljsku knjižnicu.' },
  { q: 'Koliko vremena treba za ispunjavanje?', a: 'Nema fiksnog tempa. Neki ljudi je ispunjavaju postupno kroz tjedne ili mjesece, što često čini iskustvo još značajnijim.' },
  { q: 'Je li ovo i dobar poklon?', a: 'Da. Ali više od poklona: ovo je početak nečega trajnog. Darujete nekome priliku da dokumentira svoj život za buduće generacije.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = faqData.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main>
      <SEO
        title="Česta pitanja: Sve o Obiteljskom Arhivu | Knjiga uspomena"
        description="Odgovori na najčešća pitanja o knjizi uspomena, ispunjavanju, dostavi i izgradnji obiteljskog arhiva. Sve što trebate znati prije narudžbe."
        path="/faq"
        keywords="česta pitanja, knjiga uspomena, obiteljski arhiv, kako ispuniti, poklon za obitelj"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqData.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />

      <PageIntro
        eyebrow="PITANJA"
        title="Česta pitanja"
        lead="Sve što trebate znati o obiteljskom arhivu i našoj kolekciji knjiga."
        aside={
          <label className="block">
            <span className="field-label">Pretražite pitanja</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" strokeWidth={1.5} />
              <input
                type="search"
                placeholder="npr. fotografije, poklon…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="field pl-7"
              />
            </span>
          </label>
        }
      />

      <section className="pb-24 lg:pb-32">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="border-t border-ink/70">
              {filtered.map((faq) => {
                const index = faqData.indexOf(faq);
                const isOpen = openIndex === index;
                return (
                  <div key={faq.q} className="border-b border-hairline">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${index}`}
                      className="flex w-full items-center justify-between gap-6 py-6 text-left font-serif text-[21px] leading-snug text-ink transition-colors hover:text-burgundy sm:text-[23px]"
                    >
                      {faq.q}
                      <Plus
                        className={cn("h-4 w-4 shrink-0 text-ink-soft transition-transform duration-300", isOpen && "rotate-45")}
                        strokeWidth={1.5}
                      />
                    </button>
                    {isOpen && (
                      <p id={`faq-${index}`} className="enter -mt-1 max-w-2xl pb-7 font-sans text-[16px] leading-[1.75] text-ink-soft">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="py-10 font-sans text-[15px] text-ink-soft">Nema odgovarajućih pitanja.</p>
              )}
            </div>
          </div>

          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="border-t border-ink/70 pt-6 lg:sticky lg:top-28">
              <p className="font-serif text-[22px] leading-snug text-ink">Niste pronašli odgovor?</p>
              <p className="mt-3 font-sans text-[14px] leading-relaxed text-ink-soft">
                Rado ćemo čuti od vas. Obično odgovaramo unutar 24 do 48 sati.
              </p>
              <Link to="/contact" className="link-arrow mt-5">
                Javite nam se
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
