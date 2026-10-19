import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SEO } from "@/components/SEO";
import { PageIntro } from "@/components/PageIntro";
import { ZoomablePicture } from "@/components/Lightbox";
import { FigureCaption } from "@/components/FigureCaption";
import { images, type LocalImage } from "@/lib/images";

const steps: { num: string; title: string; desc: string; image?: LocalImage; label?: string; caption?: string }[] = [
  {
    num: "01",
    title: "Započnite s jednom knjigom",
    desc: "Odaberite prvog člana obitelji čiju priču želite sačuvati - roditelja, baku, djeda ili drugu voljenu osobu.",
    image: images.coverRed,
    caption: "Moja priča, bordo izdanje",
  },
  {
    num: "02",
    title: "Poklonite s namjerom",
    desc: "Darujte za rođendan, blagdan, godišnjicu ili jednostavno jer vam je stalo da ta priča bude zapisana.",
    image: images.shelfHomeNavy,
    caption: "Plavo izdanje na kućnoj polici",
  },
  {
    num: "03",
    title: "Ispunite postupno",
    desc: "Primatelj odgovara na pažljiva pitanja svojim tempom, rukom, pretvarajući uspomene u osobnu priču.",
    image: images.brzaPitanja,
    caption: "Brza pitanja",
  },
  {
    num: "04",
    title: "Dodajte fotografije",
    desc: "Stranice za fotografije na kraju omogućuju da priča postane još opipljivija i potpunija.",
    image: images.fotografije,
    caption: "Fotografije i ostavština",
  },
  {
    num: "05",
    title: "Sačuvajte za generacije",
    desc: "Za 50 godina, vaši unuci će moći otvoriti tu knjižnicu i pročitati tko su bili ljudi koji su oblikovali vašu obitelj.",
    image: images.bakaIUnuka,
    label: "Poglavlje 3",
    caption: "Djetinjstvo koje te oblikovalo",
  },
];

const members = ["Mama", "Tata", "Baka", "Djed", "Teta", "Ujak", "Brat", "Sestra"];

export default function HowItWorksPage() {
  return (
    <main>
      <SEO
        title="Kako funkcionira: 5 koraka do vašeg obiteljskog arhiva | Obiteljski Arhiv"
        description="Od odabira knjige do izgradnje obiteljske knjižnice. Saznajte kako u 5 jednostavnih koraka započeti obiteljski arhiv koji će trajati generacijama."
        path="/how-it-works"
        keywords="kako funkcionira, knjiga uspomena, obiteljski arhiv, vođena pitanja, poklon za obitelj, personalizirana knjiga"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "Kako izgraditi obiteljski arhiv",
          step: steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.desc,
          })),
        }}
      />

      <PageIntro
        eyebrow="KAKO FUNKCIONIRA"
        title={<>Pet koraka do vašeg <span className="italic">obiteljskog arhiva</span></>}
        lead="Započnite s jednom knjigom. Dodajte članove obitelji. Gradite kolekciju koja će jednoga dana biti vaša obiteljska knjižnica. Privatni arhiv života vaše obitelji."
      />

      <section className="pb-20 lg:pb-28">
        <ol className="wrap">
          {steps.map((step, i) => (
            <li key={step.num} className="border-t border-ink/70 py-10 lg:py-14">
              <FadeIn>
                <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
                  <span className="num-oldstyle font-serif text-[44px] italic leading-none text-burgundy lg:col-span-2 lg:text-[56px]">
                    {step.num}
                  </span>
                  <div className={step.image ? "lg:col-span-4" : "lg:col-span-6"}>
                    <h2 className="h-sub">{step.title}</h2>
                    <p className="mt-4 max-w-md font-sans text-[16px] leading-[1.75] text-ink-soft">{step.desc}</p>
                  </div>
                  {step.image && (
                    <figure className={i % 2 === 0 ? "lg:col-span-5 lg:col-start-8" : "lg:col-span-4 lg:col-start-9"}>
                      <ZoomablePicture
                        image={step.image}
                        sizes="(min-width: 1024px) 40vw, 100vw"
                        label={step.label}
                        caption={step.caption}
                        className="aspect-[4/3] w-full object-cover"
                      />
                      {step.caption && <FigureCaption label={step.label}>{step.caption}</FigureCaption>}
                    </figure>
                  )}
                </div>
              </FadeIn>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-paper-deep py-20 lg:py-28">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
          <FadeIn className="lg:col-span-7">
            <h2 className="h-section">Tko sve može biti u vašoj kolekciji</h2>
            <p className="mt-8 font-serif text-[26px] leading-[1.5] text-ink sm:text-[30px]">
              {members.join(", ")}
              <span className="italic text-ink-soft"> i svaka osoba čija priča zaslužuje biti sačuvana.</span>
            </p>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:text-right">
            <Link to="/shop" className="btn-primary">
              Započnite kolekciju <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
