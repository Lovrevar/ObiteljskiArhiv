import { useState } from "react";
import { Picture } from "@/components/Picture";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

interface CoverWindowProps {
  tone: "burgundy" | "navy";
  className?: string;
}

/**
 * The front cover has a window for a photograph of your choosing. The two
 * photographs are the same shot with and without a picture in the window,
 * so switching between them changes nothing but the window.
 */
export function CoverWindow({ tone, className }: CoverWindowProps) {
  const [withPhoto, setWithPhoto] = useState(false);
  const blank = tone === "burgundy" ? images.coverRedBlank : images.coverNavyBlank;
  const filled = tone === "burgundy" ? images.coverRed : images.coverNavy;

  return (
    <figure className={className}>
      <div className="relative aspect-[5/4] overflow-hidden bg-paper-deep">
        <Picture image={blank} sizes="(min-width: 1024px) 40vw, 100vw" className="absolute inset-0 h-full w-full object-cover" />
        <Picture
          image={filled}
          sizes="(min-width: 1024px) 40vw, 100vw"
          aria-hidden={!withPhoto}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
            withPhoto ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <span className="caption">Prorez na naslovnici za fotografiju koju odaberete</span>
        <span role="group" aria-label="Prikaz naslovnice" className="flex border border-hairline font-sans text-[12px]">
          {[
            { value: false, label: "Prazan prorez" },
            { value: true, label: "S fotografijom" },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={withPhoto === option.value}
              onClick={() => setWithPhoto(option.value)}
              className={cn(
                "px-3 py-1.5 transition-colors",
                withPhoto === option.value ? "bg-ink text-paper" : "text-ink-soft hover:text-ink",
              )}
            >
              {option.label}
            </button>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
