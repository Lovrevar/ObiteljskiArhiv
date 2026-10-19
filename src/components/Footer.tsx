import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Stitch } from "@/components/Stitch";

const footerLinks = {
  Trgovina: [
    { to: "/shop", label: "Sve knjige" },
    { to: "/shop", label: "Poklon za nju" },
    { to: "/shop", label: "Poklon za njega" },
  ],
  "O nama": [
    { to: "/about", label: "Naša priča" },
    { to: "/how-it-works", label: "Kako funkcionira" },
  ],
  Pomoć: [
    { to: "/faq", label: "Česta pitanja" },
    { to: "/contact", label: "Kontakt" },
    { to: "/partners", label: "Postanite partner" },
  ],
  Pravila: [
    { to: "/policies", label: "Dostava" },
    { to: "/policies", label: "Povrati" },
    { to: "/policies", label: "Privatnost" },
    { to: "/policies", label: "Uvjeti korištenja" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div aria-hidden className="overflow-hidden bg-paper pb-3">
        <Stitch pattern="band" repeat={140} className="block h-[9px] w-auto max-w-none text-burgundy" />
      </div>

      <div className="wrap grid gap-14 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="lg:col-span-5">
          <p className="font-serif text-[30px] leading-[1.1] text-paper lg:text-[36px]">
            Gradite obiteljski arhiv
            <br />
            <span className="italic text-paper/70">s nama.</span>
          </p>
          <p className="mt-5 max-w-sm font-sans text-[14px] leading-relaxed text-paper/65">
            Knjige su stigle. Odaberite knjigu za nekoga koga volite ili započnite kolekciju za cijelu obitelj.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 font-sans text-[14px] font-medium text-paper underline decoration-paper/30 underline-offset-[6px] transition-colors hover:decoration-paper"
          >
            Naručite svoju knjigu <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 lg:col-span-7">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h2 className="font-sans text-[12px] font-medium tracking-[0.04em] text-paper/50">{title}</h2>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="font-sans text-[14px] text-paper/80 transition-colors hover:text-paper"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="wrap flex flex-col gap-3 py-7 font-sans text-[12px] text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-serif text-[16px] text-paper/85">Obiteljski Arhiv</span>
            <span className="mx-2">·</span>© {new Date().getFullYear()} Sva prava pridržana. Obiteljski arhiv za generacije.
          </p>
          <p>
            <a href="mailto:info@obiteljski-arhiv.com" className="transition-colors hover:text-paper">
              info@obiteljski-arhiv.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
