import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Picture } from "@/components/Picture";
import { Stitch } from "@/components/Stitch";
import { FigureCaption } from "@/components/FigureCaption";
import { images } from "@/lib/images";

interface HomeHeroProps {
  /** formatted price of a single book, once Shopify has answered */
  price?: string;
}

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export function HomeHero({ price }: HomeHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageShift = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -48]);
  const printShift = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -96]);

  const showInterior = () => {
    document.getElementById("kako-izgleda")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <section ref={ref} aria-labelledby="hero-heading" className="relative overflow-x-clip">
      <div className="lg:grid lg:min-h-[min(760px,calc(100svh-112px))] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        {/* Words */}
        <div className="wrap flex flex-col justify-center pb-10 pt-9 sm:pb-12 sm:pt-14 lg:mx-0 lg:max-w-none lg:py-20 lg:pl-[max(3rem,calc((100vw-1240px)/2+3rem))] lg:pr-14 xl:pr-20">
          <p className="enter eyebrow flex items-center gap-3 text-burgundy" style={delay(60)}>
            <Stitch pattern="rosette" className="h-[11px]" />
            OBITELJSKI ARHIV
          </p>

          <h1
            id="hero-heading"
            className="mt-6 font-serif text-[3rem] leading-[1] tracking-[-0.022em] text-ink sm:text-[4.1rem] lg:text-[4.35rem] xl:text-[5rem]"
          >
            <span className="enter block" style={delay(140)}>
              Svaka obitelj
            </span>
            <span className="enter block italic text-burgundy" style={delay(240)}>
              ima priču.
            </span>
          </h1>

          <p
            className="enter mt-7 max-w-[27rem] text-pretty font-sans text-[17px] leading-[1.65] text-ink-soft lg:text-[18px]"
            style={delay(360)}
          >
            Sačuvaj uspomene, obiteljske priče i trenutke koji zaslužuju ostati zauvijek.
          </p>

          <div className="enter mt-9 flex flex-col gap-3 sm:flex-row" style={delay(460)}>
            <Link to="/shop" className="btn-primary group">
              Otkrij knjigu
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.5} />
            </Link>
            <button type="button" onClick={showInterior} className="btn-outline">
              Pogledaj kako izgleda
            </button>
          </div>

          <p className="enter caption mt-6 text-[17px] sm:mt-7" style={delay(560)}>
            Poklon koji s godinama postaje još vrjedniji.
          </p>

          <dl
            className="enter mt-10 hidden flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-5 font-sans text-[13px] text-ink-soft sm:flex"
            style={delay(640)}
          >
            <div className="flex gap-1.5">
              <dt className="sr-only">Knjiga</dt>
              <dd className="font-serif text-[16px] italic text-ink">Moja priča</dd>
            </div>
            <div>
              <dt className="sr-only">Izvedba</dt>
              <dd>Tvrdi uvez, format A4</dd>
            </div>
            <div>
              <dt className="sr-only">Izdanja</dt>
              <dd>Bordo i plavo izdanje</dd>
            </div>
            {price && (
              <div>
                <dt className="sr-only">Cijena</dt>
                <dd className="num-lining text-ink">{price}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* The book */}
        <div className="relative pb-20 sm:pb-24 lg:pb-0">
          <motion.div style={{ y: imageShift }} className="relative h-full">
            <div className="enter-image h-full">
              <Picture
                image={images.coverRed}
                priority
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="aspect-[4/5] h-full w-full object-cover object-[50%_50%] sm:aspect-[5/4] lg:aspect-auto lg:min-h-[560px]"
              />
            </div>
          </motion.div>

          <motion.figure
            style={{ y: printShift }}
            className="absolute bottom-0 left-5 z-10 w-[52%] max-w-[300px] sm:left-8 sm:w-[38%] lg:-bottom-10 lg:-left-16 lg:w-[38%] lg:max-w-[340px]"
          >
            <div className="enter" style={delay(700)}>
              <div className="photo-mount -rotate-[1.6deg]">
                <span className="corner-bl" />
                <span className="corner-br" />
                <Picture
                  image={images.bakaIUnuka}
                  sizes="(min-width: 1024px) 340px, 52vw"
                  className="aspect-[5/4] w-full object-cover"
                />
              </div>
              <FigureCaption label="Poglavlje 3" className="hidden pl-1 sm:flex">
                Djetinjstvo koje te oblikovalo
              </FigureCaption>
            </div>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
