import { useState } from 'react';
import { toast } from 'sonner';
import { FadeIn } from '@/components/FadeIn';
import { SEO } from '@/components/SEO';
import { PageIntro } from '@/components/PageIntro';
import { Picture } from '@/components/Picture';
import { sendForm } from '@/lib/contact';
import { images } from '@/lib/images';

const benefits = [
  {
    title: 'Premium proizvod',
    text: 'Tvrdo ukoričena knjiga vrhunske izrade, stvorena da traje generacijama.',
  },
  {
    title: 'Emotivna kupnja',
    text: 'Bezvremenski poklon s trajnom sentimentalnom vrijednošću.',
  },
  {
    title: 'Potražnja tijekom cijele godine',
    text: 'Relevantno kroz sve sezone, s jakim vrhuncima (Božić, Majčin dan, Očev dan, rođendani).',
  },
  {
    title: 'Marketinška podrška',
    text: 'Profesionalne fotografije proizvoda i promotivni materijali na raspolaganju.',
  },
  {
    title: 'Dugoročno partnerstvo',
    text: 'Gradimo brand, ne prodajemo samo proizvod.',
  },
];

const idealPartners = [
  'Knjižare',
  'Poklon trgovine',
  'Cvjećarne',
  'Muzejske trgovine',
  'Concept store',
  'Online trgovine',
  'Distributeri',
  'Maloprodajni lanci',
  'Dobavljači korporativnih poklona',
];

export default function PartnersPage() {
  const [form, setForm] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await sendForm({ type: 'partner', ...form });
      toast.success('Prijava zaprimljena', {
        description: 'Javit ćemo vam se s informacijama o partnerstvu.',
        position: 'top-center',
      });
      setForm({ company: '', contact: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Slanje nije uspjelo', {
        description: 'Pokušajte ponovno ili nam pišite izravno na info@obiteljski-arhiv.com',
        position: 'top-center',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <SEO
        title="Postanite partner: B2B suradnja | Obiteljski Arhiv"
        description="Obiteljski Arhiv traži dugoročne partnere: knjižare, poklon trgovine, muzeje, concept store i lance. Ponudite svojim kupcima premium knjigu obiteljskog nasljeđa."
        path="/partners"
        keywords="B2B partnerstvo, veleprodaja, knjižare, poklon trgovine, distribucija, obiteljski arhiv"
      />

      <PageIntro
        eyebrow="ZA POSLOVNE PARTNERE"
        title={<>Postanite prodajni <span className="italic">partner</span></>}
        lead="Pomozite svojim kupcima sačuvati priče njihovih obitelji za generacije."
      />

      <section className="pb-24 lg:pb-32">
        <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <FadeIn>
              <div className="space-y-5 font-sans text-[16px] leading-[1.75] text-ink-soft">
                <p className="font-serif text-[23px] leading-[1.45] text-ink">
                  Obiteljski Arhiv traži dugoročne partnere koji žele ponuditi jedinstven, premium proizvod snažne
                  emocionalne vrijednosti.
                </p>
                <p>
                  Osmišljen kao smislen poklon za roditelje, bake, djedove i najmilije, Obiteljski Arhiv savršeno se
                  uklapa u knjižare, poklon trgovine, concept store, muzeje, cvjećarne, online trgovine i velike
                  maloprodajne lance.
                </p>
                <p>
                  Tražimo partnere koji dijele našu viziju čuvanja obiteljskih priča i stvaranja proizvoda koji postaju
                  obiteljsko naslijeđe.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.05}>
              <figure className="mt-12">
                <Picture image={images.shelfHomeRed} sizes="(min-width: 1024px) 48vw, 100vw" className="aspect-[5/4] w-full object-cover" />
                <figcaption className="caption mt-3">Moja priča, bordo izdanje na kućnoj polici</figcaption>
              </figure>
            </FadeIn>

            <FadeIn delay={0.05}>
              <h2 className="h-sub mt-16">Zašto surađivati s nama?</h2>
              <dl className="mt-6 border-t border-ink/70">
                {benefits.map(({ title, text }) => (
                  <div key={title} className="grid gap-1 border-b border-hairline py-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
                    <dt className="font-serif text-[19px] leading-snug text-ink">{title}</dt>
                    <dd className="font-sans text-[14px] leading-relaxed text-ink-soft">{text}</dd>
                  </div>
                ))}
              </dl>
            </FadeIn>

            <FadeIn delay={0.05}>
              <h2 className="h-sub mt-16">Idealni partneri</h2>
              <p className="mt-5 font-serif text-[22px] leading-[1.55] text-ink">
                {idealPartners.map((partner, i) => (
                  <span key={partner}>
                    {partner}
                    {i < idealPartners.length - 1 && <span className="ml-2 text-burgundy/60">·</span>}{' '}
                  </span>
                ))}
              </p>
            </FadeIn>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <FadeIn delay={0.1} className="lg:sticky lg:top-28">
              <div className="border border-hairline bg-paper-deep/50 p-6 sm:p-10">
                <h2 className="h-sub">Surađujmo zajedno</h2>
                <p className="mt-3 font-sans text-[14px] leading-relaxed text-ink-soft">
                  Zainteresirani ste za prodaju Obiteljskog Arhiva? Recite nam nešto o vašem poslovanju i javit ćemo vam
                  se s informacijama o partnerstvu.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-7">
                  <div>
                    <label htmlFor="partner-company" className="field-label">Naziv tvrtke</label>
                    <input
                      id="partner-company"
                      type="text"
                      required
                      maxLength={120}
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="field"
                    />
                  </div>
                  <div>
                    <label htmlFor="partner-contact" className="field-label">Kontakt osoba</label>
                    <input
                      id="partner-contact"
                      type="text"
                      required
                      maxLength={100}
                      autoComplete="name"
                      value={form.contact}
                      onChange={(e) => setForm({ ...form, contact: e.target.value })}
                      className="field"
                    />
                  </div>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <div>
                      <label htmlFor="partner-email" className="field-label">Email</label>
                      <input
                        id="partner-email"
                        type="email"
                        required
                        maxLength={255}
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="field"
                      />
                    </div>
                    <div>
                      <label htmlFor="partner-phone" className="field-label">
                        Telefon <span className="font-normal">(neobavezno)</span>
                      </label>
                      <input
                        id="partner-phone"
                        type="tel"
                        maxLength={40}
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="field"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="partner-message" className="field-label">Poruka</label>
                    <textarea
                      id="partner-message"
                      required
                      rows={4}
                      maxLength={1500}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="field resize-none bg-[repeating-linear-gradient(transparent,transparent_31px,hsl(var(--hairline))_31px,hsl(var(--hairline))_32px)] leading-[32px]"
                    />
                  </div>

                  <button type="submit" disabled={submitting} className="btn-ink w-full">
                    {submitting ? 'Šaljem…' : 'Postanite partner'}
                  </button>

                  <p className="font-sans text-[13px] leading-relaxed text-ink-soft">
                    Odgovaramo osobno unutar nekoliko radnih dana. Ili nam pišite izravno:{' '}
                    <a href="mailto:info@obiteljski-arhiv.com" className="text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-burgundy">
                      info@obiteljski-arhiv.com
                    </a>
                  </p>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}
