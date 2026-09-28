'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Bell,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageCheck,
  Settings,
  ShoppingBag,
  Tag,
  UserCog,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchPendingOrdersCount } from '@/lib/data/admin'
import { staffRoleLabel } from '@/lib/staff'
import useAuthStore from '@/stores/authStore'

// `section` mirrors ROUTE_SECTIONS in app/(admin)/layout.js and
// backend/app/Enums/StaffRole.php — a link with no `section` is admin-only.
const LINKS = [
  { href: '/admin', label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: '/admin/commandes', label: 'Commandes', icon: PackageCheck, section: 'commandes', badgeKey: 'orders' },
  { href: '/admin/produits', label: 'Produits', icon: ShoppingBag, section: 'catalogue' },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users, section: 'utilisateurs' },
  { href: '/admin/finances', label: 'Finances', icon: CreditCard, section: 'finances' },
  { href: '/admin/promotions', label: 'Promotions', icon: Tag, section: 'catalogue' },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/equipe', label: 'Équipe', icon: UserCog },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
  { href: '/admin/rapports', label: 'Rapports', icon: FileText },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const [pendingCount, setPendingCount] = useState(0)
  const [open, setOpen] = useState(false)

  const isAdmin = user?.role === 'admin'
  const staffSections = user?.staffSections ?? []

  useEffect(() => {
    if (!isAdmin) return
    fetchPendingOrdersCount().then(setPendingCount)
  }, [isAdmin])

  // Below `lg`, the sidebar is an off-canvas drawer — close it on every navigation.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Admin sees the whole platform nav (matching the design 1:1); a staff
  // account only sees the link(s) its poste covers — nothing admin-only.
  const links = LINKS.filter((link) => (isAdmin ? true : link.section && staffSections.includes(link.section)))

  function handleLogout() {
    logout()
    router.push('/connexion')
  }

  const initials = (user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')
  const roleLine = isAdmin ? 'Administrateur' : staffRoleLabel(user?.staffRole)

  return (
    <>
      {/* Mobile top bar — replaces the sidebar's own header below `lg`, where the sidebar is a hidden drawer. */}
      <div className="flex items-center justify-between bg-violet-deep px-4 py-3.5 lg:hidden">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-white">
          BAYAM
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[260px] shrink-0 -translate-x-full flex-col overflow-y-auto bg-violet-deep px-[18px] py-6 text-white transition-transform duration-200 ease-out',
          'lg:static lg:min-h-screen lg:translate-x-0',
          open && 'translate-x-0'
        )}
      >
        <div className="flex items-start justify-between border-b border-white/15 pb-5">
          <Link href="/">
            <p className="text-xl font-extrabold tracking-tight text-white">BAYAM</p>
            <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-violet-soft">Administration</p>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/70 hover:bg-white/5 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <Link
          href="/"
          className="mt-4 flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13.5px] font-semibold text-white/70 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Home className="h-[17px] w-[17px] shrink-0" strokeWidth={1.8} />
          Retour à la boutique
        </Link>

        <nav className="flex flex-1 flex-col gap-[3px] pb-[18px] pt-2">
          {links.map(({ href, label, icon: Icon, badgeKey }) => {
            const active = pathname === href
            const badge = badgeKey === 'orders' ? pendingCount : null
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13.5px] font-semibold text-white/70 transition-colors hover:bg-white/5',
                  active && 'bg-violet-active/40 text-white'
                )}
              >
                <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.8} />
                <span className="flex-1">{label}</span>
                {Boolean(badge) && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#C0392B] px-1.5 text-[10px] font-extrabold text-white">
                    {badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-3 border-t border-white/15 pt-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-beige-card text-[13px] font-bold text-violet-deep">
            {initials || 'AD'}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-white">
              {user ? `${user.firstName} ${user.lastName}` : 'Administrateur'}
            </p>
            <p className="truncate text-[11px] text-violet-soft">{roleLine}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Se déconnecter"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </>
  )
}
