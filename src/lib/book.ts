import { images, type LocalImage } from "@/lib/images";

export interface Chapter {
  number: number | null;
  title: string;
  spread?: LocalImage;
}

/** Chapter order as printed in the book; spreads exist for the chapters we have photographed. */
export const chapters: Chapter[] = [
  { number: 1, title: "Tko si ti" },
  { number: 2, title: "Početak tvoje priče", spread: images.pocetak },
  { number: 3, title: "Djetinjstvo koje te oblikovalo", spread: images.bakaIUnuka },
  { number: 4, title: "Škola i prvi izazovi", spread: images.skola },
  { number: 5, title: "Godine promjena" },
  { number: 6, title: "Obitelj i korijeni", spread: images.obitelj },
  { number: 7, title: "Posao i životni put" },
  { number: 8, title: "Ljubav i odnosi", spread: images.ljubav },
  { number: 9, title: "Svijet koji se mijenjao", spread: images.svijet },
  { number: 10, title: "Male stvari koje te čine tobom", spread: images.maleStvari },
  { number: 11, title: "Sjećanja i emocije", spread: images.sjecanja },
  { number: 12, title: "Snovi i neostvarene želje", spread: images.snovi },
  { number: 13, title: "Poruke za budućnost", spread: images.poruke },
  { number: null, title: "Fotografije i ostavština", spread: images.fotografije },
];

/** What is physically in the book — taken from the product description. */
export const bookFacts = [
  {
    term: "14 poglavlja s pitanjima",
    detail: "Svako pitanje ostavlja dovoljno prostora za iskrene, rukom pisane odgovore.",
  },
  {
    term: "Stranice za fotografije",
    detail:
      "Na kraju knjige, sa samoljepljivim kutićima za fotografije formata 10×15 cm. Uz svaku sliku možete napisati kratki opis.",
  },
  {
    term: "Personalizacija na koricama",
    detail: "Na prednjoj korici nalazi se prorez kroz koji se vidi fotografija koju odaberete.",
  },
  {
    term: "Tvrdi uvez, format A4",
    detail: "Tvrdi uvez s premium vezivom, izrađen da traje generacijama.",
  },
];

export const familyMembers = ["Mama", "Tata", "Baka", "Djed", "Teta", "Ujak", "Brat", "Sestra"];

/** Single editions: the two "Moja priča" books, burgundy first. */
export const COLLECTION_HANDLE = "obiteljska-kolekcija";
export const EXCLUDED_BOOK_HANDLES = new Set(["mix-match-1", COLLECTION_HANDLE]);

export function editionOrder(handle: string) {
  if (handle.includes("za-nju")) return 0;
  return 1;
}

/** Which cover colour a product is printed in, judged from its title. */
export function editionTone(title: string): "burgundy" | "navy" {
  return /za nju/i.test(title) ? "burgundy" : "navy";
}

const TITLE_DASH = /\s+[–—-]\s+/;

/** "Moja priča – za nju" → ["Moja priča", "za nju"] */
export function splitEditionTitle(title: string): [string, string | null] {
  const parts = title.split(TITLE_DASH);
  if (parts.length < 2) return [title, null];
  return [parts[0], parts.slice(1).join(" ")];
}

/** Shopify titles carry a dash ("Moja priča – za nju"); on the page they read as one phrase. */
export function displayTitle(text: string) {
  return text.replace(new RegExp(TITLE_DASH, "g"), " ");
}
