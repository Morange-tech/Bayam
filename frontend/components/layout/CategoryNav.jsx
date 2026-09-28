'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = [
  { slug: 'electronique', label: 'Électronique' },
  { slug: 'mode', label: 'Mode' },
  { slug: 'maison', label: 'Maison & Cuisine' },
  { slug: 'beaute', label: 'Beauté & Santé' },
  { slug: 'sport', label: 'Sport & Loisirs' },
  { slug: 'alimentation', label: 'Alimentation' },
]

export default function CategoryNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <nav className="relative z-30 hidden bg-violet-deep text-white md:block">
      <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 py-2.5 text-sm md:px-6">
        <div className="group relative shrink-0">
          <button
            type="button"
            className="flex items-center gap-1.5 whitespace-nowrap rounded px-3 py-1.5 hover:bg-violet-active/30"
          >
            <Menu className="h-4 w-4" />
            Toutes les catégories
          </button>
          <div className="invisible absolute left-0 top-full z-40 w-64 rounded-lg bg-white py-2 opacity-0 shadow-card-hover transition-opacity group-hover:visible group-hover:opacity-100">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalogue?category=${cat.slug}`}
                className="block px-4 py-2 text-sm text-violet-deep hover:bg-violet-light"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
        <ul className="flex items-center gap-1 overflow-x-auto">
          {categories.map((cat) => {
            const href = `/catalogue?category=${cat.slug}`
            const active = pathname === '/catalogue' && searchParams.get('category') === cat.slug
            return (
              <li key={cat.slug} className="shrink-0">
                <Link
                  href={href}
                  className={cn(
                    'block whitespace-nowrap rounded px-3 py-1.5 hover:bg-violet-active/30',
                    active && 'bg-violet-active/30'
                  )}
                >
                  {cat.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
