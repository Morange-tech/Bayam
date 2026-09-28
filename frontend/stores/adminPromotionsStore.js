import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { promotions } from '@/lib/mock/admin'

const useAdminPromotionsStore = create(
  persist(
    (set) => ({
      promotions,
      hasHydrated: false,

      addPromotion: (promotion) =>
        set((state) => ({
          promotions: [
            { ...promotion, id: `promo-${Date.now()}`, currentUses: 0, active: true },
            ...state.promotions,
          ],
        })),

      toggleActive: (id) =>
        set((state) => ({
          promotions: state.promotions.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
        })),

      deletePromotion: (id) =>
        set((state) => ({
          promotions: state.promotions.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'bayam-admin-promotions',
    }
  )
)

// Reading `useAdminPromotionsStore` from inside `onRehydrateStorage` races the `const` assignment above
// (persist can rehydrate synchronously, before `create()` returns) and throws a TDZ ReferenceError,
// silently leaving hasHydrated stuck at false. Attaching the listener afterwards avoids that.
// Guarded by `window` since zustand's default storage getter (`() => window.localStorage`) throws
// during SSR, which makes `persist` skip attaching `.persist` at all on the server.
if (typeof window !== 'undefined') {
  useAdminPromotionsStore.persist.onFinishHydration(() => useAdminPromotionsStore.setState({ hasHydrated: true }))
  if (useAdminPromotionsStore.persist.hasHydrated()) {
    useAdminPromotionsStore.setState({ hasHydrated: true })
  }
}

export default useAdminPromotionsStore
