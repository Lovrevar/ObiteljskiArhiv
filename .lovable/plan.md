## Cilj

Umjesto stvarne prodaje, storefront prelazi u **waitlist mode**. Cilj je validirati potražnju i skupiti dovoljno emailova prije nego što se knjige pošalju u print. Svaki email se sprema kao Shopify kupac s tagom `waitlist` kako bi ih poslije lako izvezao i kontaktirao.

## Što se mijenja u iskustvu

**Trgovina i product stranice**

- Gumbi "Dodaj u košaricu", "Kupi kolekciju", "Naruči sada" ostaju vidljivi (isti dizajn), ali klik više ne dodaje ništa u Shopify košaricu.
- Klik otvara **elegantni modal** u stilu Obiteljska Arhiva.

**Modal (glavni element)**

- Naslov: "Budite među prvima koji će sačuvati svoju obiteljsku priču"
- Kratka priča: objašnjenje da knjigu ne printamo dok se ne skupi dovoljno obitelji koje je zaista žele — tako svaki primjerak zadržava premium kvalitetu papira, uveza i pažnje.
- Obećanje: "Kad krene prvi tiskani krug, ostavljeni pretplatnici prvi dobivaju poziv i **30% popusta** kao zahvalu za povjerenje."
- Polje za email + gumb "Rezerviraj svoje mjesto".
- Tanka linija ispod: koliko je obitelji već rezerviralo (opcionalni brojač, vidi Tehnički dio).
- Nakon uspješne prijave: prikaz zahvale, "Javljamo ti se čim krene prvi tisak."

**Košarica i checkout stranice**

- `CartDrawer` (ikona košarice u header-u) se skriva iz layouta.
- Ruta `/checkout` (ako postoji) se preusmjerava na home.
- Zustand cart store ostaje u kodu (za lakše vraćanje kasnije), ali `addItem` više ne zove Shopify Cart API — samo otvara modal.

**Ostalo**

- Home hero CTA "Kupi svoju priču" postaje "Rezerviraj svoje mjesto" i otvara isti modal.
- U footeru ostaje diskretna napomena: "Trenutno u fazi pretplate — prvi tisak kreće čim skupimo dovoljno obitelji."

## Tehnički dio

**Novi edge function `waitlist-signup`**

- Prima `{ email, source }` (source = "hero", "product:handle", "collection-builder").
- Validira email s Zod-om.
- Poziva Shopify Admin REST/GraphQL API za kreiranje kupca:
  - `POST /admin/api/2025-07/customers.json` s `email`, `tags: "waitlist,source:<source>"`, `accepts_marketing: true`, `marketing_opt_in_level: "single_opt_in"`.
  - Ako kupac s tim emailom već postoji (422 "email has already been taken"), dohvaća ga i dodaje mu tag `waitlist` ako ga nema — ne bacamo grešku prema korisniku.
- Vraća `{ ok: true, total: <broj waitlist kupaca> }`. Brojač se dohvaća s `GET /admin/api/2025-07/customers/search.json?query=tag:waitlist&limit=1` uz `X-Shopify-Api-Features` ili preko GraphQL `customers(query: "tag:waitlist")` s `pageInfo` — dovoljno za grubi broj.

**Shopify Admin token**

- Potreban je Shopify **Admin API access token** s `write_customers` scope-om. Ovo je odvojeno od Storefront tokena koji već koristimo.
- Traži se preko `add_secret` kao `SHOPIFY_ADMIN_ACCESS_TOKEN` — objasnit ću u chatu gdje ga generirati (Shopify admin → Settings → Apps and sales channels → Develop apps → Create app → Admin API scopes → `write_customers`, `read_customers` → Install → kopiraj token).
- Domena store-a se već zna iz projekta (`SHOPIFY_STORE_PERMANENT_DOMAIN`).

**Frontend**

- Novi komponent `src/components/WaitlistModal.tsx` — kontroliran preko lightweight Zustand store-a `useWaitlistStore` (open/close + last source).
- Novi hook `src/hooks/useOpenWaitlist.ts` — koristi ga bilo koji CTA da otvori modal s odgovarajućim `source`.
- Ažurira se:
  - `ProductPage` — sve "Dodaj u košaricu" / "Kupi" gumbe.
  - `ShopPage` — collection builder "Dodaj kolekciju od X knjiga".
  - `Home` — hero CTA.
  - `Header` — skriva se `CartDrawer`.
- Modal koristi postojeći shadcn `Dialog`, warm ivory paletu, Cormorant naslov, Inter body — isti brand jezik.
- Toast poruke i validacija: Zod (`z.string().email().max(255)`), poruke na hrvatskom.

**Cloud (Lovable Cloud)**

- Cloud MORA biti uključen prije nego se doda edge function. Ako nije, uključit ću ga automatski kao dio implementacije, bez zaustavljanja.
- Nema vlastite baze — Shopify je izvor istine.

**Sigurnost**

- Rate-limit na edge functionu (jednostavan in-memory throttle po IP-u nije pouzdan na edge; umjesto toga oslanjamo se na Shopify koji odbija duplikate + Zod validaciju + CORS).
- Nikad ne izlažemo Admin token frontendu.

## Kako izgleda povratak u "pravu prodaju"

Kad odlučiš pokrenuti tisak:

1. Izvezeš waitlist kupce iz Shopify admina (filter po tagu `waitlist`).
2. Kreiraš 30% discount kod za customer group s tagom `waitlist`.
3. Ja u jednoj poruci vraćam `addItem` da opet zove Shopify Cart API i vraćam `CartDrawer` u header — cijela infrastruktura je i dalje u kodu.

## Što ću trebati od tebe

- Potvrdu da krenem (nakon toga uključujem Cloud i tražim Shopify Admin token).
- Shopify Admin API token — kad stigneš do tog koraka, dat ću ti točne upute gdje ga generirati.
