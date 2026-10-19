import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SEO } from "@/components/SEO";
import { HomeHero } from "@/components/HomeHero";
import { Picture } from "@/components/Picture";
import { FigureCaption } from "@/components/FigureCaption";
import { CoverWindow } from "@/components/CoverWindow";
import { Stitch } from "@/components/Stitch";
import { ChapterViewer } from "@/components/ChapterViewer";
import { EditionCard, EditionCardSkeleton } from "@/components/EditionCard";
import { useProducts } from "@/hooks/useProducts";
import { images } from "@/lib/images";
import { bookFacts, editionOrder, EXCLUDED_BOOK_HANDLES } from "@/lib/book";
import { formatPrice } from "@/lib/format";

const steps = [
  {
    title: "Započnite s jednom knjigom",
    desc: "Odaberite prvu osobu u obitelji čiju priču želite sačuvati.",
  },
  {
    title: "Ispunite je postupno",
    desc: "Primatelj odgovara na vođena pitanja svojim tempom, vlastitim rukopisom.",
  },
  {
    title: "Dodajte više članova",
    desc: "Kupite knjige za ostale članove obitelji. Svaka osoba dobiva svoju.",
  },
  {
    title: "Gradite obiteljski arhiv",
    desc: "S vremenom, vaša kolekcija postaje kompletna obiteljska knjižnica za generacije.",
  },
];

const faqs = [
  {
    q: "Što je obiteljski arhiv?",
    a: "To je kolekcija knjiga u kojoj svaki član obitelji dokumentira svoj život i zajedno tvore kompletnu obiteljsku povijest za buduće generacije.",
  },
  {
    q: "Mogu li kupiti više knjiga za cijelu obitelj?",
    a: "Apsolutno. Zapravo, to je cijela ideja da svaki član obitelji dobiva svoju knjigu, a zajedno gradite obiteljsku knjižnicu.",
  },
  {
    q: "Je li teško ispuniti?",
    a: "Nimalo. Knjiga koristi vođena pitanja koja olakšavaju razmišljanje i pisanje, čak i osobama koje inače ne pišu.",
  },
  {
    q: "Koliko vremena treba za ispunjavanje?",
    a: "Nema fiksnog tempa. Neki ljudi je ispunjavaju postupno kroz tjedne ili mjesece, što često čini iskustvo još značajnijim.",
  },
];

