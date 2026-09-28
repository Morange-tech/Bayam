import { create } from 'zustand'

let timeoutId

const useToastStore = create((set) => ({
  message: null,
  showToast: (message) => {
    clearTimeout(timeoutId)
    set({ message })
    timeoutId = setTimeout(() => set({ message: null }), 2000)
  },
  hideToast: () => {
    clearTimeout(timeoutId)
    set({ message: null })
  },
}))

export default useToastStore
