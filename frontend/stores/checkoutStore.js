import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCheckoutStore = create(
  persist(
    (set) => ({
      delivery: null,
      deliveryMode: 'standard',
      lastOrder: null,
      setDelivery: (delivery) => set({ delivery }),
      setDeliveryMode: (deliveryMode) => set({ deliveryMode }),
      setLastOrder: (lastOrder) => set({ lastOrder }),
      reset: () => set({ delivery: null }),
    }),
    { name: 'bayam-checkout' }
  )
)

export default useCheckoutStore
