import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FigureCaptionProps {
  /** small sans label set before the caption, e.g. "Poglavlje 3" */
  label?: string;
  children: ReactNode;
  className?: string;
}

/** A note under a photograph: a quiet label, then the italic caption. */
export function FigureCaption({ label, children, className }: FigureCaptionProps) {
  return (
    <figcaption className={cn("mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-0.5", className)}>
      {label && <span className="font-sans text-[12px] text-ink-soft">{label}</span>}
      <span className="caption">{children}</span>
    </figcaption>
  );
}
