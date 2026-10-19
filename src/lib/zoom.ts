import { type MouseEvent } from "react";
import { type LocalImage } from "@/lib/images";

/** The copy of a photo the clicked thumbnail has already loaded, so the lightbox can show it at once. */
export function loadedCopy(event: MouseEvent<HTMLElement>, image: LocalImage) {
  const thumb = event.currentTarget.querySelector<HTMLImageElement>(`img[srcset="${CSS.escape(image.srcSet)}"]`);
  return thumb?.currentSrc || undefined;
}
