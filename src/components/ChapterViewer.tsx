import { useState } from "react";
import { Lightbox, ZoomHint } from "@/components/Lightbox";
import { Picture } from "@/components/Picture";
import { Stitch } from "@/components/Stitch";
import { chapters, type Chapter } from "@/lib/book";
import { cn } from "@/lib/utils";

const photographed = chapters.filter((chapter): chapter is Chapter & { spread: NonNullable<Chapter["spread"]> } =>
  Boolean(chapter.spread),
);
const DEFAULT_TITLE = "Male stvari koje te čine tobom";

const chapterLabel = (chapter: Chapter) => (chapter.number ? `Poglavlje ${chapter.number}` : "Na kraju knjige");

/**
 * The book's table of contents, set like a printed "Sadržaj". Chapters we have
 * photographed open their real spread in the viewer; the rest are listed as text.
 */
export function ChapterViewer() {
  const [active, setActive] = useState(DEFAULT_TITLE);
  // keep every spread that has been opened mounted, so switching back is an instant cross-fade
  const [opened, setOpened] = useState<string[]>([DEFAULT_TITLE]);
  const [enlarged, setEnlarged] = useState<(typeof photographed)[number] | null>(null);

  const select = (title: string) => {
    setActive(title);
    setOpened((current) => (current.includes(title) ? current : [...current, title]));
  };

  const activeChapter = photographed.find((chapter) => chapter.title === active) ?? photographed[0];

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-12">
      {/* Desktop: one large spread that changes with the contents list */}
      <figure className="hidden lg:col-span-8 lg:block">
        <button
          type="button"
          onClick={() => setEnlarged(activeChapter)}
          aria-label={`Povećaj: ${activeChapter.title}`}
          className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-paper"
        >
          {photographed
            .filter((chapter) => opened.includes(chapter.title))
            .map((chapter) => (
              <Picture
                key={chapter.title}
                image={chapter.spread}
                sizes="(min-width: 1240px) 760px, 62vw"
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
                  chapter.title === active ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
          <ZoomHint />
        </button>
        <figcaption className="mt-4 flex items-baseline gap-3" aria-live="polite">
          <span className="font-sans text-[12px] text-ink-soft">{chapterLabel(activeChapter)}</span>
          <span className="caption text-[17px] text-ink">{activeChapter.title}</span>
        </figcaption>
      </figure>

      {/* Mobile: swipe through the spreads */}
      <div className="-mx-5 sm:-mx-8 lg:hidden">
        <ul className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:px-8" aria-label="Fotografirana poglavlja">
          {photographed.map((chapter) => (
            <li key={chapter.title} className="w-[84%] shrink-0 snap-center sm:w-[60%]">
              <button
                type="button"
                onClick={() => setEnlarged(chapter)}
                aria-label={`Povećaj: ${chapter.title}`}
                className="group relative block w-full"
              >
                <Picture image={chapter.spread} sizes="84vw" className="aspect-[4/3] w-full object-cover" />
                <ZoomHint />
              </button>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="font-sans text-[12px] text-ink-soft">{chapterLabel(chapter)}</span>
                <span className="caption text-ink">{chapter.title}</span>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-2 px-5 font-sans text-[12px] text-ink-soft sm:px-8">Povucite za sljedeće poglavlje</p>
      </div>

      {/* The contents page */}
      <div className="mt-14 lg:col-span-4 lg:mt-0">
        <h3 className="flex items-center gap-3 font-serif text-[26px] italic text-ink">
          Sadržaj
          <Stitch pattern="rosette" className="h-2.5" />
        </h3>
        <ol className="mt-5 border-t border-ink/70">
          {chapters.map((chapter) => {
            const isActive = chapter.title === active;
            const content = (
              <>
                <span className="num-oldstyle w-7 shrink-0 font-serif text-[17px] text-ink-soft">
                  {chapter.number ?? ""}
                </span>
                <span className="flex-1 text-left">{chapter.title}</span>
                {chapter.spread && (
                  <span
                    aria-hidden
                    className={cn(
                      "hidden h-1.5 w-1.5 shrink-0 rotate-45 transition-colors lg:block",
                      isActive ? "bg-burgundy" : "bg-ink/25 group-hover:bg-ink/60",
                    )}
                  />
                )}
              </>
            );

            return (
              <li key={chapter.title} className="border-b border-hairline">
                {chapter.spread ? (
                  <>
                    <button
                      type="button"
                      onClick={() => select(chapter.title)}
                      aria-pressed={isActive}
                      className={cn(
                        "group hidden w-full items-center gap-3 py-[9px] font-serif text-[18px] leading-snug transition-colors lg:flex",
                        isActive ? "text-burgundy" : "text-ink hover:text-burgundy",
                      )}
                    >
                      {content}
                    </button>
                    <span className="flex items-center gap-3 py-[9px] font-serif text-[18px] leading-snug text-ink lg:hidden">
                      {content}
                    </span>
                  </>
                ) : (
                  <span className="flex items-center gap-3 py-[9px] font-serif text-[18px] leading-snug text-ink/70">
                    {content}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-4 hidden font-sans text-[12px] leading-relaxed text-ink-soft lg:block">
          Označena poglavlja možete otvoriti i pogledati stvarne stranice knjige.
        </p>
      </div>

      <Lightbox
        image={enlarged?.spread ?? null}
        label={enlarged ? chapterLabel(enlarged) : undefined}
        caption={enlarged?.title}
        onClose={() => setEnlarged(null)}
      />
    </div>
  );
}
