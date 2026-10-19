import { type ImgHTMLAttributes } from "react";
import { type LocalImage } from "@/lib/images";
import { shopifyImageSrcSet, shopifyImageUrl } from "@/lib/format";

type BaseProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "width" | "height" | "alt">;

// React 18 only forwards the lowercase attribute; the camelCase prop logs a warning.
const highPriority = (priority?: boolean) =>
  (priority ? { fetchpriority: "high" } : {}) as ImgHTMLAttributes<HTMLImageElement>;

interface PictureProps extends BaseProps {
  image: LocalImage;
  sizes: string;
  alt?: string;
  priority?: boolean;
}

/** Local, pre-optimised photograph with responsive sources and intrinsic size (no layout shift). */
export function Picture({ image, sizes, alt, priority, ...rest }: PictureProps) {
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      {...highPriority(priority)}
      {...rest}
    />
  );
}

interface ShopifyPictureProps extends BaseProps {
  url: string;
  alt: string;
  sizes: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

/** Product photograph from the Shopify CDN, resized for the slot it sits in. */
export function ShopifyPicture({ url, alt, sizes, width, height, priority, ...rest }: ShopifyPictureProps) {
  return (
    <img
      src={shopifyImageUrl(url, 1200)}
      srcSet={shopifyImageSrcSet(url)}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...highPriority(priority)}
      {...rest}
    />
  );
}
