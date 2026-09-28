import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { orders as mockOrders } from '@/lib/mock/orders'

// Seeds from the mock catalog of orders, same pattern as adminProductsStore — mutations (cancel,
// a freshly placed order) persist for this session/browser until there's a real API to share
// state through.
const useOrdersStore = create(
  persist(
    (set, get) => ({
      orders: mockOrders,

      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

      cancelOrder: (id) =>
        set((state) => ({
          orders: state.orders.map((order) => (order.id === id ? { ...order, status: 'cancelled' } : order)),
        })),

      getOrder: (id) => get().orders.find((order) => order.id === id) ?? null,
    }),
    { name: 'bayam-orders' }
  )
)

export default useOrdersStore
