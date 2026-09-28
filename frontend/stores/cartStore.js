import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Mock promo codes until the Laravel API exists — swap validatePromo for an api.post() call later.
const PROMO_CODES = {
  BAYAM10: { type: 'percent', value: 10 },
  BAYAM5000: { type: 'flat', value: 5000 },
}

function computeSubtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function computeDiscount(items, promoCode) {
  const promo = promoCode && PROMO_CODES[promoCode]
  if (!promo) return 0
  const subtotal = computeSubtotal(items)
  if (promo.type === 'percent') return Math.round((subtotal * promo.value) / 100)
  return Math.min(promo.value, subtotal)
}

function sameLine(item, productId, variant) {
  return item.productId === productId && JSON.stringify(item.variant ?? null) === JSON.stringify(variant ?? null)
}

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,
      hasHydrated: false,

      // Accepts a product-shaped object (id or productId, slug, name, image, price, stock, variant) plus a quantity.
      addItem: (item, quantity = 1) =>
        set((state) => {
          const productId = item.productId ?? item.id
          const existing = state.items.find((i) => sameLine(i, productId, item.variant))

          const items = existing
            ? state.items.map((i) =>
                i === existing ? { ...i, quantity: Math.min(i.stock, i.quantity + quantity) } : i
              )
            : [
                ...state.items,
                {
                  productId,
                  slug: item.slug,
                  name: item.name,
                  image: item.image,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  quantity: Math.max(1, Math.min(item.stock ?? quantity, quantity)),
                  variant: item.variant,
                  stock: item.stock,
                },
              ]

          return { items, discount: computeDiscount(items, state.promoCode) }
        }),

      removeItem: (productId) =>
        set((state) => {
          const items = state.items.filter((i) => i.productId !== productId)
          return { items, discount: computeDiscount(items, state.promoCode) }
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => {
          const items = state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(i.stock, quantity)) } : i
          )
          return { items, discount: computeDiscount(items, state.promoCode) }
        }),

      applyPromo: async (code) => {
        const normalized = code.trim().toUpperCase()
        // Mock validation until the Laravel API exists — simulates network latency.
        await new Promise((resolve) => setTimeout(resolve, 400))

        if (!PROMO_CODES[normalized]) {
          throw new Error('Code promo invalide')
        }

        set((state) => ({
          promoCode: normalized,
          discount: computeDiscount(state.items, normalized),
        }))
      },

      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),

      subtotal: () => computeSubtotal(get().items),
      total: () => Math.max(0, computeSubtotal(get().items) - get().discount),
      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'bayam-cart',
      partialize: (state) => ({ items: state.items, promoCode: state.promoCode, discount: state.discount }),
    }
  )
)

// Reading `useCartStore` from inside `onRehydrateStorage` races the `const` assignment above
// (persist can rehydrate synchronously, before `create()` returns) and throws a TDZ ReferenceError,
// silently leaving hasHydrated stuck at false. Attaching the listener afterwards avoids that.
// Guarded by `window` since zustand's default storage getter (`() => window.localStorage`) throws
// during SSR, which makes `persist` skip attaching `.persist` at all on the server.
if (typeof window !== 'undefined') {
  useCartStore.persist.onFinishHydration(() => useCartStore.setState({ hasHydrated: true }))
  if (useCartStore.persist.hasHydrated()) {
    useCartStore.setState({ hasHydrated: true })
  }
}

export default useCartStore
