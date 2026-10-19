import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';
import {
  type CartAttribute,
  type ShopifyProduct,
  LEGACY_AUTO_APPLIED_DISCOUNT_CODES,
  addLineToShopifyCart,
  applyDiscountToCart,
  createShopifyCart,
  fetchCartStatus,
  removeLineFromShopifyCart,
  updateShopifyCartLine,
} from '@/lib/shopify';

export interface CartItem {
  lineId: string | null;
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: { amount: string; currencyCode: string };
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
  attributes?: CartAttribute[];
  bundleSize?: number;
}

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'lineId'>) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

const serializeAttributes = (attributes?: CartAttribute[]) => JSON.stringify(attributes ?? []);

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,
      isOpen: false,
      setOpen: (isOpen) => set({ isOpen }),

      addItem: async (item) => {
        if (get().isLoading || get().isSyncing) return;
        const { items, cartId, clearCart } = get();
        const existingItem = items.find(
          (currentItem) =>
            currentItem.variantId === item.variantId &&
            serializeAttributes(currentItem.attributes) === serializeAttributes(item.attributes),
        );

        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart({
              variantId: item.variantId,
              quantity: item.quantity,
              attributes: item.attributes,
            });

            if (result) {
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                items: [{ ...item, lineId: result.lineId }],
                isOpen: true,
              });
            } else {
              toast.error('Knjigu nije moguće dodati u košaricu. Pokušajte ponovno.', { position: 'top-center' });
            }
            return;
          }

          if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            if (!existingItem.lineId) return;

            const result = await updateShopifyCartLine(cartId, existingItem.lineId, newQuantity);
            if (result.success) {
              const currentItems = get().items;
              set({
                isOpen: true,
                items: currentItems.map((currentItem) =>
                  currentItem.lineId === existingItem.lineId ? { ...currentItem, quantity: newQuantity } : currentItem,
                ),
              });
            } else if (result.cartNotFound) {
              clearCart();
              toast.error('Košarica je istekla. Dodajte knjigu ponovno.', { position: 'top-center' });
            } else {
              toast.error('Količinu nije moguće ažurirati. Pokušajte ponovno.', { position: 'top-center' });
            }
            return;
          }

          const result = await addLineToShopifyCart(cartId, {
            variantId: item.variantId,
            quantity: item.quantity,
            attributes: item.attributes,
          });

          if (result.success && result.lineId) {
            const currentItems = get().items;
            set({ items: [...currentItems, { ...item, lineId: result.lineId }], isOpen: true });
          } else if (result.cartNotFound) {
            clearCart();
            toast.error('Košarica je istekla. Dodajte knjigu ponovno.', { position: 'top-center' });
          } else {
            toast.error('Knjigu nije moguće dodati u košaricu. Pokušajte ponovno.', { position: 'top-center' });
          }
        } catch (error) {
          console.error('Failed to add item:', error);
          toast.error('Dodavanje nije uspjelo. Provjerite vezu i pokušajte ponovno.', { position: 'top-center' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (lineId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(lineId);
          return;
        }

        const { items, cartId, clearCart } = get();
        const item = items.find((currentItem) => currentItem.lineId === lineId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (result.success) {
            const currentItems = get().items;
            set({
              items: currentItems.map((currentItem) =>
                currentItem.lineId === lineId ? { ...currentItem, quantity } : currentItem,
              ),
            });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error('Failed to update quantity:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (lineId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find((currentItem) => currentItem.lineId === lineId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.success) {
            const currentItems = get().items.filter((currentItem) => currentItem.lineId !== lineId);
            currentItems.length === 0 ? clearCart() : set({ items: currentItems });
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error('Failed to remove item:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),
      getCheckoutUrl: () => get().checkoutUrl,

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing || get().isLoading) return;

        set({ isSyncing: true });
        try {
          const cart = await fetchCartStatus(cartId);
          if (!cart || cart.totalQuantity === 0) {
            clearCart();
            return;
          }

          const hasLegacyAutoCode = cart.discountCodes?.some((discountCode: { code: string }) =>
            LEGACY_AUTO_APPLIED_DISCOUNT_CODES.includes(discountCode.code as (typeof LEGACY_AUTO_APPLIED_DISCOUNT_CODES)[number]),
          );

          if (hasLegacyAutoCode) {
            await applyDiscountToCart(cartId, null);
          }
        } catch (error) {
          console.error('Failed to sync cart:', error);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, cartId: state.cartId, checkoutUrl: state.checkoutUrl }),
    },
  ),
);
