import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/stores/cartStore';
import { fetchCartCost } from '@/lib/shopify';

/** The cart total as Shopify calculates it, refreshed whenever the lines or quantities change. */
export function useCartCost(enabled = true) {
  const cartId = useCartStore((state) => state.cartId);
  const items = useCartStore((state) => state.items);
  const signature = items.map((item) => `${item.lineId}:${item.quantity}`).join('|');

  return useQuery({
    queryKey: ['shopify-cart-cost', cartId, signature],
    queryFn: () => fetchCartCost(cartId as string),
    enabled: enabled && Boolean(cartId) && items.length > 0,
    staleTime: 30_000,
  });
}
