import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ShopifyPicture } from "@/components/Picture";
import { useAddBookToCart } from "@/hooks/useAddBookToCart";
import { type ShopifyProduct } from "@/lib/shopify";
import { formatPrice } from "@/lib/format";
import { editionTone, splitEditionTitle } from "@/lib/book";
import { cn } from "@/lib/utils";

interface EditionCardProps {
  product: ShopifyProduct;
  sizes?: string;
  className?: string;
}

/** One edition of "Moja priča": real cover photograph, colour, price, and the add-to-cart action. */
export function EditionCard({ product, sizes = "(min-width: 768px) 50vw, 100vw", className }: EditionCardProps) {
  const { addBook, isBusy } = useAddBookToCart();
  const variant = product.node.variants.edges[0]?.node;
  const image = product.node.images.edges[0]?.node;
  const [name, edition] = splitEditionTitle(product.node.title);
  const tone = editionTone(product.node.title);
  const available = Boolean(variant?.availableForSale);
  const href = `/product/${product.node.handle}`;

  return (
    <article className={cn("group", className)}>
      <Link to={href} className="block overflow-hidden bg-paper-deep" tabIndex={-1} aria-hidden>
        {image && (
          <ShopifyPicture
            url={image.url}
            alt={image.altText || product.node.title}
            sizes={sizes}
            width={1600}
            height={1280}
            className="aspect-[5/4] w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.025]"
          />
        )}
      </Link>

      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <p className="flex items-center gap-2.5 font-sans text-[13px] text-ink-soft">
            <span aria-hidden className={cn("h-3.5 w-2.5", tone === "burgundy" ? "bg-burgundy" : "bg-navy")} />
            {tone === "burgundy" ? "Bordo izdanje" : "Plavo izdanje"}
          </p>
          <h3 className="mt-2 font-serif text-[28px] leading-[1.08] text-ink sm:text-[32px]">
            <Link to={href} className="transition-colors hover:text-burgundy">
              {name}
              {edition && (
                <>
                  {" "}
                  <span className="italic">{edition}</span>
                </>
              )}
            </Link>
          </h3>
        </div>
        {variant && (
          <p className="num-lining shrink-0 pt-7 font-sans text-[16px] text-ink">
            {formatPrice(variant.price.amount, variant.price.currencyCode)}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => addBook(product)}
          disabled={isBusy || !available}
          className="btn-primary sm:flex-1"
        >
          {isBusy && <Loader2 className="h-4 w-4 animate-spin" />}
          {available ? "Dodaj u košaricu" : "Trenutno nedostupno"}
        </button>
        <Link to={href} className="btn-outline">
          Pogledaj knjigu
        </Link>
      </div>
    </article>
  );
}

export function EditionCardSkeleton() {
  return (
    <div aria-hidden>
      <div className="aspect-[5/4] w-full animate-pulse bg-paper-deep" />
      <div className="mt-6 h-4 w-28 bg-paper-deep" />
      <div className="mt-3 h-8 w-3/4 bg-paper-deep" />
      <div className="mt-6 h-12 w-full bg-paper-deep" />
    </div>
  );
}
