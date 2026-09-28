import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAdminNotificationsStore = create(
  persist(
    (set) => ({
      history: [],
      hasHydrated: false,

      addNotification: (notification) =>
        set((state) => ({
          history: [{ ...notification, id: `notif-${Date.now()}`, sentAt: new Date().toISOString() }, ...state.history],
        })),
    }),
    {
      name: 'bayam-admin-notifications',
    }
  )
)

// See stores/adminOrdersStore.js for why this hydration dance and the `window` guard are needed.
if (typeof window !== 'undefined') {
  useAdminNotificationsStore.persist.onFinishHydration(() => useAdminNotificationsStore.setState({ hasHydrated: true }))
  if (useAdminNotificationsStore.persist.hasHydrated()) {
    useAdminNotificationsStore.setState({ hasHydrated: true })
  }
}

export default useAdminNotificationsStore
