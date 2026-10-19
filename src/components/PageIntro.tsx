import { type ReactNode } from "react";
import { Stitch } from "@/components/Stitch";
import { cn } from "@/lib/utils";

interface PageIntroProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
  className?: string;
}

/** Opening of an inner page: a left-aligned title like a book's half-title, with an optional note on the right. */
export function PageIntro({ eyebrow, title, lead, aside, className }: PageIntroProps) {
  return (
    <header className={cn("wrap pb-14 pt-12 lg:pb-20 lg:pt-20", className)}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="enter lg:col-span-8">
          {eyebrow && (
            <p className="eyebrow mb-6 flex items-center gap-3 text-burgundy">
              <Stitch pattern="rosette" className="h-[11px]" />
              {eyebrow}
            </p>
          )}
          <h1 className="h-page text-balance">{title}</h1>
          {lead && (
            <div className="mt-7 max-w-[38rem] font-sans text-[16px] leading-[1.75] text-ink-soft lg:text-[17px]">{lead}</div>
          )}
        </div>
        {aside && (
          <div className="enter lg:col-span-4" style={{ animationDelay: "120ms" }}>
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
