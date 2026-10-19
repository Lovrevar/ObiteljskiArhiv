// Every photograph is exported at 800, 1600, 2400 and 3200px wide (never wider than its original).
const files = import.meta.glob<string>("@/assets/images/*.webp", { eager: true, import: "default" });

const variants = new Map<string, { width: number; url: string }[]>();
for (const [path, url] of Object.entries(files)) {
  const match = path.match(/([^/]+)-(\d+)\.webp$/);
  if (!match) continue;
  const [, name, width] = match;
  variants.set(name, [...(variants.get(name) ?? []), { width: Number(width), url }]);
}

export interface LocalImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
}

const image = (name: string, width: number, height: number, alt: string): LocalImage => {
  const sources = (variants.get(name) ?? []).sort((a, b) => a.width - b.width);
  if (sources.length === 0) throw new Error(`Missing image: src/assets/images/${name}-*.webp`);
  return {
    src: (sources.find((source) => source.width === 1600) ?? sources[sources.length - 1]).url,
    srcSet: sources.map((source) => `${source.url} ${source.width}w`).join(", "),
    width,
    height,
    alt,
  };
};

/** Real photographs and mockups of "Moja priča". Nothing here is generated. */
export const images = {
  coverRed: image("cover-red", 1600, 1280, "Knjiga Moja priča u bordo izdanju na drvenoj polici"),
  coverNavy: image("cover-navy", 1600, 1280, "Knjiga Moja priča u plavom izdanju na drvenoj polici"),
  coverRedBlank: image(
    "cover-red-blank",
    1600,
    1280,
    "Bordo izdanje s praznim prorezom na naslovnici, spremnim za vašu fotografiju",
  ),
  coverNavyBlank: image(
    "cover-navy-blank",
    1600,
    1280,
    "Plavo izdanje s praznim prorezom na naslovnici, spremnim za vašu fotografiju",
  ),
  shelfHomeRed: image("shelf-home-red", 1600, 1280, "Bordo izdanje na kućnoj polici uz obiteljsku fotografiju"),
  shelfHomeNavy: image("shelf-home-navy", 1600, 1280, "Plavo izdanje na kućnoj polici uz obiteljsku fotografiju"),
  bakaIUnuka: image(
    "baka-i-unuka",
    1600,
    1280,
    "Baka i unuka zajedno listaju poglavlje Djetinjstvo koje te oblikovalo",
  ),
  par: image("par-ljubav-i-odnosi", 1600, 1280, "Par na kauču čita poglavlje Ljubav i odnosi u plavom izdanju"),
  prvaStranica: image(
    "prva-stranica",
    1600,
    1152,
    "Prva stranica bordo izdanja: ovo je mjesto gdje vaš život postaje priča",
  ),
  otvorenaCrvena: image("otvorena-crvena", 1600, 1440, "Otvorena korica bordo izdanja s prvim pitanjima"),
  pocetak: image("spread-pocetak", 1600, 1200, "Poglavlje Početak tvoje priče s fotografijama iz djetinjstva"),
  skola: image("spread-skola", 1600, 1200, "Poglavlje Škola i prvi izazovi u bordo izdanju"),
  snovi: image("spread-snovi", 1600, 1200, "Poglavlje Snovi i neostvarene želje u bordo izdanju"),
  brzaPitanja: image("spread-brza-pitanja", 1600, 1200, "Stranice s brzim pitanjima u plavom izdanju"),
  obitelj: image("spread-obitelj-i-korijeni", 1600, 1200, "Poglavlje Obitelj i korijeni s tradicionalnim vezom"),
  ljubav: image("spread-ljubav", 1600, 1200, "Poglavlje Ljubav i odnosi s fotografijom para"),
  svijet: image("spread-svijet-plavo", 1600, 1200, "Poglavlje Svijet koji se mijenjao u plavom izdanju"),
  maleStvari: image("spread-male-stvari", 1600, 1200, "Poglavlje Male stvari koje te čine tobom"),
  sjecanja: image("spread-sjecanja", 1600, 1200, "Poglavlje Sjećanja i emocije s fotografijom"),
  poruke: image("spread-poruke", 1600, 1200, "Poglavlje Poruke za budućnost"),
  fotografije: image("spread-fotografije", 1600, 1200, "Stranice za fotografije i ostavštinu na kraju knjige"),
} satisfies Record<string, LocalImage>;
