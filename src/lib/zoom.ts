import { type MouseEvent } from "react";
import { type LocalImage } from "@/lib/images";

/** Where a photo was tapped (fractions of its width and height) and the copy the page already shows. */
export interface Spot {
  x: number;
  y: number;
  placeholder?: string;
}

/** The spot that was clicked on a thumbnail, in the photo's own coordinates (thumbnails are centred object-cover crops). */
export function spotOf(event: MouseEvent<HTMLElement>, image: LocalImage): Spot {
  const thumb = event.currentTarget.querySelector<HTMLImageElement>(`img[srcset="${CSS.escape(image.srcSet)}"]`);
  const placeholder = thumb?.currentSrc || undefined;
  // keyboard activation has no pointer position
  if (!thumb || event.detail === 0) return { x: 0.5, y: 0.5, placeholder };

  const rect = thumb.getBoundingClientRect();
  let x = (event.clientX - rect.left) / rect.width;
  let y = (event.clientY - rect.top) / rect.height;
  const boxRatio = rect.width / rect.height;
  const imageRatio = image.width / image.height;
  if (imageRatio > boxRatio) x = 0.5 + (x - 0.5) * (boxRatio / imageRatio);
  else y = 0.5 + (y - 0.5) * (imageRatio / boxRatio);
  return { x, y, placeholder };
}
