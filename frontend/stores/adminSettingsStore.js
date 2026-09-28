import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const defaultSettings = {
  storeName: 'BAYAM',
  contactEmail: 'contact@bayam.com',
  supportPhone: '+237 6 00 00 00 00',
  maintenanceMode: false,
}

const useAdminSettingsStore = create(
  persist(
    (set) => ({
      settings: defaultSettings,
      hasHydrated: false,

      updateSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
    }),
    {
      name: 'bayam-admin-settings',
    }
  )
)

// See stores/adminOrdersStore.js for why this hydration dance and the `window` guard are needed.
if (typeof window !== 'undefined') {
  useAdminSettingsStore.persist.onFinishHydration(() => useAdminSettingsStore.setState({ hasHydrated: true }))
  if (useAdminSettingsStore.persist.hasHydrated()) {
    useAdminSettingsStore.setState({ hasHydrated: true })
  }
}

export default useAdminSettingsStore
