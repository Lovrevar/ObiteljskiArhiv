import { useLayoutEffect, useRef, useState, type ComponentProps, type MouseEvent, type PointerEvent } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ZoomIn, ZoomOut } from "lucide-react";
import { Picture } from "@/components/Picture";
import { type LocalImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import { spotOf, type Spot } from "@/lib/zoom";

/** Zoomed-in width: from about 1800px the printed questions read comfortably. */
const MIN_ZOOM_WIDTH = 1800;
/** Narrower than this, the whole photo is too small to read, so it opens zoomed in. */
const READABLE_WIDTH = 900;

/** Width of the whole photo fitted to the screen; mirrors the max-width and max-height classes on the picture. */
function fittedWidth(image: LocalImage) {
  const gutter = window.innerWidth < 640 ? 40 : 80;
  return Math.min(window.innerWidth - gutter, (window.innerHeight - 136) * (image.width / image.height));
}

const zoomWidthFor = (fitted: number) => Math.max(MIN_ZOOM_WIDTH, Math.round(fitted * 1.75));

interface LightboxProps {
  image: LocalImage | null;
  spot?: Spot;
  /** small sans label before the caption, e.g. "Poglavlje 4" */
  label?: string;
  caption?: string;
  onClose: () => void;
}

/**
 * A photograph shown full screen, so the printed pages can actually be read.
 * Clicking the picture zooms in on that spot; drag (or swipe) to move around.
 */
export function Lightbox({ image, spot, label, caption, onClose }: LightboxProps) {
  return (
    <DialogPrimitive.Root open={Boolean(image)} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-ink data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col text-paper outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0"
        >
          {image && <LightboxView image={image} spot={spot} label={label} caption={caption} onClose={onClose} />}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Mounted afresh each time the lightbox opens, so it always starts from the spot that was tapped. */
function LightboxView({ image, spot, label, caption, onClose }: LightboxProps & { image: LocalImage }) {
  const [zoomWidth, setZoomWidth] = useState<number | null>(() => {
    const fitted = fittedWidth(image);
    return fitted < READABLE_WIDTH ? zoomWidthFor(fitted) : null;
  });
  const scroller = useRef<HTMLDivElement>(null);
  const picture = useRef<HTMLImageElement>(null);
  const focus = useRef({ x: spot?.x ?? 0.5, y: spot?.y ?? 0.5 });
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const dragged = useRef(false);
  const zoomed = zoomWidth !== null;

  // bring the spot that was clicked to the middle of the screen
  useLayoutEffect(() => {
    const el = scroller.current;
    const img = picture.current;
    if (!zoomed || !el || !img) return;
    el.scrollLeft = img.offsetLeft + focus.current.x * img.offsetWidth - el.clientWidth / 2;
    el.scrollTop = img.offsetTop + focus.current.y * img.offsetHeight - el.clientHeight / 2;
  }, [zoomed]);

  const toggleZoom = (x = 0.5, y = 0.5) => {
    if (zoomed) {
      setZoomWidth(null);
      return;
    }
    focus.current = { x, y };
    setZoomWidth(zoomWidthFor(fittedWidth(image)));
  };

  const onPictureClick = (event: MouseEvent<HTMLImageElement>) => {
    event.stopPropagation();
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    toggleZoom((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
  };

  const onBackdropClick = () => {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    if (!zoomed) onClose();
  };

  // touch screens scroll natively; a mouse drags the zoomed page around
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    if (!zoomed || !el || event.pointerType !== "mouse" || event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, left: el.scrollLeft, top: el.scrollTop };
    dragged.current = false;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = scroller.current;
    const start = drag.current;
    if (!el || !start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!dragged.current && Math.abs(dx) + Math.abs(dy) > 4) {
      dragged.current = true;
      // capture only once it is a real drag, so a plain click still lands on the picture
      el.setPointerCapture(event.pointerId);
    }
    el.scrollLeft = start.left - dx;
    el.scrollTop = start.top - dy;
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <>
      <div
        ref={scroller}
        onClick={onBackdropClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "relative flex min-h-0 flex-1 overflow-auto overscroll-contain",
          zoomed ? "cursor-grab active:cursor-grabbing" : "items-center justify-center px-5 pt-16 sm:px-10",
        )}
      >
        <img
          ref={picture}
          src={image.src}
          srcSet={image.srcSet}
          sizes={zoomed ? `${zoomWidth}px` : "100vw"}
          width={image.width}
          height={image.height}
          alt={image.alt}
          draggable={false}
          onClick={onPictureClick}
          // the copy already on the page shows underneath until the sharp one has loaded
          style={{
            width: zoomWidth ?? undefined,
            backgroundImage: spot?.placeholder ? `url("${spot.placeholder}")` : undefined,
            backgroundSize: "100% 100%",
          }}
          className={cn(
            "h-auto select-none",
            zoomed
              ? "m-auto max-w-none shrink-0 cursor-zoom-out"
              : "max-h-[calc(100dvh-8.5rem)] w-auto max-w-full cursor-zoom-in object-contain",
          )}
        />
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-4 sm:px-10 sm:py-5">
        <DialogPrimitive.Title className={cn("flex items-baseline gap-3", !caption && "sr-only")}>
          {label && <span className="font-sans text-[12px] text-paper/60">{label}</span>}
          <span className="font-serif text-[17px] italic">{caption ?? image.alt}</span>
        </DialogPrimitive.Title>
        <p className="font-sans text-[12px] text-paper/60">
          {zoomed ? "Povucite za pomicanje, kliknite za cijelu stranicu" : "Kliknite na sliku za povećanje"}
        </p>
      </div>

      <div className="absolute right-3 top-3 flex gap-1 sm:right-5 sm:top-4">
        <button
          type="button"
          onClick={() => toggleZoom()}
          aria-label={zoomed ? "Smanji" : "Povećaj"}
          className="flex h-11 w-11 items-center justify-center bg-ink/70 text-paper/80 transition-colors hover:text-paper"
        >
          {zoomed ? <ZoomOut className="h-5 w-5" strokeWidth={1.4} /> : <ZoomIn className="h-5 w-5" strokeWidth={1.4} />}
        </button>
        <DialogPrimitive.Close
          aria-label="Zatvori"
          className="flex h-11 w-11 items-center justify-center bg-ink/70 text-paper/80 transition-colors hover:text-paper"
        >
          <X className="h-5 w-5" strokeWidth={1.4} />
        </DialogPrimitive.Close>
      </div>
    </>
  );
}

/** The small "Povećaj" tag in the corner of a photograph that opens in the lightbox. */
export function ZoomHint() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 bg-paper/90 px-2.5 py-1.5 font-sans text-[12px] text-ink transition-colors group-hover:bg-paper"
    >
      <ZoomIn className="h-3.5 w-3.5" strokeWidth={1.5} />
      Povećaj
    </span>
  );
}

interface ZoomablePictureProps extends ComponentProps<typeof Picture> {
  label?: string;
  caption?: string;
}

/** A photograph that opens full screen when clicked. */
export function ZoomablePicture({ label, caption, ...picture }: ZoomablePictureProps) {
  const [spot, setSpot] = useState<Spot | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={(event) => setSpot(spotOf(event, picture.image))}
        aria-label={`Povećaj: ${caption ?? picture.alt ?? picture.image.alt}`}
        className="group relative block w-full cursor-zoom-in"
      >
        <Picture {...picture} />
        <ZoomHint />
      </button>
      <Lightbox
        image={spot ? picture.image : null}
        spot={spot ?? undefined}
        label={label}
        caption={caption}
        onClose={() => setSpot(null)}
      />
    </>
  );
}
