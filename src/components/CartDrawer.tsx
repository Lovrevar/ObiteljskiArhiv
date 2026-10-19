import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Loader2, Minus, Plus, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, shopifyImageUrl } from "@/lib/format";
import { DISCOUNT_TIERS, formatCollectionQuantityLabel } from "@/lib/shopify";
import { useCartCost } from "@/hooks/useCartCost";
import { displayTitle } from "@/lib/book";

export const CartDrawer = () => {
  const { isOpen, setOpen: setIsOpen, items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();

  const totalBooks = items.reduce((sum, item) => sum + item.quantity * (item.bundleSize ?? 1), 0);
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
  const currency = items[0]?.price.currencyCode || "EUR";
  const busy = isLoading || isSyncing;

  // Shopify's own figures, so volume discounts show before checkout; the local sum is the fallback.
  const { data: cost, isFetching: costLoading } = useCartCost(isOpen);
  const shownTotal = cost ? cost.total : totalPrice;
  const hasDiscount = Boolean(cost && cost.discount > 0);

  // single books count toward the volume discount; collection bundles are already discounted
  const singleBooks = items.filter((item) => !item.bundleSize).reduce((sum, item) => sum + item.quantity, 0);
  const nextTier = DISCOUNT_TIERS.find((tier) => tier.discount > 0 && singleBooks < tier.minQty);
  const booksToNextTier = nextTier ? nextTier.minQty - singleBooks : 0;

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (!checkoutUrl) return;

    window.open(checkoutUrl, "_blank");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-burgundy"
          aria-label={totalBooks > 0 ? `Košarica, ${formatCollectionQuantityLabel(totalBooks)}` : "Košarica"}
        >
          <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.4} />
          {totalBooks > 0 && (
            <span className="num-lining absolute right-1 top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-burgundy px-1 font-sans text-[10px] font-semibold text-paper">
              {totalBooks}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col gap-0 border-l border-hairline bg-paper p-0 sm:max-w-[440px]">
        <SheetHeader className="border-b border-hairline px-6 pb-5 pt-7 text-left sm:px-8">
          <SheetTitle className="font-serif text-[30px] font-normal leading-none text-ink">Vaša košarica</SheetTitle>
          <SheetDescription className="pt-1 font-sans text-[13px] text-ink-soft">
            {totalBooks === 0
              ? "Vaša košarica je prazna"
              : `${formatCollectionQuantityLabel(totalBooks)} spremno je za vašu obiteljsku arhivu.`}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-start justify-center px-6 sm:px-8">
            <p className="font-serif text-[24px] leading-snug text-ink">Još nema knjiga.</p>
            <p className="mt-2 max-w-xs font-sans text-[14px] leading-relaxed text-ink-soft">
              Pregledajte našu kolekciju i pronađite nešto posebno.
            </p>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="link-arrow mt-6">
              U trgovinu
            </Link>
          </div>
        ) : (
          <>
            <ul className="min-h-0 flex-1 divide-y divide-hairline overflow-y-auto px-6 sm:px-8">
              {items.map((item) => {
                const detailLines = item.selectedOptions.filter(
                  (option) => option.name !== "Title" && option.value !== item.variantTitle,
                );
                const image = item.product.node.images?.edges?.[0]?.node;

                return (
                  <li key={item.lineId ?? item.variantId} className="flex gap-4 py-5">
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-paper-deep">
                      {image ? (
                        <img
                          src={shopifyImageUrl(image.url, 240)}
                          alt={item.product.node.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : item.bundleSize ? (
                        <div aria-hidden className="flex h-full flex-col items-center justify-center border border-hairline">
                          <span className="num-lining font-serif text-[30px] leading-none text-burgundy">{item.bundleSize}</span>
                          <span className="mt-1 font-sans text-[10px] text-ink-soft">
                            {formatCollectionQuantityLabel(item.bundleSize).split(" ").slice(1).join(" ")}
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-serif text-[19px] leading-tight text-ink">{displayTitle(item.product.node.title)}</h3>
                        <p className="num-lining shrink-0 pt-0.5 font-sans text-[14px] text-ink">
                          {formatPrice(item.price.amount, item.price.currencyCode)}
                        </p>
                      </div>
                      {item.variantTitle !== "Default Title" && (
                        <p className="mt-1 font-sans text-[13px] text-ink-soft">{item.variantTitle}</p>
                      )}
                      {item.bundleSize && (
                        <p className="mt-1 font-sans text-[12px] text-ink-soft">1 paket = {item.bundleSize} knjiga</p>
                      )}
                      {detailLines.map((option) => (
                        <p key={`${item.lineId}-${option.name}`} className="mt-0.5 font-sans text-[12px] text-ink-soft">
                          {displayTitle(option.value)}
                        </p>
                      ))}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-hairline">
                          <button
                            type="button"
                            aria-label={`Smanji količinu: ${item.product.node.title}`}
                            onClick={() => item.lineId && updateQuantity(item.lineId, item.quantity - 1)}
                            disabled={!item.lineId || busy}
                            className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-paper-deep disabled:opacity-30"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="num-lining w-7 text-center font-sans text-[13px]">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Povećaj količinu: ${item.product.node.title}`}
                            onClick={() => item.lineId && updateQuantity(item.lineId, item.quantity + 1)}
                            disabled={!item.lineId || busy}
                            className="flex h-8 w-8 items-center justify-center text-ink transition-colors hover:bg-paper-deep disabled:opacity-30"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label={`Ukloni: ${item.product.node.title}`}
                          onClick={() => item.lineId && removeItem(item.lineId)}
                          disabled={!item.lineId || busy}
                          className="font-sans text-[12px] text-ink-soft underline decoration-ink/25 underline-offset-4 transition-colors hover:text-burgundy disabled:opacity-30"
                        >
                          Ukloni
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-hairline bg-paper-deep/60 px-6 pb-7 pt-6 sm:px-8">
              {hasDiscount && cost && (
                <dl className="mb-4 space-y-1.5 border-b border-hairline pb-4 font-sans text-[14px]">
                  <div className="flex justify-between text-ink-soft">
                    <dt>Međuzbroj</dt>
                    <dd className="num-lining">{formatPrice(cost.full, cost.currencyCode)}</dd>
                  </div>
                  <div className="flex justify-between text-burgundy">
                    <dt>{cost.discountTitles[0] ?? "Količinski popust"}</dt>
                    <dd className="num-lining">-{formatPrice(cost.discount, cost.currencyCode)}</dd>
                  </div>
                </dl>
              )}
              <div className="flex items-baseline justify-between">
                <span className="font-sans text-[14px] text-ink-soft">Ukupno</span>
                <span
                  className={`num-lining font-serif text-[28px] leading-none text-ink transition-opacity ${costLoading && !cost ? "opacity-50" : ""}`}
                  aria-busy={costLoading}
                >
                  {formatPrice(shownTotal, cost?.currencyCode ?? currency)}
                </span>
              </div>
              {!hasDiscount && singleBooks > 0 && nextTier && booksToNextTier <= 2 && (
                <p className="mt-2 font-sans text-[12px] text-burgundy">
                  Dodajte još {formatCollectionQuantityLabel(booksToNextTier)} za {nextTier.discount}% popusta.
                </p>
              )}
              <p className="mt-2 font-sans text-[12px] text-ink-soft">Dostava se izračunava pri završetku kupnje.</p>
              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || !getCheckoutUrl() || busy}
                type="button"
                className="btn-primary mt-5 w-full"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Nastavi na plaćanje
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  </>
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                className="mt-3 w-full py-2 text-center font-sans text-[13px] text-ink-soft transition-colors hover:text-ink"
              >
                Nastavi s kupnjom
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