export default function HomePage() {
  const { data: products, isLoading } = useProducts();
  const bookProducts = (products ?? [])
    .filter((product) => !EXCLUDED_BOOK_HANDLES.has(product.node.handle))
    .sort((a, b) => editionOrder(a.node.handle) - editionOrder(b.node.handle));

  const firstVariant = bookProducts[0]?.node.variants.edges[0]?.node;
  const singlePrice = firstVariant ? formatPrice(firstVariant.price.amount, firstVariant.price.currencyCode) : undefined;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Obiteljski Arhiv: Knjiga uspomena",
    description:
      "Vođena knjiga uspomena za svakog člana obitelji. Sačuvajte životne priče, uspomene i obiteljsku povijest za buduće generacije.",
    brand: { "@type": "Brand", name: "Obiteljski Arhiv" },
    category: "Personalizirani poklon / Knjiga uspomena",
    audience: {
      "@type": "PeopleAudience",
      suggestedGender: "unisex",
      audienceType: "obitelj, mama, tata, baka, djed, teta, ujak",
    },
  };

  return (
    <main>
      <SEO
        title="Obiteljski Arhiv - Knjige uspomena za vašu obitelj"
        description="Vođena knjiga uspomena u koju svaki član obitelji upisuje svoju priču. Savršen personalizirani poklon za mamu, tatu, baku, djeda. Sačuvajte obiteljsku povijest za buduće generacije."
        path="/"
        keywords="obiteljski arhiv, knjiga uspomena, poklon za mamu, poklon za tatu, poklon za baku, poklon za djeda, personalizirani poklon, obiteljsko stablo, obiteljska povijest, poklon za rođendan, poklon za godišnjicu, memoari, autobiografija, hrvatska"
        jsonLd={[faqJsonLd, productJsonLd]}
      />

      <HomeHero price={singlePrice} />

      {/* I — What the book is */}
      <section aria-labelledby="uvod-heading" className="pb-24 pt-28 lg:pb-36 lg:pt-44">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <FadeIn>
              <figure>
                <Picture
                  image={images.prvaStranica}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="aspect-[25/18] w-full object-cover"
                />
                <figcaption className="caption mt-3">Prva stranica bordo izdanja</figcaption>
              </figure>
            </FadeIn>
            <FadeIn delay={0.1}>
              <CoverWindow tone="burgundy" className="mt-12 sm:ml-auto sm:mt-14 sm:w-[82%]" />
            </FadeIn>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <FadeIn>
              <p className="font-sans text-[13px] text-ink-soft">Moja priča, vođena autobiografija</p>
              <h2
                id="uvod-heading"
                className="h-section mt-4 text-balance"
              >
                Ova knjiga nije obična knjiga. <span className="italic text-burgundy">To je alat za očuvanje života kroz priču.</span>
              </h2>
              <div className="prose-book mt-8 max-w-[34rem] font-sans text-[16px] leading-[1.75] text-ink-soft">
                <p>
                  Ispunjava se rukom, odgovarajući na pažljivo postavljena pitanja koja vode kroz život: od djetinjstva,
                  obitelji, ljubavi, karijere, pa sve do životnih lekcija i poruka za buduće generacije.
                </p>
                <p>Ova knjiga nije dnevnik niti obična bilježnica. To je obiteljsko nasljeđe.</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <dl className="mt-12 border-t border-ink/70">
                {bookFacts.map((fact) => (
                  <div key={fact.term} className="grid gap-1 border-b border-hairline py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                    <dt className="font-serif text-[19px] leading-snug text-ink">{fact.term}</dt>
                    <dd className="font-sans text-[14px] leading-relaxed text-ink-soft">{fact.detail}</dd>
                  </div>
                ))}
              </dl>
              <Link to="/shop" className="link-arrow mt-8">
                Odaberite svoje izdanje <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* II — Inside the book */}
      <section
        id="kako-izgleda"
        aria-labelledby="iznutra-heading"
        className="scroll-mt-20 bg-paper-deep py-24 lg:py-32"
      >
        <div className="wrap">
          <FadeIn>
            <div className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end lg:gap-8">
              <h2
                id="iznutra-heading"
                className="h-section text-balance lg:col-span-7"
              >
                Pažljivo osmišljena pitanja koja pomažu da uspomene <span className="italic">poteku</span>
              </h2>
              <p className="max-w-md font-sans text-[15px] leading-relaxed text-ink-soft lg:col-span-4 lg:col-start-9">
                Kronološki tijek poglavlja od djetinjstva do nasljeđa, prostor za slobodno pisanje i stranice za
                fotografije na kraju.
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.05}>
            <ChapterViewer />
          </FadeIn>
        </div>
      </section>

      {/* III — Why it matters */}
      <section aria-labelledby="kronicari-heading" className="bg-ink py-24 text-paper lg:py-36">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-8">
          <FadeIn className="lg:col-span-7">
            <Stitch pattern="rosette" className="mb-8 h-3 text-foil" />
            <h2 id="kronicari-heading" className="text-[2rem] leading-[1.12] tracking-[-0.012em] sm:text-[2.6rem] lg:text-[3.1rem]">
              Zrinski su imali kroničare.
              <br />
              Draškovići su imali monografije.
              <br />
              <span className="italic text-paper/65">Vaša obitelj ima vas.</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.1} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <div className="prose-book font-sans text-[15px] leading-[1.75] text-paper/70">
              <p>
                Kroz povijest, samo su plemićke obitelji imale dokumentirane živote. Zrinski i Frankopani, Draškovići,
                Oršići su sačuvali svoje priče kroz generacije jer su ih zapisali.
              </p>
              <p>
                A obične obitelji? Njihove priče su nestajale s vremenom. Ima ljudi koji nisu ni uspjeli upoznati svoje
                djedove i bake. Njihove priče su nažalost umrle s njima.
              </p>
              <p>
                Uspomene, lekcije, detalji djetinjstva, ljubavi, borbi i promjena sve to tiho nestaje s vremenom. Koliko
                vaša djeca zapravo znaju o svojim bakama i djedovima?
              </p>
            </div>
            <p className="mt-8 font-serif text-[22px] italic text-paper">Započnite svoj obiteljski arhiv danas.</p>
          </FadeIn>
        </div>
      </section>

      {/* IV — For the whole family */}
      <section aria-labelledby="obitelj-heading" className="overflow-x-clip py-24 lg:py-36">
        <div className="wrap grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          <FadeIn className="lg:col-span-7">
            <figure className="lg:-ml-[max(0px,calc((100vw-1240px)/2+3rem))]">
              <Picture
                image={images.par}
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="aspect-[5/4] w-full object-cover"
              />
              <FigureCaption label="Poglavlje 8" className="lg:pl-[max(0px,calc((100vw-1240px)/2+3rem))]">
                Ljubav i odnosi, plavo izdanje
              </FigureCaption>
            </figure>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <h2 id="obitelj-heading" className="h-section text-balance">
              Zamislite: cijela vaša obitelj, svaki član, jedna knjiga
            </h2>
            <p className="mt-6 font-sans text-[16px] leading-[1.75] text-ink-soft">
              Započnite s jednom knjigom. Dodajte članove obitelji. Gradite kolekciju koja će jednoga dana biti vaša
              obiteljska knjižnica.
            </p>
            <p className="mt-8 font-serif text-[24px] leading-[1.35] text-ink">
              Mama, tata, baka, djed, teta, ujak
              <span className="text-ink-soft"> i svi ostali ... svaka osoba u obitelji čija priča zaslužuje biti sačuvana.</span>
            </p>
            <p className="mt-8 border-l-2 border-burgundy pl-5 font-sans text-[14px] leading-relaxed text-ink-soft">
              Darujte za rođendan, blagdan, godišnjicu ili jednostavno jer vam je stalo da ta priča bude zapisana.
            </p>
          </FadeIn>
        </div>

        <div className="wrap mt-24 lg:mt-32">
          <FadeIn>
            <div className="flex items-baseline justify-between gap-6 border-b border-ink/70 pb-4">
              <h2 className="font-serif text-[26px] italic text-ink">Kako funkcionira</h2>
              <Link to="/how-it-works" className="link-arrow text-[13px]">
                Više o tome
              </Link>
            </div>
          </FadeIn>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="border-b border-hairline py-7 sm:pr-8 lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0"
              >
                <FadeIn delay={i * 0.08}>
                  <span className="num-oldstyle font-serif text-[20px] italic text-burgundy">{i + 1}.</span>
                  <h3 className="mt-3 font-serif text-[22px] leading-snug text-ink">{step.title}</h3>
                  <p className="mt-2 font-sans text-[14px] leading-relaxed text-ink-soft">{step.desc}</p>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* V — Choose an edition */}
      <section id="kolekcija" aria-labelledby="izdanja-heading" className="scroll-mt-20 bg-paper-deep py-24 lg:py-32">
        <div className="wrap">
          <FadeIn>
            <div className="mb-14 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
              <h2 id="izdanja-heading" className="h-section lg:col-span-6">
                Započnite svoju kolekciju
              </h2>
              <p className="font-serif text-[21px] italic leading-snug text-ink-soft lg:col-span-5 lg:col-start-8">
                Jedan život. Jedna knjiga. Jedna obitelj. Kolekcija koja traje zauvijek.
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-16 md:grid-cols-2 md:gap-10 lg:gap-14">
            {isLoading ? (
              <>
                <EditionCardSkeleton />
                <EditionCardSkeleton />
              </>
            ) : bookProducts.length > 0 ? (
              bookProducts.map((product, i) => (
                <FadeIn key={product.node.id} delay={i * 0.1}>
                  <EditionCard product={product} />
                </FadeIn>
              ))
            ) : (
              <p className="font-sans text-ink-soft">Nema pronađenih proizvoda</p>
            )}
          </div>

          <FadeIn>
            <div className="mt-20 grid gap-6 border-t border-ink/70 pt-8 lg:grid-cols-12 lg:items-center lg:gap-8">
              <div className="lg:col-span-5">
                <h3 className="font-serif text-[28px] leading-tight text-ink">Obiteljska kolekcija</h3>
                <p className="mt-2 font-sans text-[14px] leading-relaxed text-ink-soft">
                  Složite kolekciju za cijelu obitelj, popust je već uključen u cijenu paketa.
                </p>
              </div>
              <dl className="flex gap-10 lg:col-span-4">
                <div>
                  <dt className="font-sans text-[13px] text-ink-soft">5+ knjiga</dt>
                  <dd className="num-lining mt-1 font-serif text-[30px] leading-none text-burgundy">-15%</dd>
                </div>
                <div>
                  <dt className="font-sans text-[13px] text-ink-soft">10+ knjiga</dt>
                  <dd className="num-lining mt-1 font-serif text-[30px] leading-none text-burgundy">-20%</dd>
                </div>
              </dl>
              <div className="lg:col-span-3 lg:text-right">
                <Link to="/shop" className="btn-ink w-full sm:w-auto">
                  Složite kolekciju
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* VI — Questions */}
      <section aria-labelledby="pitanja-heading" className="py-24 lg:py-32">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
          <FadeIn className="lg:col-span-4">
            <h2 id="pitanja-heading" className="h-section">
              Česta pitanja
            </h2>
            <Link to="/faq" className="link-arrow mt-6">
              Pogledaj sva pitanja <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </FadeIn>
          <FadeIn delay={0.05} className="lg:col-span-7 lg:col-start-6">
            <div className="border-t border-ink/70">
              {faqs.map((faq) => (
                <details key={faq.q} className="group border-b border-hairline">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-serif text-[21px] leading-snug text-ink transition-colors hover:text-burgundy [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <Plus
                      className="h-4 w-4 shrink-0 text-ink-soft transition-transform duration-300 group-open:rotate-45"
                      strokeWidth={1.5}
                    />
                  </summary>
                  <p className="-mt-1 max-w-2xl pb-7 font-sans text-[15px] leading-[1.75] text-ink-soft">{faq.a}</p>
                </details>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
