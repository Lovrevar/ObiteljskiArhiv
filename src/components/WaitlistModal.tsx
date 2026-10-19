import { useState, useEffect } from "react";
import { z } from "zod";
import { Loader2, Mail, Sparkles, X, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useWaitlistStore } from "@/stores/waitlistStore";

const emailSchema = z.string().trim().email("Molimo unesite ispravnu email adresu").max(255);

type Status = "idle" | "loading" | "success" | "error";

export function WaitlistModal() {
  const { isOpen, source, close } = useWaitlistStore();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // reset after close animation
      const t = setTimeout(() => {
        setEmail("");
        setStatus("idle");
        setMessage(null);
      }, 200);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Neispravan email");
      return;
    }
    setStatus("loading");
    setMessage(null);
    try {
      const { data, error } = await supabase.functions.invoke("waitlist-signup", {
        body: { email: parsed.data, source },
      });
      if (error || !data?.ok) {
        setStatus("error");
        setMessage(data?.error || "Došlo je do greške. Pokušajte ponovno.");
        return;
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage("Došlo je do greške. Pokušajte ponovno.");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
    >
      <button
        type="button"
        aria-label="Zatvori"
        onClick={close}
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm animate-in fade-in duration-200"
      />
      <div className="relative w-full max-w-xl bg-ivory rounded-sm shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Zatvori"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 sm:p-12">
          {status === "success" ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-6">
                <Check className="w-6 h-6 text-gold" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-foreground leading-tight">
                Vaše mjesto je rezervirano
              </h2>
              <p className="mt-4 font-sans text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                Prvi tiskani krug stiže uskoro, usavršavamo kvalitetu do posljednjeg detalja. Javljamo vam se osobno
                čim knjige budu spremne za narudžbu. Kao zahvala za povjerenje, dobit ćete{" "}
                <span className="text-gold font-medium">30% popusta</span> na prvu narudžbu.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-8 inline-flex items-center justify-center px-8 py-3 border border-charcoal text-charcoal font-sans text-sm tracking-wide rounded-sm hover:bg-charcoal/5 transition-colors"
              >
                Nastavi razgledavati
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-gold text-xs font-sans tracking-widest uppercase mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Rani pristup
              </div>
              <h2 id="waitlist-title" className="font-serif text-2xl sm:text-3xl text-foreground leading-tight">
                Pridružite se prvom izdanju Obiteljskog Arhiva
              </h2>
              <div className="mt-5 space-y-3 font-sans text-sm text-muted-foreground leading-relaxed">
                <p>
                  Obiteljski Arhiv nalazi se u završnoj fazi pripreme. Posvećujemo vrijeme svakom detalju kako bi knjiga
                  bila nešto što ćete s ponosom čuvati desetljećima.
                </p>
                <p>
                  Prijavite se na listu ranog pristupa i bit ćete među prvima koji će dobiti obavijest kada otvorimo
                  narudžbe.
                </p>
                <p className="text-foreground">
                  Kao zahvalu za povjerenje,{" "}
                  <span className="text-gold font-medium">prvi kupci ostvaruju 30% popusta</span>.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === "error") setStatus("idle");
                    }}
                    placeholder="vasa@email.com"
                    disabled={status === "loading"}
                    className="w-full pl-10 pr-4 py-3.5 bg-background border border-border rounded-sm font-sans text-sm focus:outline-none focus:border-charcoal transition-colors disabled:opacity-50"
                    aria-label="Email adresa"
                    autoFocus
                  />
                </div>
                {status === "error" && message && <p className="text-xs font-sans text-destructive">{message}</p>}
                <button
                  type="submit"
                  disabled={status === "loading" || !email}
                  className="w-full py-3.5 bg-charcoal text-primary-foreground font-sans text-sm tracking-wide rounded-sm hover:bg-charcoal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Rezerviraj svoje mjesto"}
                </button>
                <p className="text-[11px] font-sans text-muted-foreground/70 text-center leading-relaxed">
                  Bez spama. Samo jedna poruka, kad knjige budu spremne za narudžbu.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
