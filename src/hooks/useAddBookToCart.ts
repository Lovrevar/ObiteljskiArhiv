import { useCartStore } from '@/stores/cartStore';
import { type ShopifyProduct } from '@/lib/shopify';

export function useAddBookToCart() {
  const addItem = useCartStore((state) => state.addItem);
  const isBusy = useCartStore((state) => state.isLoading || state.isSyncing);

  const addBook = async (product: ShopifyProduct, quantity = 1) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant?.availableForSale || isBusy) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions,
    });
  };

  return { addBook, isBusy };
}