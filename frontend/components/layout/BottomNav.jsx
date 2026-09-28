'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ClipboardList, Home, LayoutGrid, ShoppingCart, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { resolvePostLoginPath } from '@/lib/staff'
import useCartStore from '@/stores/cartStore'
import useAuthStore from '@/stores/authStore'

export default function BottomNav() {
  const pathname = usePathname()
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))
  const user = useAuthStore((state) => state.user)
  const isPrivileged = user?.role === 'admin' || user?.role === 'staff'
  const profileHref = user ? (isPrivileged ? resolvePostLoginPath(user) : '/compte') : '/connexion'

  const tabs = [
    { href: '/', label: 'Accueil', icon: Home, match: (p) => p === '/' },
    { href: '/catalogue', label: 'Catalogue', icon: LayoutGrid, match: (p) => p.startsWith('/catalogue') },
    { href: '/panier', label: 'Panier', icon: ShoppingCart, match: (p) => p.startsWith('/panier'), badge: cartCount },
    {
      href: '/compte/commandes',
      label: 'Commandes',
      icon: ClipboardList,
      match: (p) => p.startsWith('/compte/commandes'),
    },
    {
      href: profileHref,
      label: 'Profil',
      icon: User,
      match: (p) =>
        user
          ? isPrivileged
            ? p.startsWith('/admin')
            : p.startsWith('/compte') && !p.startsWith('/compte/commandes')
          : p.startsWith('/connexion'),
    },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-beige-border bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = tab.match(pathname)
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn('flex flex-col items-center gap-1 py-2.5 text-[11px]', active ? 'text-violet-active' : 'text-gray-400')}
            >
              <span className="relative">
                <tab.icon className="h-5 w-5" />
                {tab.badge > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-violet-active px-1 text-[9px] font-semibold text-white">
                    {tab.badge}
                  </span>
                )}
              </span>
              <span className={cn(active && 'font-medium')}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
