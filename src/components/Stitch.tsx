import { cn } from "@/lib/utils";

/*
  Cross-stitch ornaments in the manner of the vez printed beside every chapter
  title in the book. Each "x" is drawn as two crossed threads on a grid, so the
  motif reads as embroidery rather than as an icon.
*/
const PATTERNS = {
  // the small double rosette that sits next to chapter headings
  rosette: [
    "..x.....x..",
    ".xxx...xxx.",
    "xx.xx.xx.xx",
    ".xxx.x.xxx.",
    "xx.xx.xx.xx",
    ".xxx...xxx.",
    "..x.....x..",
  ],
  // a single diamond
  diamond: ["...x...", "..x.x..", ".x.x.x.", "x.x.x.x", ".x.x.x.", "..x.x..", "...x..."],
  // a repeating border unit; tiled horizontally
  band: ["x...x...", ".x.x.x.x", "..x...x.", ".x.x.x.x", "x...x..."],
} as const;

type PatternName = keyof typeof PATTERNS;

interface StitchProps {
  pattern?: PatternName;
  /** horizontal repeats, for borders */
  repeat?: number;
  className?: string;
  title?: string;
}

export function Stitch({ pattern = "rosette", repeat = 1, className, title }: StitchProps) {
  const rows = PATTERNS[pattern];
  const unitWidth = rows[0].length;
  const cols = unitWidth * repeat;
  const cell = 10;
  const inset = 2;

  let d = "";
  rows.forEach((row, y) => {
    for (let x = 0; x < cols; x++) {
      if (row[x % unitWidth] !== "x") continue;
      const left = x * cell + inset;
      const top = y * cell + inset;
      const size = cell - inset * 2;
      d += `M${left} ${top}l${size} ${size}M${left + size} ${top}l${-size} ${size}`;
    }
  });

  return (
    <svg
      viewBox={`0 0 ${cols * cell} ${rows.length * cell}`}
      className={cn("inline-block h-3 w-auto shrink-0 text-burgundy", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <path d={d} stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** A horizontal stitched rule that fills its container. */
export function StitchRule({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-4 text-burgundy", className)}>
      <span className="h-px flex-1 bg-current opacity-25" />
      <Stitch pattern="rosette" className="h-2.5 text-current" />
      <span className="h-px flex-1 bg-current opacity-25" />
    </div>
  );
}
