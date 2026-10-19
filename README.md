# Obiteljski Arhiv

Storefront for obiteljski-arhiv.com. Vite + React + Tailwind front end for the Shopify store; products, cart and checkout come from the Shopify Storefront API, payment happens on Shopify's own checkout.

## Run locally

```sh
npm install
npm run dev        # http://localhost:8080 — the shop, without the contact form backend
npx vercel dev     # same, plus /api/contact (needs RESEND_API_KEY in .env.local)
```

## Deploy (Vercel)

- Framework preset **Vite**, build `npm run build`, output `dist` (also set in `vercel.json`).
- `vercel.json` sends every non-file, non-`/api` path to `index.html` so client routes like `/shop` survive a refresh.
- Environment variables: see `.env.example`. `RESEND_API_KEY` is required for the contact and partner forms.

## Where things live

- `src/lib/shopify.ts` — Storefront API queries and cart mutations
- `src/stores/cartStore.ts` — cart state, persisted in localStorage
- `api/contact.ts` — contact/partner form → email via Resend
- `src/lib/images.ts` — every photograph used on the site (WebP, in `src/assets/images`)
- `supabase/` — legacy Lovable Cloud functions and the waitlist table; not used by the live site
