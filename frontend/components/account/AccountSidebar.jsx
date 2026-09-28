'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, ChevronDown, Gift, Heart, LayoutDashboard, MapPin, Package, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchAccountStats } from '@/lib/data/account'
import useAuthStore from '@/stores/authStore'

export default function AccountSidebar() {
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const [activeOrdersCount, setActiveOrdersCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchAccountStats().then((stats) => setActiveOrdersCount(stats.activeOrders))
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase()

  const links = [
    { href: '/compte', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/compte/commandes', label: 'Mes commandes', icon: Package, badge: activeOrdersCount },
    { href: '/compte/favoris', label: 'Mes favoris', icon: Heart },
    { href: '/compte/adresses', label: 'Mes adresses', icon: MapPin },
    { href: '/compte/notifications', label: 'Notifications', icon: Bell },
    { href: '/compte/parrainage', label: 'Parrainage', icon: Gift },
    { href: '/compte/profil', label: 'Paramètres', icon: Settings },
  ]

  const activeLink = links.find((link) => link.href === pathname)

  function renderLinks() {
    return links.map(({ href, label, icon: Icon, badge }) => {
      const active = pathname === href
      return (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm',
            active ? 'bg-violet-light font-medium text-violet-active' : 'text-gray-600 hover:bg-beige-card'
          )}
        >
          <Icon className="h-4 w-4" />
          <span className="flex-1">{label}</span>
          {Boolean(badge) && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-violet-active px-1.5 text-xs font-medium text-white">
              {badge}
            </span>
          )}
        </Link>
      )
    })
  }

  return (
    <>
      {/* Mobile: collapsible bar */}
      <div className="border-b border-beige-border bg-white md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between px-4 py-3"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-violet-deep">
            {activeLink ? <activeLink.icon className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
            {activeLink?.label ?? 'Mon compte'}
          </span>
          <ChevronDown className={cn('h-4 w-4 shrink-0 text-violet-deep transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <nav className="flex flex-col gap-1 border-t border-beige-border p-3">{renderLinks()}</nav>
        )}
      </div>

      {/* Desktop: static sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-beige-border bg-white md:block">
        <div className="flex flex-col items-center border-b border-beige-border px-4 pb-4 pt-6 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-beige-card text-xl font-bold text-violet-deep">
            {initials}
          </span>
          {user && (
            <>
              <p className="mt-2.5 text-sm font-bold text-violet-deep">
                {user.firstName} {user.lastName}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{user.email}</p>
            </>
          )}
        </div>
        <nav className="flex flex-col gap-1 p-4">{renderLinks()}</nav>
      </aside>
    </>
  )
}
