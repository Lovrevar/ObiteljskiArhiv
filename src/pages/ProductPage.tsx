import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Loader2, Minus, Plus } from "lucide-react";
import { useProductByHandle } from "@/hooks/useProducts";
import { useAddBookToCart } from "@/hooks/useAddBookToCart";
import { FadeIn } from "@/components/FadeIn";
import { ShopifyPicture } from "@/components/Picture";
import { Lightbox, ZoomHint } from "@/components/Lightbox";
import { CoverWindow } from "@/components/CoverWindow";
import { Stitch } from "@/components/Stitch";
import { SEO, SITE_URL } from "@/components/SEO";
import { COLLECTION_HANDLE, bookFacts, displayTitle, editionTone, familyMembers, splitEditionTitle } from "@/lib/book";
import { formatPrice, shopifyImageSrcSet, shopifyImageUrl } from "@/lib/format";
import { type LocalImage } from "@/lib/images";
import { spotOf, type Spot } from "@/lib/zoom";
import { DISCOUNT_TIERS, getDiscountForQuantity } from "@/lib/shopify";
import { cn } from "@/lib/utils";

const accordionItems = [
  { title: "Format knjige", content: "Tvrdi uvez s premium vezivom. \nFormat: A4" },
  {
    title: "Stil pisanja",
    content: "Vođena pitanja osmišljena za rukopisne odgovore. Nije potrebna nikakva pisačka vještina.",
  },
  { title: "Sekcija za fotografije", content: "Posebne stranice za fotografije na kraju knjige." },
  {
    title: "Više knjiga za obitelj",
    content:
      "Svaka knjiga je dizajnirana da bude dio kolekcije. Kupite jednu za svakog člana obitelji i gradite obiteljski arhiv.",
  },
];

const reasons = [
  "Dokumentira život koji bi se inače mogao izgubiti",
  "Dio kolekcije, svaki član obitelji dobiva svoju",
  "Stvara privatni obiteljski arhiv za buduće generacije",
  "Olakšava pričanje životne priče kroz vođena pitanja",
  "Uključuje prostor za fotografije i osobna razmišljanja",
];

