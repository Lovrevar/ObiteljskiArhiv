# Architecture rules
- Purchase actions use the existing Shopify Storefront cart store and open its shared drawer after successful additions, so checkout always uses the API-issued URL.
- Individual-book CTAs share useAddBookToCart; collection purchases use a real bundle variant with composition attributes, preventing reusable discount-code abuse.
- Keep legacy waitlist code and collected signups inactive rather than deleting customer data, so the live storefront never depends on reservations.