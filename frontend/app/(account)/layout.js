'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LogOut } from 'lucide-react'
import AccountSidebar from '@/components/account/AccountSidebar'
import useAuthStore from '@/stores/authStore'

export default function AccountLayout({ children }) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    if (hasHydrated && !user) {
      router.replace('/connexion')
    }
  }, [hasHydrated, user, router])

  if (!hasHydrated || !user) return null

  function handleLogout() {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-beige-base">
      <header className="flex items-center justify-between border-b border-beige-border bg-white px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm font-medium text-violet-active hover:text-violet-deep"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à la boutique
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-500"
        >
          <LogOut className="h-4 w-4" /> Déconnexion
        </button>
      </header>

      <div className="flex flex-col md:flex-row">
        <AccountSidebar />
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