export default function ProductPage() {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading } = useProductByHandle(handle || "");
  const { addBook, isBusy } = useAddBookToCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [enlarged, setEnlarged] = useState<Spot | null>(null);

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-ink-soft" aria-label="Učitavanje" />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="wrap flex min-h-[70vh] flex-col items-start justify-center">
        <p className="h-section">Proizvod nije pronađen</p>
        <Link to="/shop" className="link-arrow mt-6">
          Natrag u trgovinu <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </main>
    );
  }

  const variant = product.node.variants.edges[0]?.node;
  const images = product.node.images.edges;
  const activeImage = images[selectedImage]?.node ?? images[0]?.node;
  // the gallery photo as the lightbox shows it, at Shopify's full resolution
  const zoomImage: LocalImage | null = activeImage
    ? {
        src: shopifyImageUrl(activeImage.url, 1600),
        srcSet: shopifyImageSrcSet(activeImage.url),
        width: activeImage.width ?? 1600,
        height: activeImage.height ?? 1280,
        alt: activeImage.altText || product.node.title,
      }
    : null;

  const isCollection = product.node.handle === COLLECTION_HANDLE;
  const handleAddToCart = () => addBook(product, quantity);
  const [name, edition] = splitEditionTitle(product.node.title);
  const tone = editionTone(product.node.title);

  // volume discount on single books, applied by Shopify in the cart
  const unitPrice = variant ? parseFloat(variant.price.amount) : 0;
  const volumeDiscount = getDiscountForQuantity(quantity).discount;
  // Shopify takes the percentage off each book and drops fractions of a cent (29,99 € at 15% → 25,50 €)
  const discountedUnitPrice = unitPrice - Math.floor(unitPrice * volumeDiscount + 1e-6) / 100;
  const firstTier = DISCOUNT_TIERS.find((tier) => tier.discount > 0);

  // the Shopify description uses dashes and markdown asterisks; keep meta text plain
  const plainDescription = (product.node.description || "").replace(/\s+[–—]\s+/g, ", ").replace(/\*\*/g, "");
  const productImage = images[0]?.node?.url;
  const priceAmount = variant?.price?.amount;
  const priceCurrency = variant?.price?.currencyCode || "EUR";
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.node.title,
    description: plainDescription || `${displayTitle(product.node.title)}: knjiga uspomena za obiteljski arhiv.`,
    image: productImage ? [productImage] : undefined,
    brand: { "@type": "Brand", name: "Obiteljski Arhiv" },
    url: `${SITE_URL}/product/${product.node.handle}`,
    offers: priceAmount
      ? {
          "@type": "Offer",
          price: priceAmount,
          priceCurrency,
          availability: variant?.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: `${SITE_URL}/product/${product.node.handle}`,
        }
      : undefined,
  };

  return (
    <main>
      <SEO
        title={`${displayTitle(product.node.title)}: Knjiga uspomena | Obiteljski Arhiv`}
        description={
          plainDescription.slice(0, 155) ||
          `${product.node.title}: personalizirana knjiga uspomena. Savršen poklon za člana obitelji. Sačuvajte životnu priču za buduće generacije.`
        }
        path={`/product/${product.node.handle}`}
        image={productImage ? shopifyImageUrl(productImage, 1200) : undefined}
        type="product"
        keywords={`${product.node.title}, knjiga uspomena, personalizirani poklon, obiteljski arhiv, poklon za obitelj`}
        jsonLd={productJsonLd}
      />

      <section className="pb-20 pt-6 lg:pb-28 lg:pt-10">
        <div className="wrap">
          <nav aria-label="Putanja" className="mb-6 font-sans text-[13px] text-ink-soft lg:mb-10">
            <Link to="/shop" className="underline decoration-ink/20 underline-offset-4 hover:text-ink">
              Trgovina
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{displayTitle(product.node.title)}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div className="overflow-hidden bg-paper-deep">
                {activeImage && zoomImage && (
                  <button
                    type="button"
                    onClick={(event) => setEnlarged(spotOf(event, zoomImage))}
                    aria-label="Povećaj fotografiju"
                    className="group relative block w-full cursor-zoom-in"
                  >
                    <ShopifyPicture
                      key={activeImage.url}
                      url={activeImage.url}
                      alt={activeImage.altText || product.node.title}
                      priority
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="enter-image aspect-[5/4] w-full object-cover"
                    />
                    <ZoomHint />
                  </button>
                )}
              </div>
              <Lightbox
                image={enlarged ? zoomImage : null}
                spot={enlarged ?? undefined}
                caption={displayTitle(product.node.title)}
                onClose={() => setEnlarged(null)}
              />
              {images.length > 1 && (
                <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto" role="group" aria-label="Fotografije proizvoda">
                  {images.map((img, i) => (
                    <button
                      key={img.node.url}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      aria-label={`Prikaži fotografiju ${i + 1} od ${images.length}`}
                      aria-pressed={selectedImage === i}
                      className={cn(
                        "relative h-[72px] w-[90px] flex-shrink-0 overflow-hidden bg-paper-deep transition-opacity",
                        selectedImage === i ? "opacity-100" : "opacity-60 hover:opacity-100",
                      )}
                    >
                      <img src={shopifyImageUrl(img.node.url, 200)} alt="" className="h-full w-full object-cover" loading="lazy" />
                      <span
                        aria-hidden
                        className={cn(
                          "absolute inset-x-0 bottom-0 h-[2px] transition-colors",
                          selectedImage === i ? "bg-burgundy" : "bg-transparent",
                        )}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase */}
            <div className="lg:col-span-4 lg:col-start-9">
              <div className="lg:sticky lg:top-28">
                {!isCollection && (
                  <p className="flex items-center gap-2.5 font-sans text-[13px] text-ink-soft">
                    <span aria-hidden className={cn("h-3.5 w-2.5", tone === "burgundy" ? "bg-burgundy" : "bg-navy")} />
                    {tone === "burgundy" ? "Bordo izdanje" : "Plavo izdanje"}
                  </p>
                )}
                <h1 className="mt-3 font-serif text-[2.4rem] leading-[1.04] tracking-[-0.015em] text-ink sm:text-[2.9rem]">
                  {name}
                  {edition && (
                    <>
                      <br />
                      <span className="italic">{edition}</span>
                    </>
                  )}
                </h1>
                <p className="mt-4 font-sans text-[15px] leading-relaxed text-ink-soft">
                  Jedna knjiga. Jedan život. Početak vaše obiteljske kolekcije.
                </p>

                {variant && (
                  <p className="num-lining mt-6 font-serif text-[30px] leading-none text-ink">
                    {formatPrice(variant.price.amount, variant.price.currencyCode)}
                  </p>
                )}

                <ul className="mt-7 space-y-2 border-t border-hairline pt-6 font-sans text-[14px] text-ink-soft">
                  {["Vođena pitanja za životnu priču", "Dio obiteljske kolekcije", "Format za rukopisne uspomene"].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span aria-hidden className="h-1 w-1 rotate-45 bg-burgundy" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>

                <div className="mt-8">
                  {isCollection ? (
                    <Link to="/shop" className="btn-primary w-full">
                      Složite svoju kolekciju
                    </Link>
                  ) : (
                    <div className="flex gap-3">
                      <div className="flex items-center border border-ink/25" role="group" aria-label="Količina">
                        <button
                          type="button"
                          aria-label="Smanji količinu"
                          disabled={quantity <= 1 || isBusy}
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="flex h-12 w-11 items-center justify-center text-ink transition-colors hover:bg-paper-deep disabled:opacity-30"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="num-lining w-8 text-center font-sans text-[15px]" aria-live="polite">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Povećaj količinu"
                          disabled={isBusy}
                          onClick={() => setQuantity((q) => q + 1)}
                          className="flex h-12 w-11 items-center justify-center text-ink transition-colors hover:bg-paper-deep disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        disabled={isBusy || !variant?.availableForSale}
                        className="btn-primary flex-1 px-4"
                      >
                        {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
                        {variant?.availableForSale ? "Dodaj u košaricu" : "Trenutno nedostupno"}
                      </button>
                    </div>
                  )}
                  {!isCollection && variant && volumeDiscount > 0 && (
                    <p className="mt-4 flex flex-wrap items-baseline gap-x-2 font-sans text-[14px] text-ink" aria-live="polite">
                      <span className="text-burgundy">-{volumeDiscount}% za {quantity} knjiga:</span>
                      <span className="num-lining text-ink-soft line-through">{formatPrice(unitPrice * quantity, variant.price.currencyCode)}</span>
                      <span className="num-lining font-medium">
                        {formatPrice(discountedUnitPrice * quantity, variant.price.currencyCode)}
                      </span>
                    </p>
                  )}
                  <p className="mt-4 font-sans text-[13px] leading-relaxed text-ink-soft">
                    {variant?.availableForSale
                      ? "Knjiga je dostupna za narudžbu. Trošak dostave prikazuje se pri plaćanju."
                      : "Ovo izdanje trenutno nije dostupno za kupnju."}{" "}
                    {firstTier && (
                      <>
                        Za {firstTier.minQty} ili više knjiga u košarici, bilo kojeg izdanja, popust se obračunava automatski.{" "}
                      </>
                    )}
                    <Link to="/shop" className="text-ink underline decoration-burgundy/50 underline-offset-4 hover:decoration-burgundy">
                      Pogledajte količinske popuste.
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the book */}
      <section aria-labelledby="o-knjizi-heading" className="border-t border-hairline bg-paper-deep py-20 lg:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
          <FadeIn className="lg:col-span-5">
            <h2 id="o-knjizi-heading" className="h-section">
              O ovoj knjizi
            </h2>
            <p className="mt-6 font-serif text-[23px] leading-[1.4] text-ink">
              Ova knjiga nije obična knjiga. <span className="italic">To je alat za očuvanje života kroz priču.</span>
            </p>
            <p className="mt-6 font-sans text-[15px] leading-[1.75] text-ink-soft">
              Ispunjava se rukom, odgovarajući na pažljivo postavljena pitanja koja vode kroz život: od djetinjstva,
              obitelji, ljubavi, karijere, pa sve do životnih lekcija i poruka za buduće generacije.
            </p>
            {!isCollection && (
              <CoverWindow tone={tone} className="mt-12" />
            )}
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <h3 className="font-serif text-[22px] italic text-ink">Što knjiga sadrži</h3>
            <dl className="mt-4 border-t border-ink/70">
              {bookFacts.map((fact) => (
                <div key={fact.term} className="grid gap-1 border-b border-hairline py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                  <dt className="font-serif text-[19px] leading-snug text-ink">{fact.term}</dt>
                  <dd className="font-sans text-[14px] leading-relaxed text-ink-soft">{fact.detail}</dd>
                </div>
              ))}
              <div className="grid gap-1 border-b border-hairline py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="font-serif text-[19px] leading-snug text-ink">Samoljepljivi kutići</dt>
                <dd className="font-sans text-[14px] leading-relaxed text-ink-soft">
                  S njima ljepite fotografije na papir. Odabrali smo kutiće jer od ljepila ostaju tragovi, a folija
                  požuti s vremenom te daje na debljini knjige.
                </dd>
              </div>
            </dl>
            <p className="mt-8 font-serif text-[21px] italic leading-snug text-ink">
              Ova knjiga nije dnevnik niti obična bilježnica. To je obiteljsko nasljeđe.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Why & the collection */}
      <section className="py-20 lg:py-28">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-8">
          <FadeIn className="lg:col-span-5">
            <h2 className="h-sub">Zašto je ova knjiga važna</h2>
            <ol className="mt-6 border-t border-ink/70">
              {reasons.map((reason, i) => (
                <li key={reason} className="flex gap-4 border-b border-hairline py-4 font-sans text-[15px] text-ink">
                  <span className="num-oldstyle w-5 shrink-0 font-serif text-[17px] italic text-burgundy">{i + 1}.</span>
                  {reason}
                </li>
              ))}
            </ol>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-6 lg:col-start-7">
            <h2 className="h-sub">Zamislite kolekciju</h2>
            <p className="mt-5 font-sans text-[15px] leading-[1.75] text-ink-soft">
              Ovo je jedna knjiga. Ali zamislite policu s 5, 10 ili 20 knjiga - svaka od drugog člana obitelji. Mama,
              tata, baka, djed, teta, ujak... Vaša privatna obiteljska knjižnica.
            </p>
            <p className="mt-6 font-serif text-[22px] leading-[1.5] text-ink">
              {[...familyMembers, "+ cijela obitelj"].map((member, i, all) => (
                <span key={member}>
                  {member}
                  {i < all.length - 1 && <span className="ml-2 text-burgundy/60">·</span>}{" "}
                </span>
              ))}
            </p>

            <h2 className="h-sub mt-14">Detalji proizvoda</h2>
            <div className="mt-5 border-t border-ink/70">
              {accordionItems.map((item) => (
                <details key={item.title} className="group border-b border-hairline">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-sans text-[15px] text-ink [&::-webkit-details-marker]:hidden">
                    {item.title}
                    <Plus className="h-4 w-4 text-ink-soft transition-transform duration-300 group-open:rotate-45" strokeWidth={1.5} />
                  </summary>
                  <p className="-mt-1 whitespace-pre-wrap pb-5 font-sans text-[14px] leading-relaxed text-ink-soft">
                    {item.content}
                  </p>
                </details>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="border-t border-hairline bg-paper-deep py-20 lg:py-28">
        <div className="wrap max-w-[860px]">
          <FadeIn>
            <Stitch pattern="rosette" className="h-3" />
            <h2 className="mt-7 text-[2rem] leading-[1.12] text-ink sm:text-[2.6rem]">
              Ne samo jedna knjiga nego početak obiteljskog arhiva
            </h2>
            <div className="mt-6 space-y-2 font-sans text-[15px] leading-relaxed text-ink-soft">
              <p>Zrinski su imali kroničare. Draškovići monografije.</p>
              <p>Vaša obitelj ima vas i ovu knjižnicu.</p>
              <p>Započnite s jednom knjigom. Dodajte još. Gradite nešto što će trajati generacijama.</p>
            </div>
            <Link to="/shop" className="btn-outline mt-10">
              Pogledajte sve knjige
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
