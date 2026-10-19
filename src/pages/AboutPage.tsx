import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { SEO } from "@/components/SEO";
import { PageIntro } from "@/components/PageIntro";
import { Picture } from "@/components/Picture";
import { StitchRule } from "@/components/Stitch";
import { images } from "@/lib/images";

const principles = [
  {
    title: "Naša misija",
    text: "Demokratizirati obiteljsku povijest. Omogućiti svakoj obitelji da gradi svoju kolekciju knjiga u kojoj su sačuvani životi svih članova, za buduće generacije. Ovo je prije bila privilegija plemstva, a sada može biti i vaša.",
  },
  {
    title: "Rukopis koji ostaje",
    text: "Fotografije blijede i digitalni zapisi nestaju. Ali ručno ispisana knjiga s vašim rukopisom, vašim riječima ostaje. Fizički trag da ste postojali, da ste voljeli, da ste imali svoj svijet. Živ si onoliko dugo koliko te se netko sjeća. Ako se vaši potomci i sve buduće generacije budu sjećali svojih predaka - onda će oni živjeti vječno.",
  },
  {
    title: "Za one koji dolaze",
    text: "Ovo ne radimo za sebe. Radimo za našu djecu i za sve buduće generacije koje će htjeti znati odakle dolaze. Neka Obiteljski Arhiv postane vaša tradicija.",
  },
];

export default function AboutPage() {
  return (
    <main>
      <SEO
        title="O nama: Priča iza Obiteljskog Arhiva | Zašto svaka obitelj zaslužuje svoj arhiv"
        description="Kroz povijest samo su plemićke obitelji imale dokumentirane živote. Obiteljski Arhiv omogućuje svakoj obitelji da sačuva svoju priču za buduće generacije."
        path="/about"
        keywords="obiteljski arhiv, obiteljska povijest, obiteljsko stablo, genealogija, memoari, priča obitelji, hrvatska tradicija"
      />

      <PageIntro eyebrow="O NAMA" title={<>Zašto ovo <span className="italic">postoji</span></>} />

      {/* The essay */}
      <section className="pb-20 lg:pb-28">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <FadeIn className="lg:col-span-7">
            <div className="max-w-[40rem] font-sans text-[17px] leading-[1.8] text-ink-soft">
              <p className="font-serif text-[25px] leading-[1.45] text-ink first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-[78px] first-letter:leading-[0.8] first-letter:text-burgundy sm:text-[27px]">
                Kroz povijest, samo su plemićke obitelji imale privilegiju dokumentiranih života. Zrinski su imali
                kroničare, Draškovići monografije.
              </p>
              <p className="mt-8">
                Obične obitelji? Njihove priče su nestajale s ljudima koji su ih živjeli. Svaka obitelj je važna i njene
                priče i povijest zaslužuju biti zapisane.
              </p>
              <p className="mt-6">
                Ova knjiga je puno više od poklona. To je početak obiteljske kolekcije u kojoj svaki član obitelji
                dokumentira svoj život.
              </p>
              <p className="mt-6">
                Zamislite za recimo 50 godina, vaši unuci otvaraju knjižnicu s knjigama vaše mame, tate, bake, djeda,
                tete, ujaka i čitaju tko su bili ti ljudi. Mogu saznati zanimljive priče o članovima obitelji i dodatno
                naučiti o svom obiteljskom stablu. A jednoga dana će i oni nastaviti pisati i prenijeti svoje priče na
                potomke.
              </p>
              <p className="mt-10 font-serif text-[26px] italic leading-snug text-ink">
                To više nije privilegija plemstva. To zaslužuje i vaša obitelj.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <figure className="lg:sticky lg:top-28">
              <Picture image={images.bakaIUnuka} sizes="(min-width: 1024px) 32vw, 100vw" className="aspect-[4/5] w-full object-cover object-[40%_50%]" />
              <figcaption className="caption mt-3">Baka i unuka nad poglavljem o djetinjstvu</figcaption>
            </figure>
          </FadeIn>
        </div>
      </section>

      <div className="wrap">
        <StitchRule />
      </div>

      {/* Principles */}
      <section className="py-20 lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-3 lg:gap-10">
          {principles.map((principle, i) => (
            <FadeIn key={principle.title} delay={i * 0.08}>
              <h2 className="h-sub">{principle.title}</h2>
              <p className="mt-4 font-sans text-[15px] leading-[1.75] text-ink-soft">{principle.text}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="overflow-x-clip pb-24 lg:pb-32">
        <FadeIn className="wrap">
          <figure>
            <Picture image={images.par} sizes="(min-width: 1240px) 1144px, 100vw" className="aspect-[16/9] w-full object-cover object-[50%_60%]" />
            <figcaption className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
              <span className="caption">Par zajedno čita knjigu uspomena</span>
              <Link to="/shop" className="link-arrow">
                Započnite svoj arhiv <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </figcaption>
          </figure>
        </FadeIn>
      </section>
    </main>
  );
}
