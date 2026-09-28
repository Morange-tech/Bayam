import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// middleware.js checks this cookie (edge runtime can't read localStorage) — kept in sync
// with the token here so the coarse-grained route guard and the client-side layout guards
// (which read the store directly) agree on auth state.
function setTokenCookie(token) {
  if (typeof document === 'undefined') return
  document.cookie = `bayam_token=${token}; path=/; max-age=${60 * 60 * 24 * 30}`
}

function clearTokenCookie() {
  if (typeof document === 'undefined') return
  document.cookie = 'bayam_token=; path=/; max-age=0'
}

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
      hasHydrated: false,

      setUser: (user) => set({ user, isAuthenticated: true, isAdmin: user.role === 'admin' }),
      setToken: (token) => {
        setTokenCookie(token)
        set({ token })
      },
      logout: () => {
        localStorage.removeItem('bayam_token')
        clearTokenCookie()
        set({ user: null, token: null, isAuthenticated: false, isAdmin: false })
      },
    }),
    {
      name: 'bayam-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
)

// Reading `useAuthStore` from inside `onRehydrateStorage` races the `const` assignment above
// (persist can rehydrate synchronously, before `create()` returns) and throws a TDZ ReferenceError,
// silently leaving hasHydrated stuck at false. Attaching the listener afterwards avoids that.
// Guarded by `window` since zustand's default storage getter (`() => window.localStorage`) throws
// during SSR, which makes `persist` skip attaching `.persist` at all on the server.
if (typeof window !== 'undefined') {
  useAuthStore.persist.onFinishHydration(() => useAuthStore.setState({ hasHydrated: true }))
  if (useAuthStore.persist.hasHydrated()) {
    useAuthStore.setState({ hasHydrated: true })
  }
}

export default useAuthStore
