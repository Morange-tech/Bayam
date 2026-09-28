import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { products } from '@/lib/mock/products'

// Seeds from the storefront's mock catalog so the admin table starts populated. Products created or
// edited here only affect this admin session — the public storefront still reads lib/mock/products.js
// until there's a real API to share state through.
const initialProducts = products.map((product) => ({
  ...product,
  status: product.stock === 0 ? 'hidden' : 'active',
  tags: [],
}))

const useAdminProductsStore = create(
  persist(
    (set, get) => ({
      products: initialProducts,
      hasHydrated: false,

      addProduct: (product) =>
        set((state) => ({
          products: [{ ...product, id: `p${Date.now()}` }, ...state.products],
        })),

      updateProduct: (id, updates) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      setStatus: (id, status) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, status } : p)),
        })),

      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      getProduct: (id) => get().products.find((p) => p.id === id) ?? null,
    }),
    {
      name: 'bayam-admin-products',
    }
  )
)

// Reading `useAdminProductsStore` from inside `onRehydrateStorage` races the `const` assignment above
// (persist can rehydrate synchronously, before `create()` returns) and throws a TDZ ReferenceError,
// silently leaving hasHydrated stuck at false. Attaching the listener afterwards avoids that.
// Guarded by `window` since zustand's default storage getter (`() => window.localStorage`) throws
// during SSR, which makes `persist` skip attaching `.persist` at all on the server.
if (typeof window !== 'undefined') {
  useAdminProductsStore.persist.onFinishHydration(() => useAdminProductsStore.setState({ hasHydrated: true }))
  if (useAdminProductsStore.persist.hasHydrated()) {
    useAdminProductsStore.setState({ hasHydrated: true })
  }
}

export default useAdminProductsStore
