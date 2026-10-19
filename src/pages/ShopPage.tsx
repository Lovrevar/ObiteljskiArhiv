import { useState } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { useProducts } from "@/hooks/useProducts";
import {
  type ShopifyProduct,
  DISCOUNT_TIERS,
  formatCollectionQuantityLabel,
  getDiscountForQuantity,
} from "@/lib/shopify";
import { useAddBookToCart } from "@/hooks/useAddBookToCart";
import { useCartStore } from "@/stores/cartStore";
import { SEO } from "@/components/SEO";
import { Stitch } from "@/components/Stitch";
import { EditionCard, EditionCardSkeleton } from "@/components/EditionCard";
import { COLLECTION_HANDLE, displayTitle, editionOrder, editionTone, EXCLUDED_BOOK_HANDLES } from "@/lib/book";
import { formatPrice, shopifyImageUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

const MAX_COLLECTION_SIZE = 20;

export default function ShopPage() {
  const { data: products, isLoading } = useProducts();
  const { isBusy: cartLoading } = useAddBookToCart();
  const addItem = useCartStore((state) => state.addItem);

  const collectionProduct = (products ?? []).find((product) => product.node.handle === COLLECTION_HANDLE) ?? null;
  const bookProducts = (products ?? [])
    .filter((product) => !EXCLUDED_BOOK_HANDLES.has(product.node.handle))
    .sort((a, b) => editionOrder(a.node.handle) - editionOrder(b.node.handle));

  const [collectionItems, setCollectionItems] = useState<Record<string, number>>({});

  const totalCollectionQty = Object.values(collectionItems).reduce((sum, quantity) => sum + quantity, 0);
  const collectionDiscount = getDiscountForQuantity(totalCollectionQty);
  const collectionVariantTitle = totalCollectionQty > 0 ? formatCollectionQuantityLabel(totalCollectionQty) : null;
  const collectionVariant = collectionProduct?.node.variants.edges.find(
    (edge) => edge.node.title === collectionVariantTitle,
  )?.node;

  const basePrice = (() => {
    const firstVariant = bookProducts[0]?.node.variants.edges[0]?.node;
    return firstVariant ? parseFloat(firstVariant.price.amount) : 0;
  })();

  const currency = bookProducts[0]?.node.variants.edges[0]?.node.price.currencyCode || "EUR";
  const collectionTotalPrice = collectionVariant
    ? parseFloat(collectionVariant.price.amount)
    : basePrice * totalCollectionQty * (1 - collectionDiscount.discount / 100);
  const collectionFullPrice = basePrice * totalCollectionQty;

  const nextTier = DISCOUNT_TIERS.find((tier) => tier.discount > collectionDiscount.discount);
  const booksToNextTier = nextTier ? nextTier.minQty - totalCollectionQty : 0;

  // the shelf: one spine per selected book, in the colour of its edition
  const shelf = bookProducts.flatMap((product) => {
    const variant = product.node.variants.edges[0]?.node;
    const quantity = variant ? collectionItems[variant.id] || 0 : 0;
    return Array.from({ length: quantity }, () => editionTone(product.node.title));
  });

  const updateCollectionQty = (variantId: string, delta: number) => {
    setCollectionItems((previousItems) => {
      const currentQuantity = previousItems[variantId] || 0;
      const nextQuantity = Math.max(0, currentQuantity + delta);
      const currentTotal = Object.values(previousItems).reduce((sum, quantity) => sum + quantity, 0);

      if (delta > 0 && currentTotal >= MAX_COLLECTION_SIZE) return previousItems;

      if (nextQuantity === 0) {
        const { [variantId]: _removed, ...rest } = previousItems;
        return rest;
      }

      return { ...previousItems, [variantId]: nextQuantity };
    });
  };

  const applyPreset = (targetQuantity: number) => {
    const variants = bookProducts
      .map((product) => product.node.variants.edges[0]?.node)
      .filter((variant): variant is NonNullable<ShopifyProduct["node"]["variants"]["edges"][number]["node"]> =>
        Boolean(variant?.availableForSale),
      );

    if (variants.length === 0) return;

    const baseAllocation = Math.floor(targetQuantity / variants.length);
    const remainder = targetQuantity % variants.length;

    const nextItems: Record<string, number> = {};
    variants.forEach((variant, index) => {
      const quantity = baseAllocation + (index < remainder ? 1 : 0);
      if (quantity > 0) nextItems[variant.id] = quantity;
    });

    setCollectionItems(nextItems);
  };

  const handleAddCollection = async () => {
    if (totalCollectionQty === 0 || !collectionProduct || !collectionVariant?.availableForSale || cartLoading) return;
    const attributes = bookProducts.flatMap((product) => {
      const variant = product.node.variants.edges[0]?.node;
      const quantity = variant ? collectionItems[variant.id] || 0 : 0;
      return quantity > 0 ? [{ key: product.node.title, value: `${quantity} kom.` }] : [];
    });
    await addItem({
      product: collectionProduct,
      variantId: collectionVariant.id,
      variantTitle: collectionVariant.title,
      price: collectionVariant.price,
      quantity: 1,
      selectedOptions: attributes.map(({ key, value }) => ({ name: key, value: `${key}: ${value}` })),
      attributes,
      bundleSize: totalCollectionQty,
    });
  };

  return (
    <main>
      <SEO
        title="Trgovina: Knjige uspomena za obitelj | Obiteljski Arhiv"
        description="Knjige su dostupne za kupnju. Složite obiteljsku kolekciju uz 15% popusta za 5+ knjiga ili 20% popusta za 10+ knjiga."
        path="/shop"
        keywords="knjiga uspomena, poklon za mamu, poklon za tatu, poklon za baku, poklon za djeda, personalizirani poklon, obiteljski poklon, obiteljski arhiv"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Trgovina Obiteljski Arhiv",
          description: "Knjige uspomena za svakog člana obitelji.",
          url: "https://obiteljski-arhiv.com/shop",
        }}
      />

      {/* Introduction & discount table */}
      <section className="pb-16 pt-12 lg:pb-24 lg:pt-20">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
          <FadeIn className="lg:col-span-7">
            <p className="eyebrow flex items-center gap-3 text-burgundy">
              <Stitch pattern="rosette" className="h-[11px]" />
              DOSTUPNO ZA NARUDŽBU
            </p>
            <h1 className="h-page mt-6 text-balance">
              Započnite svoju obiteljsku <span className="italic">knjižnicu</span>
            </h1>
            <p className="mt-7 max-w-[36rem] font-sans text-[16px] leading-[1.75] text-ink-soft">
              Složite vlastitu kolekciju knjiga Moja priča za svoju obitelj. Odaberite izdanja za njega i za nju u
              trgovini. Sastav kolekcije naveden je u narudžbi. Popust je uključen u cijenu: 5+ knjiga 15%, 10+ knjiga
              20%.
            </p>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <h2 className="font-serif text-[22px] italic text-ink">Količinski popusti za kolekcije</h2>
            <dl className="mt-4 border-t border-ink/70">
              {DISCOUNT_TIERS.map((tier) => {
                const isActive = totalCollectionQty > 0 && collectionDiscount.minQty === tier.minQty;
                return (
                  <div
                    key={tier.minQty}
                    className={cn(
                      "flex items-baseline justify-between border-b border-hairline py-3.5 transition-colors",
                      isActive && "text-burgundy",
                    )}
                  >
                    <dt className="flex items-center gap-3 font-sans text-[14px]">
                      <span
                        aria-hidden
                        className={cn("h-1.5 w-1.5 rotate-45 transition-colors", isActive ? "bg-burgundy" : "bg-ink/20")}
                      />
                      {tier.label}
                    </dt>
                    <dd className="num-lining font-serif text-[22px] leading-none">
                      {tier.discount === 0 ? "Puna cijena" : `-${tier.discount}%`}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </FadeIn>
        </div>
      </section>

      {/* Single books */}
      <section aria-labelledby="pojedinacne-heading" className="pb-24 lg:pb-32">
        <div className="wrap">
          <div className="mb-10 flex items-baseline justify-between gap-6 border-b border-ink/70 pb-4">
            <h2 id="pojedinacne-heading" className="font-serif text-[26px] italic text-ink">
              Pojedinačne knjige
            </h2>
            {basePrice > 0 && (
              <p className="num-lining font-sans text-[13px] text-ink-soft">
                {formatPrice(basePrice, currency)} / komad
              </p>
            )}
          </div>
          <div className="grid gap-16 md:grid-cols-2 md:gap-10 lg:gap-14">
            {isLoading ? (
              <>
                <EditionCardSkeleton />
                <EditionCardSkeleton />
              </>
            ) : bookProducts.length > 0 ? (
              bookProducts.map((product, index) => (
                <FadeIn key={product.node.id} delay={index * 0.08}>
                  <EditionCard product={product} />
                </FadeIn>
              ))
            ) : (
              <p className="font-sans text-ink-soft">Nema pronađenih proizvoda</p>
            )}
          </div>
        </div>
      </section>

      {/* Collection builder */}
      {bookProducts.length > 0 && (
        <section
          id="kolekcija"
          aria-labelledby="kolekcija-heading"
          className="scroll-mt-20 bg-paper-deep py-20 lg:py-28"
        >
          <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-7">
              <FadeIn>
                <h2 id="kolekcija-heading" className="h-section">
                  Složite svoju kolekciju
                </h2>
                <p className="mt-5 max-w-xl font-sans text-[15px] leading-relaxed text-ink-soft">
                  Kliknite kolekciju 5 ili 10 knjiga pa prilagodite omjer (npr. 3 za njega i 2 za nju).
                </p>
              </FadeIn>

              <FadeIn delay={0.05}>
                <div className="mt-10 grid gap-3 sm:grid-cols-2">
                  {[5, 10].map((quantity) => {
                    const presetDiscount = getDiscountForQuantity(quantity);
                    const presetVariant = collectionProduct?.node.variants.edges.find(
                      (edge) => edge.node.title === formatCollectionQuantityLabel(quantity),
                    )?.node;
                    const presetPrice = presetVariant
                      ? parseFloat(presetVariant.price.amount)
                      : basePrice * quantity * (1 - presetDiscount.discount / 100);
                    const isCurrent = totalCollectionQty === quantity;

                    return (
                      <button
                        key={quantity}
                        onClick={() => applyPreset(quantity)}
                        type="button"
                        disabled={cartLoading}
                        aria-pressed={isCurrent}
                        className={cn(
                          "group border bg-paper p-5 text-left transition-colors duration-300 disabled:opacity-50",
                          isCurrent ? "border-burgundy" : "border-hairline hover:border-ink/50",
                        )}
                      >
                        <span className="flex items-baseline justify-between gap-4">
                          <span className="font-serif text-[23px] leading-tight text-ink">Kolekcija {quantity} knjiga</span>
                          <span className="num-lining font-sans text-[13px] font-medium text-burgundy">
                            {presetDiscount.discount > 0 ? `-${presetDiscount.discount}%` : "Bez popusta"}
                          </span>
                        </span>
                        <span className="mt-3 flex items-baseline justify-between gap-4 font-sans text-[14px] text-ink-soft">
                          <span>
                            {presetDiscount.discount > 0 ? `Uključeno ${presetDiscount.discount}% popusta` : "Bez popusta"}
                          </span>
                          <span className="num-lining text-ink">{formatPrice(presetPrice, currency)}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <ul className="mt-10 border-t border-ink/70">
                  {bookProducts.map((product) => {
                    const variant = product.node.variants.edges[0]?.node;
                    if (!variant) return null;

                    const quantity = collectionItems[variant.id] || 0;
                    const disableIncrease = totalCollectionQty >= MAX_COLLECTION_SIZE || !variant.availableForSale;
                    const image = product.node.images.edges[0]?.node;
                    const tone = editionTone(product.node.title);

                    return (
                      <li key={product.node.id} className="flex items-center gap-4 border-b border-hairline py-4 sm:gap-5">
                        <div className="h-16 w-20 flex-shrink-0 overflow-hidden bg-paper">
                          {image && (
                            <img
                              src={shopifyImageUrl(image.url, 240)}
                              alt={image.altText || product.node.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="flex items-center gap-2 font-serif text-[19px] leading-tight text-ink">
                            <span aria-hidden className={cn("h-3 w-2 shrink-0", tone === "burgundy" ? "bg-burgundy" : "bg-navy")} />
                            <span className="truncate">{displayTitle(product.node.title)}</span>
                          </h3>
                          <p className="num-lining mt-1 font-sans text-[13px] text-ink-soft">
                            {formatPrice(variant.price.amount, variant.price.currencyCode)} / komad
                          </p>
                        </div>
                        <div className="flex items-center border border-hairline bg-paper">
                          <button
                            aria-label={`Smanji broj: ${product.node.title}`}
                            onClick={() => updateCollectionQty(variant.id, -1)}
                            type="button"
                            className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-paper-deep disabled:opacity-30"
                            disabled={quantity === 0 || cartLoading}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="num-lining w-8 text-center font-sans text-[15px] font-medium" aria-live="polite">
                            {quantity}
                          </span>
                          <button
                            aria-label={`Povećaj broj: ${product.node.title}`}
                            onClick={() => updateCollectionQty(variant.id, 1)}
                            type="button"
                            className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:bg-paper-deep disabled:opacity-30"
                            disabled={disableIncrease || cartLoading}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </FadeIn>
            </div>

            {/* Order slip */}
            <aside className="lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9">
              <div className="border border-hairline bg-paper p-6 sm:p-8 lg:sticky lg:top-28">
                <h3 className="font-serif text-[26px] leading-none text-ink">Vaša kolekcija</h3>

                <div className="mt-6" aria-hidden>
                  <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] items-end gap-[3px]">
                    {Array.from({ length: MAX_COLLECTION_SIZE }, (_, index) => {
                      const spine = shelf[index];
                      return (
                        <span
                          key={index}
                          className={cn(
                            "h-9 transition-colors duration-300",
                            spine === "burgundy" && "bg-burgundy",
                            spine === "navy" && "bg-navy",
                            !spine && "border border-ink/15",
                            index % 3 === 1 && "h-[34px]",
                          )}
                        />
                      );
                    })}
                  </div>
                  <div className="mt-2 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-[3px] font-sans text-[11px] text-ink-soft">
                    <span className="col-start-5 col-end-7 whitespace-nowrap">↑ -15%</span>
                    <span className="col-start-10 col-end-12 whitespace-nowrap">↑ -20%</span>
                  </div>
                </div>

                <dl className="mt-6 space-y-3 border-t border-hairline pt-5 font-sans text-[14px]">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Ukupno knjiga</dt>
                    <dd className="num-lining font-medium text-ink">
                      {totalCollectionQty} / {MAX_COLLECTION_SIZE}
                    </dd>
                  </div>
                  {collectionDiscount.discount > 0 && (
                    <div className="flex justify-between text-burgundy">
                      <dt>Popust</dt>
                      <dd className="num-lining font-medium">-{collectionDiscount.discount}%</dd>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between border-t border-hairline pt-4">
                    <dt className="font-serif text-[19px] text-ink">Cijena kolekcije</dt>
                    <dd className="num-lining text-right">
                      {collectionDiscount.discount > 0 && totalCollectionQty > 0 && (
                        <span className="mr-2 text-[13px] text-ink-soft line-through">
                          {formatPrice(collectionFullPrice, currency)}
                        </span>
                      )}
                      <span className="font-serif text-[26px] leading-none text-ink">
                        {formatPrice(totalCollectionQty > 0 ? collectionTotalPrice : 0, currency)}
                      </span>
                    </dd>
                  </div>
                </dl>

                <p className="mt-3 min-h-[18px] font-sans text-[12px] text-ink-soft">
                  {totalCollectionQty === 0
                    ? "Odaberite kolekciju ili dodajte knjige jednu po jednu."
                    : nextTier && booksToNextTier > 0
                      ? `Još ${formatCollectionQuantityLabel(booksToNextTier)} do ${nextTier.discount}% popusta.`
                      : "Popust je već uključen u cijenu paketa, bez promotivnog koda."}
                </p>

                <button
                  onClick={handleAddCollection}
                  disabled={totalCollectionQty === 0 || cartLoading || !collectionVariant?.availableForSale}
                  type="button"
                  className="btn-primary mt-6 w-full"
                >
                  {cartLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Dodaj kolekciju od {totalCollectionQty || 0}{" "}
                  {formatCollectionQuantityLabel(Math.max(totalCollectionQty, 1)).split(" ").slice(1).join(" ")}
                </button>
                <p className="mt-3 text-center font-sans text-[12px] leading-relaxed text-ink-soft">
                  {totalCollectionQty > 0 && !collectionVariant?.availableForSale
                    ? "Odabrana kolekcija trenutno nije dostupna. Pokušajte s drugom količinom."
                    : "Sastav vaše kolekcije bit će naveden u košarici i narudžbi."}
                </p>
              </div>
            </aside>
          </div>
        </section>
      )}
    </main>
  );
}
