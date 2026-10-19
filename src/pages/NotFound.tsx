import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Stitch } from "@/components/Stitch";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Stranica nije pronađena (404) | Obiteljski Arhiv"
        description="Stranica koju tražite ne postoji. Vratite se na početnu ili posjetite našu trgovinu."
        path={location.pathname}
        noindex
      />
      <main className="wrap flex min-h-[70vh] flex-col justify-center py-20">
        <Stitch pattern="rosette" className="h-3" />
        <p className="mt-8 font-sans text-[13px] text-ink-soft">404</p>
        <h1 className="h-page mt-2">
          Stranica nije <span className="italic">pronađena</span>
        </h1>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to="/" className="btn-ink">
            Povratak na početnu
          </Link>
          <Link to="/shop" className="btn-outline">
            Trgovina <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </div>
      </main>
    </>
  );
};

export default NotFound;
