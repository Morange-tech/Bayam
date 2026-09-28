import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { adminOrders } from '@/lib/mock/admin'

const useAdminOrdersStore = create(
  persist(
    (set) => ({
      orders: adminOrders,
      hasHydrated: false,

      updateStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) => (order.id === id ? { ...order, status } : order)),
        })),
    }),
    {
      name: 'bayam-admin-orders',
    }
  )
)

// Reading `useAdminOrdersStore` from inside `onRehydrateStorage` races the `const` assignment above
// (persist can rehydrate synchronously, before `create()` returns) and throws a TDZ ReferenceError,
// silently leaving hasHydrated stuck at false. Attaching the listener afterwards avoids that.
// Guarded by `window` since zustand's default storage getter (`() => window.localStorage`) throws
// during SSR, which makes `persist` skip attaching `.persist` at all on the server.
if (typeof window !== 'undefined') {
  useAdminOrdersStore.persist.onFinishHydration(() => useAdminOrdersStore.setState({ hasHydrated: true }))
  if (useAdminOrdersStore.persist.hasHydrated()) {
    useAdminOrdersStore.setState({ hasHydrated: true })
  }
}

export default useAdminOrdersStore
