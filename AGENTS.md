# Architecture rules
- Purchase actions use the existing Shopify Storefront cart store and open its shared drawer after successful additions, so checkout always uses the API-issued URL.
- Individual-book CTAs share useAddBookToCart; collection purchases use a real bundle variant with composition attributes, preventing reusable discount-code abuse.
- Volume discounts on single books (5+ 15%, 10+ 20%) come from Shopify automatic discounts limited to the two book products, never from codes; the cart drawer shows Shopify's calculated totals via useCartCost.
- Keep legacy waitlist code and collected signups inactive rather than deleting customer data, so the live storefront never depends on reservations.