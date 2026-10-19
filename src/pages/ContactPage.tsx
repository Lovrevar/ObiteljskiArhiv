import { useState } from 'react';
import { toast } from 'sonner';
import { FadeIn } from '@/components/FadeIn';
import { SEO } from '@/components/SEO';
import { PageIntro } from '@/components/PageIntro';
import { Stitch } from '@/components/Stitch';
import { sendForm } from '@/lib/contact';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', orderNumber: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await sendForm({ type: 'contact', ...form });
      toast.success('Poruka poslana', { description: 'Javit ćemo vam se uskoro.', position: 'top-center' });
      setForm({ name: '', email: '', orderNumber: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Slanje nije uspjelo', { description: 'Pokušajte ponovno ili nam pišite izravno na info@obiteljski-arhiv.com', position: 'top-center' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <SEO
        title="Kontakt: Javite nam se | Obiteljski Arhiv"
        description="Imate pitanje o knjizi uspomena, narudžbi ili poklanjanju? Javite nam se, rado ćemo vam pomoći."
        path="/contact"
        keywords="kontakt, obiteljski arhiv, podrška, pitanja"
      />

      <PageIntro
        eyebrow="KONTAKT"
        title={<>Javite <span className="italic">nam se</span></>}
        lead="Rado ćemo čuti od vas. Bilo da imate pitanje o knjizi, narudžbi, poklanjanju ili bilo čemu drugom, slobodno nam se obratite."
      />

      <section className="pb-24 lg:pb-32">
        <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-8">
          <FadeIn className="lg:col-span-7">
            {/* the form is set like a letter: ruled lines on paper */}
            <form onSubmit={handleSubmit} className="border border-hairline bg-paper p-6 sm:p-10">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="field-label">Ime</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="field-label">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="field"
                  />
                </div>
              </div>
              <div className="mt-8">
                <label htmlFor="contact-order" className="field-label">
                  Broj narudžbe <span className="font-normal">(neobavezno)</span>
                </label>
                <input
                  id="contact-order"
                  type="text"
                  value={form.orderNumber}
                  onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                  className="field"
                />
              </div>
              <div className="mt-8">
                <label htmlFor="contact-message" className="field-label">Poruka</label>
                <textarea
                  id="contact-message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="field resize-none bg-[repeating-linear-gradient(transparent,transparent_31px,hsl(var(--hairline))_31px,hsl(var(--hairline))_32px)] leading-[32px]"
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-ink mt-10 w-full sm:w-auto">
                {submitting ? 'Šaljem…' : 'Pošaljite poruku'}
              </button>
            </form>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <div className="border-t border-ink/70 pt-6">
              <Stitch pattern="rosette" className="h-3" />
              <p className="mt-6 font-sans text-[13px] text-ink-soft">Službeni email</p>
              <a
                href="mailto:info@obiteljski-arhiv.com"
                className="mt-1 inline-block break-all font-serif text-[24px] leading-snug text-ink underline decoration-ink/20 underline-offset-[6px] transition-colors hover:decoration-burgundy"
              >
                info@obiteljski-arhiv.com
              </a>
              <p className="mt-6 font-sans text-[14px] leading-relaxed text-ink-soft">
                Obično odgovaramo unutar 24 do 48 sati.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
