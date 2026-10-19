import coverRed800 from "@/assets/images/cover-red-800.webp";
import coverRed1600 from "@/assets/images/cover-red-1600.webp";
import coverNavy800 from "@/assets/images/cover-navy-800.webp";
import coverNavy1600 from "@/assets/images/cover-navy-1600.webp";
import coverRedBlank800 from "@/assets/images/cover-red-blank-800.webp";
import coverRedBlank1600 from "@/assets/images/cover-red-blank-1600.webp";
import coverNavyBlank800 from "@/assets/images/cover-navy-blank-800.webp";
import coverNavyBlank1600 from "@/assets/images/cover-navy-blank-1600.webp";
import shelfHomeRed800 from "@/assets/images/shelf-home-red-800.webp";
import shelfHomeRed1600 from "@/assets/images/shelf-home-red-1600.webp";
import shelfHomeNavy800 from "@/assets/images/shelf-home-navy-800.webp";
import shelfHomeNavy1600 from "@/assets/images/shelf-home-navy-1600.webp";
import skola800 from "@/assets/images/spread-skola-800.webp";
import skola1600 from "@/assets/images/spread-skola-1600.webp";
import snovi800 from "@/assets/images/spread-snovi-800.webp";
import snovi1600 from "@/assets/images/spread-snovi-1600.webp";
import brzaPitanja800 from "@/assets/images/spread-brza-pitanja-800.webp";
import brzaPitanja1600 from "@/assets/images/spread-brza-pitanja-1600.webp";
import bakaIUnuka800 from "@/assets/images/baka-i-unuka-800.webp";
import bakaIUnuka1600 from "@/assets/images/baka-i-unuka-1600.webp";
import par800 from "@/assets/images/par-ljubav-i-odnosi-800.webp";
import par1600 from "@/assets/images/par-ljubav-i-odnosi-1600.webp";
import prvaStranica800 from "@/assets/images/prva-stranica-800.webp";
import prvaStranica1600 from "@/assets/images/prva-stranica-1600.webp";
import otvorenaCrvena800 from "@/assets/images/otvorena-crvena-800.webp";
import otvorenaCrvena1600 from "@/assets/images/otvorena-crvena-1600.webp";
import pocetak800 from "@/assets/images/spread-pocetak-800.webp";
import pocetak1600 from "@/assets/images/spread-pocetak-1600.webp";
import obitelj800 from "@/assets/images/spread-obitelj-i-korijeni-800.webp";
import obitelj1600 from "@/assets/images/spread-obitelj-i-korijeni-1600.webp";
import ljubav800 from "@/assets/images/spread-ljubav-800.webp";
import ljubav1600 from "@/assets/images/spread-ljubav-1600.webp";
import svijet800 from "@/assets/images/spread-svijet-plavo-800.webp";
import svijet1600 from "@/assets/images/spread-svijet-plavo-1600.webp";
import maleStvari800 from "@/assets/images/spread-male-stvari-800.webp";
import maleStvari1600 from "@/assets/images/spread-male-stvari-1600.webp";
import sjecanja800 from "@/assets/images/spread-sjecanja-800.webp";
import sjecanja1600 from "@/assets/images/spread-sjecanja-1600.webp";
import poruke800 from "@/assets/images/spread-poruke-800.webp";
import poruke1600 from "@/assets/images/spread-poruke-1600.webp";
import fotografije800 from "@/assets/images/spread-fotografije-800.webp";
import fotografije1600 from "@/assets/images/spread-fotografije-1600.webp";

export interface LocalImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
}

const image = (small: string, large: string, width: number, height: number, alt: string): LocalImage => ({
  src: large,
  srcSet: `${small} 800w, ${large} 1600w`,
  width,
  height,
  alt,
});

/** Real photographs and mockups of "Moja priča". Nothing here is generated. */
export const images = {
  coverRed: image(coverRed800, coverRed1600, 1600, 1280, "Knjiga Moja priča u bordo izdanju na drvenoj polici"),
  coverNavy: image(coverNavy800, coverNavy1600, 1600, 1280, "Knjiga Moja priča u plavom izdanju na drvenoj polici"),
  coverRedBlank: image(
    coverRedBlank800,
    coverRedBlank1600,
    1600,
    1280,
    "Bordo izdanje s praznim prorezom na naslovnici, spremnim za vašu fotografiju",
  ),
  coverNavyBlank: image(
    coverNavyBlank800,
    coverNavyBlank1600,
    1600,
    1280,
    "Plavo izdanje s praznim prorezom na naslovnici, spremnim za vašu fotografiju",
  ),
  shelfHomeRed: image(shelfHomeRed800, shelfHomeRed1600, 1600, 1280, "Bordo izdanje na kućnoj polici uz obiteljsku fotografiju"),
  shelfHomeNavy: image(shelfHomeNavy800, shelfHomeNavy1600, 1600, 1280, "Plavo izdanje na kućnoj polici uz obiteljsku fotografiju"),
  bakaIUnuka: image(
    bakaIUnuka800,
    bakaIUnuka1600,
    1600,
    1280,
    "Baka i unuka zajedno listaju poglavlje Djetinjstvo koje te oblikovalo",
  ),
  par: image(par800, par1600, 1600, 1280, "Par na kauču čita poglavlje Ljubav i odnosi u plavom izdanju"),
  prvaStranica: image(
    prvaStranica800,
    prvaStranica1600,
    1600,
    1152,
    "Prva stranica bordo izdanja: ovo je mjesto gdje vaš život postaje priča",
  ),
  otvorenaCrvena: image(otvorenaCrvena800, otvorenaCrvena1600, 1600, 1440, "Otvorena korica bordo izdanja s prvim pitanjima"),
  pocetak: image(pocetak800, pocetak1600, 1600, 1200, "Poglavlje Početak tvoje priče s fotografijama iz djetinjstva"),
  skola: image(skola800, skola1600, 1600, 1200, "Poglavlje Škola i prvi izazovi u bordo izdanju"),
  snovi: image(snovi800, snovi1600, 1600, 1200, "Poglavlje Snovi i neostvarene želje u bordo izdanju"),
  brzaPitanja: image(brzaPitanja800, brzaPitanja1600, 1600, 1200, "Stranice s brzim pitanjima u plavom izdanju"),
  obitelj: image(obitelj800, obitelj1600, 1600, 1200, "Poglavlje Obitelj i korijeni s tradicionalnim vezom"),
  ljubav: image(ljubav800, ljubav1600, 1600, 1200, "Poglavlje Ljubav i odnosi s fotografijom para"),
  svijet: image(svijet800, svijet1600, 1600, 1200, "Poglavlje Svijet koji se mijenjao u plavom izdanju"),
  maleStvari: image(maleStvari800, maleStvari1600, 1600, 1200, "Poglavlje Male stvari koje te čine tobom"),
  sjecanja: image(sjecanja800, sjecanja1600, 1600, 1200, "Poglavlje Sjećanja i emocije s fotografijom"),
  poruke: image(poruke800, poruke1600, 1600, 1200, "Poglavlje Poruke za budućnost"),
  fotografije: image(fotografije800, fotografije1600, 1600, 1200, "Stranice za fotografije i ostavštinu na kraju knjige"),
} satisfies Record<string, LocalImage>;
