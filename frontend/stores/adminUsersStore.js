import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { adminUsers } from '@/lib/mock/admin'

const useAdminUsersStore = create(
  persist(
    (set) => ({
      users: adminUsers,
      hasHydrated: false,

      toggleBan: (id) =>
        set((state) => ({
          users: state.users.map((user) => (user.id === id ? { ...user, banned: !user.banned } : user)),
        })),
    }),
    {
      name: 'bayam-admin-users',
    }
  )
)

// See stores/adminOrdersStore.js for why this hydration dance and the `window` guard are needed.
if (typeof window !== 'undefined') {
  useAdminUsersStore.persist.onFinishHydration(() => useAdminUsersStore.setState({ hasHydrated: true }))
  if (useAdminUsersStore.persist.hasHydrated()) {
    useAdminUsersStore.setState({ hasHydrated: true })
  }
}

export default useAdminUsersStore
