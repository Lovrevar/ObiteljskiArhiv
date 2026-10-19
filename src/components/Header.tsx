import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { Stitch } from "@/components/Stitch";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/shop", label: "Trgovina" },
  { to: "/how-it-works", label: "Kako funkcionira" },
  { to: "/about", label: "O nama" },
  { to: "/faq", label: "Pitanja" },
  { to: "/contact", label: "Kontakt" },
  { to: "/partners", label: "Partneri" },
];

const announcement = "Gradite obiteljsku kolekciju: 5+ knjiga 15% popusta, 10+ knjiga 20% popusta.";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <div className="bg-ink text-paper/85">
        <div className="wrap flex min-h-9 items-center justify-center py-2">
          <p className="text-center font-sans text-[12px] leading-snug tracking-[0.02em]">{announcement}</p>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 border-b bg-paper transition-colors duration-300",
          scrolled || mobileOpen ? "border-hairline" : "border-transparent",
        )}
      >
        <div className="wrap flex h-16 items-center justify-between gap-6 lg:h-[76px]">
          <Link to="/" className="group flex items-center gap-3" aria-label="Obiteljski Arhiv, početna">
            <Stitch pattern="diamond" className="h-[18px] text-burgundy" />
            <span className="font-serif text-[22px] font-medium leading-none tracking-[0.005em] text-ink lg:text-[25px]">
              Obiteljski Arhiv
            </span>
          </Link>

          <nav aria-label="Glavna navigacija" className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    "relative py-2 font-sans text-[14px] text-ink-soft transition-colors hover:text-ink",
                    "after:absolute after:inset-x-0 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-burgundy after:transition-transform after:duration-300",
                    "hover:after:scale-x-100",
                    isActive && "text-ink after:scale-x-100",
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <CartDrawer />
            <button
              type="button"
              className="-mr-2 flex h-11 w-11 items-center justify-center text-ink lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Zatvori izbornik" : "Otvori izbornik"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.5} /> : <Menu className="h-5 w-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-menu" className="h-[calc(100dvh-64px)] overflow-y-auto border-t border-hairline bg-paper lg:hidden">
            <nav aria-label="Mobilna navigacija" className="wrap flex flex-col py-6">
              {navLinks.map((link, i) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className={({ isActive }) =>
                    cn(
                      "enter flex items-baseline justify-between border-b border-hairline py-4 font-serif text-[28px] leading-tight text-ink",
                      isActive && "text-burgundy",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/shop" onClick={() => setMobileOpen(false)} className="btn-primary enter mt-8 w-full" style={{ animationDelay: "260ms" }}>
                Naručite svoju knjigu
              </Link>
              <p className="mt-6 font-sans text-[13px] text-ink-soft">
                <a href="mailto:info@obiteljski-arhiv.com" className="underline decoration-ink/25 underline-offset-4">
                  info@obiteljski-arhiv.com
                </a>
              </p>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
