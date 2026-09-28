import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useFavoritesStore = create(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id) ? state.ids.filter((i) => i !== id) : [...state.ids, id],
        })),
      has: (id) => get().ids.includes(id),
    }),
    { name: 'bayam-favorites' }
  )
)

export default useFavoritesStore
