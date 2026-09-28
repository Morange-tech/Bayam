'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronDown,
  Globe,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { categories } from '@/lib/data/catalogue'
import { CITIES } from '@/lib/checkout'
import { resolvePostLoginPath } from '@/lib/staff'
import useCartStore from '@/stores/cartStore'
import useFavoritesStore from '@/stores/favoritesStore'
import useAuthStore from '@/stores/authStore'

export default function Header() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [locationOpen, setLocationOpen] = useState(false)
  const [city, setCity] = useState('Douala')
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0))
  const favoritesCount = useFavoritesStore((state) => state.ids.length)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : ''
  const isPrivileged = user?.role === 'admin' || user?.role === 'staff'

  function handleLogout() {
    setAccountOpen(false)
    logout()
    router.push('/')
  }

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (category) params.set('category', category)
    router.push(`/catalogue${params.toString() ? `?${params.toString()}` : ''}`)
  }

  return (
    <header className={cn('sticky top-0 z-50 bg-white transition-shadow', scrolled && 'shadow-md')}>
      {/* Desktop */}
      <div className="mx-auto hidden h-16 max-w-7xl items-center justify-between gap-4 px-4 md:flex md:px-6">
        <Link href="/" className="shrink-0 text-2xl font-bold tracking-tight text-violet-deep">
          BAYAM
        </Link>

        <form onSubmit={handleSearch} className="flex flex-1 items-stretch">
          <div className="relative w-28 shrink-0 md:w-36">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 w-full appearance-none truncate rounded-l-xl border border-r-0 border-beige-border bg-beige-base py-0 pl-3 pr-7 text-sm text-violet-deep focus:outline-none"
            >
              <option value="">Toutes catégories</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-active" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit, une marque..."
            className="h-11 min-w-0 flex-1 border border-x-0 border-beige-border bg-white px-4 text-sm text-violet-deep placeholder:text-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Rechercher"
            className="flex h-11 w-12 shrink-0 items-center justify-center rounded-r-xl bg-violet-active text-white transition-colors hover:bg-violet-deep"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        <div className="flex items-center gap-5">
          <button type="button" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-violet-active">
            <Globe className="h-4 w-4" />
            FR <span className="text-gray-300">|</span> EN
          </button>

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className="flex flex-col items-center gap-0.5 text-violet-deep hover:text-violet-active"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-active text-xs font-semibold text-white">
                  {initials}
                </span>
                <span className="text-xs">Compte</span>
              </button>

              {accountOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Fermer"
                    onClick={() => setAccountOpen(false)}
                    className="fixed inset-0 z-30 cursor-default"
                  />
                  <div className="absolute right-0 top-full z-40 mt-2 w-52 rounded-lg bg-white py-1.5 shadow-card-hover">
                    <div className="border-b border-beige-border px-4 py-2.5">
                      <p className="truncate text-sm font-medium text-violet-deep">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="truncate text-xs text-gray-400">{user.email}</p>
                    </div>
                    {isPrivileged ? (
                      <Link
                        href={resolvePostLoginPath(user)}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-violet-deep hover:bg-violet-light"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {user.role === 'admin' ? 'Administration' : 'Mon espace staff'}
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/compte"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-violet-deep hover:bg-violet-light"
                        >
                          <User className="h-4 w-4" /> Mon compte
                        </Link>
                        <Link
                          href="/compte/commandes"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-violet-deep hover:bg-violet-light"
                        >
                          <Package className="h-4 w-4" /> Mes commandes
                        </Link>
                        <Link
                          href="/compte/favoris"
                          onClick={() => setAccountOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-violet-deep hover:bg-violet-light"
                        >
                          <Heart className="h-4 w-4" /> Mes favoris
                        </Link>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 border-t border-beige-border px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/connexion"
              className="flex flex-col items-center gap-0.5 text-violet-deep hover:text-violet-active"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Compte</span>
            </Link>
          )}

          <Link
            href="/compte/favoris"
            className="flex flex-col items-center gap-0.5 text-violet-deep hover:text-violet-active"
          >
            <span className="relative">
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-violet-active px-1 text-[10px] text-white">
                  {favoritesCount}
                </span>
              )}
            </span>
            <span className="text-xs">Favoris</span>
          </Link>

          <Link href="/panier" className="flex flex-col items-center gap-0.5 text-violet-deep hover:text-violet-active">
            <span className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-violet-active px-1 text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="text-xs">Panier</span>
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="bg-white pb-3 md:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-violet-deep">
            BAYAM
          </Link>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setLocationOpen((v) => !v)}
                className="flex items-center gap-1 text-sm font-medium text-violet-deep"
              >
                <MapPin className="h-4 w-4 text-violet-active" />
                {city}
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', locationOpen && 'rotate-180')} />
              </button>

              {locationOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Fermer"
                    onClick={() => setLocationOpen(false)}
                    className="fixed inset-0 z-30 cursor-default"
                  />
                  <div className="absolute right-0 top-full z-40 mt-2 w-40 rounded-lg bg-white py-1.5 shadow-card-hover">
                    {CITIES.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => {
                          setCity(c.label)
                          setLocationOpen(false)
                        }}
                        className={cn(
                          'block w-full px-3 py-1.5 text-left text-sm hover:bg-violet-light',
                          c.label === city ? 'font-medium text-violet-active' : 'text-violet-deep'
                        )}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="text-violet-deep"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mx-4 flex items-center gap-2 rounded-lg bg-beige-base px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-violet-active" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full bg-transparent text-sm text-violet-deep placeholder:text-gray-400 focus:outline-none"
          />
        </form>

        {menuOpen && (
          <div className="flex flex-col gap-1 border-t border-beige-border bg-white px-4 py-3">
            <button
              type="button"
              className="flex items-center gap-2 py-2 text-sm text-gray-600 hover:text-violet-active"
            >
              <Globe className="h-4 w-4" /> FR | EN
            </button>

            <Link
              href={user ? '/compte' : '/connexion'}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm text-violet-deep hover:text-violet-active"
            >
              <User className="h-4 w-4" /> Compte
            </Link>

            <Link
              href="/compte/favoris"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm text-violet-deep hover:text-violet-active"
            >
              <Heart className="h-4 w-4" /> Favoris {favoritesCount > 0 && `(${favoritesCount})`}
            </Link>

            <Link
              href="/panier"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-2 text-sm text-violet-deep hover:text-violet-active"
            >
              <ShoppingCart className="h-4 w-4" /> Panier {cartCount > 0 && `(${cartCount})`}
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
