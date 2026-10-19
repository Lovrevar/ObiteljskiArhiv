import { Link } from "react-router-dom";
import { useCookieConsentStore } from "@/stores/cookieConsentStore";

export function CookieConsent() {
  const { status, accept, reject } = useCookieConsentStore();

  if (status !== "pending") return null;

  return (
    <div
      role="region"
      aria-label="Obavijest o kolačićima"
      className="fixed inset-x-3 bottom-3 z-[90] border border-hairline bg-paper shadow-[0_20px_50px_-20px_hsl(var(--ink)/0.35)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:max-w-[420px]"
    >
      <div className="p-5 sm:p-6">
        <h2 className="font-serif text-[22px] leading-none text-ink">Kolačići</h2>
        <p className="mt-3 font-sans text-[13px] leading-relaxed text-ink-soft">
          Koristimo kolačiće kako bismo omogućili ispravno funkcioniranje stranice i analizirali korištenje. Nužni
          kolačići su uvijek aktivni. Neophodni kolačići za osnovne funkcionalnosti stranice, uključujući navigaciju,
          sigurnost i proces kupnje. Analitički i marketinški kolačići aktiviraju se tek uz vašu privolu. Više informacija
          možete pronaći na{" "}
          <Link to="/policies" className="text-ink underline decoration-ink/30 underline-offset-2">
            stranici Pravila
          </Link>
          .
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={reject} className="btn-outline min-h-[44px] px-4">
            Odbij
          </button>
          <button type="button" onClick={accept} className="btn-ink min-h-[44px] px-4">
            Prihvati sve
          </button>
        </div>
      </div>
    </div>
  );
}
