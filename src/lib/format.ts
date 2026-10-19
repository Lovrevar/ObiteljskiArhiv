const priceFormatters = new Map<string, Intl.NumberFormat>();

/** Croatian price notation, e.g. "29,99 €". */
export function formatPrice(amount: string | number, currencyCode = "EUR") {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  let formatter = priceFormatters.get(currencyCode);
  if (!formatter) {
    formatter = new Intl.NumberFormat("hr-HR", { style: "currency", currency: currencyCode });
    priceFormatters.set(currencyCode, formatter);
  }
  return formatter.format(Number.isFinite(value) ? value : 0);
}

/** Shopify CDN resizes on the fly; the originals are 4000–5000px PNGs. */
export function shopifyImageUrl(url: string, width: number) {
  try {
    const resized = new URL(url);
    resized.searchParams.set("width", String(width));
    return resized.toString();
  } catch {
    return url;
  }
}

export function shopifyImageSrcSet(url: string, widths: number[] = [480, 800, 1200, 1600, 2400, 3200]) {
  return widths.map((width) => `${shopifyImageUrl(url, width)} ${width}w`).join(", ");
}
