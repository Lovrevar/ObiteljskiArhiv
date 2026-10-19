import { toast } from "sonner";

// Storefront tokens are public by design (they ship to the browser). The defaults are the
// token Lovable set up; set VITE_SHOPIFY_* in Vercel to switch to a token you own.
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || "2025-07";
const SHOPIFY_STORE_PERMANENT_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || "54i1s7-ec.myshopify.com";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || "4c534aa024dbc346c88d1615cd57b862";

export interface CartAttribute {
  key: string;
  value: string;
}

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
          width: number | null;
          height: number | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Kupnja trenutno nije dostupna", {
      description: "Trgovina treba aktivan Shopify plan. Pokušajte kasnije ili nam se javite.",
      position: "top-center",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
  }

  return data;
}

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 25) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 25) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) {
      id
      totalQuantity
      discountCodes {
        code
        applicable
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id attributes { key value } merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id attributes { key value } merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_DISCOUNT_CODES_UPDATE = `
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart { id }
      userErrors { field message }
    }
  }
`;

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

interface UserError {
  field: string[] | null;
  message: string;
}

function isCartNotFoundError(userErrors: UserError[]): boolean {
  return userErrors.some((error) => error.message.toLowerCase().includes("cart not found") || error.message.toLowerCase().includes("does not exist"));
}

function buildCartLineInput(item: { variantId: string; quantity: number; attributes?: CartAttribute[] }) {
  return {
    quantity: item.quantity,
    merchandiseId: item.variantId,
    ...(item.attributes?.length ? { attributes: item.attributes } : {}),
  };
}

export async function createShopifyCart(item: { variantId: string; quantity: number; attributes?: CartAttribute[] }) {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [buildCartLineInput(item)] },
  });

  if (data?.data?.cartCreate?.userErrors?.length > 0) return null;

  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;

  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;

  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(cartId: string, item: { variantId: string; quantity: number; attributes?: CartAttribute[] }) {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [buildCartLineInput(item)],
  });

  const userErrors = data?.data?.cartLinesAdd?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };

  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges || [];
  const normalizeAttributes = (attributes: CartAttribute[]) => JSON.stringify([...attributes].sort((a, b) => a.key.localeCompare(b.key)));
  const newLine = lines.find((line: { node: { attributes: CartAttribute[]; merchandise: { id: string } } }) =>
    line.node.merchandise.id === item.variantId &&
    normalizeAttributes(line.node.attributes ?? []) === normalizeAttributes(item.attributes ?? []),
  );
  return { success: true, lineId: newLine?.node?.id };
}

export async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number) {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  const userErrors = data?.data?.cartLinesUpdate?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

export async function removeLineFromShopifyCart(cartId: string, lineId: string) {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  const userErrors = data?.data?.cartLinesRemove?.userErrors || [];
  if (isCartNotFoundError(userErrors)) return { success: false, cartNotFound: true };
  if (userErrors.length > 0) return { success: false };
  return { success: true };
}

export async function applyDiscountToCart(cartId: string, discountCode: string | null): Promise<{ success: boolean }> {
  const data = await storefrontApiRequest(CART_DISCOUNT_CODES_UPDATE, {
    cartId,
    discountCodes: discountCode ? [discountCode] : [],
  });

  const userErrors = data?.data?.cartDiscountCodesUpdate?.userErrors || [];
  if (userErrors.length > 0) {
    console.error("Discount code error:", userErrors);
    return { success: false };
  }

  return { success: true };
}

export async function fetchCartStatus(cartId: string) {
  const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
  if (!data) return null;
  return data?.data?.cart;
}

// Prices as Shopify calculates them, including automatic (volume) discounts.
const CART_COST_QUERY = `
  query cartCost($id: ID!) {
    cart(id: $id) {
      cost { totalAmount { currencyCode } }
      discountAllocations {
        discountedAmount { amount }
        ... on CartAutomaticDiscountAllocation { title }
      }
      lines(first: 100) {
        edges {
          node {
            cost { subtotalAmount { amount } totalAmount { amount } }
            discountAllocations {
              discountedAmount { amount }
              ... on CartAutomaticDiscountAllocation { title }
            }
          }
        }
      }
    }
  }
`;

interface MoneyAmount {
  amount: string;
}

interface DiscountAllocation {
  discountedAmount: MoneyAmount;
  title?: string;
}

export interface CartCost {
  /** merchandise before any discount */
  full: number;
  /** what the customer pays for merchandise (shipping is added at checkout) */
  total: number;
  discount: number;
  currencyCode: string;
  discountTitles: string[];
}

const toCents = (value: number) => Math.round(value * 100) / 100;

export async function fetchCartCost(cartId: string): Promise<CartCost | null> {
  const data = await storefrontApiRequest(CART_COST_QUERY, { id: cartId });
  const cart = data?.data?.cart;
  if (!cart) return null;

  const lines: Array<{ cost: { subtotalAmount: MoneyAmount; totalAmount: MoneyAmount }; discountAllocations: DiscountAllocation[] }> =
    cart.lines.edges.map((edge: { node: unknown }) => edge.node);
  const cartAllocations: DiscountAllocation[] = cart.discountAllocations ?? [];

  const full = lines.reduce((sum, line) => sum + parseFloat(line.cost.subtotalAmount.amount), 0);
  const afterLineDiscounts = lines.reduce((sum, line) => sum + parseFloat(line.cost.totalAmount.amount), 0);
  const cartLevelDiscount = cartAllocations.reduce((sum, allocation) => sum + parseFloat(allocation.discountedAmount.amount), 0);
  const total = afterLineDiscounts - cartLevelDiscount;

  const discountTitles = [...lines.flatMap((line) => line.discountAllocations), ...cartAllocations]
    .map((allocation) => allocation.title)
    .filter((title): title is string => Boolean(title));

  return {
    full: toCents(full),
    total: toCents(total),
    discount: toCents(Math.max(0, full - total)),
    currencyCode: cart.cost?.totalAmount?.currencyCode ?? "EUR",
    discountTitles: [...new Set(discountTitles)],
  };
}

export const LEGACY_AUTO_APPLIED_DISCOUNT_CODES = [
  "OBITELJ3",
  "OBITELJ5",
  "OBITELJ8",
  "XK7R2M9P4W3Q",
  "VN5T8J1L6H2F",
  "BW4E9C3Y7A8D",
] as const;

export const DISCOUNT_TIERS = [
  { minQty: 1, discount: 0, label: "1-4 knjige" },
  { minQty: 5, discount: 15, label: "5+ knjiga" },
  { minQty: 10, discount: 20, label: "10+ knjiga" },
] as const;

export function getDiscountForQuantity(qty: number) {
  const tier = [...DISCOUNT_TIERS].reverse().find((item) => qty >= item.minQty);
  return tier || DISCOUNT_TIERS[0];
}

export function formatCollectionQuantityLabel(quantity: number) {
  if (quantity === 1) return "1 knjiga";
  if (quantity >= 2 && quantity <= 4) return `${quantity} knjige`;
  return `${quantity} knjiga`;
}
