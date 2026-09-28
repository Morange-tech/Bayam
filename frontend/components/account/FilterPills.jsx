'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { buildQueryString, cn } from '@/lib/utils'

const filters = [
  { value: 'all', label: 'Toutes' },
  { value: 'active', label: 'En cours' },
  { value: 'delivered', label: 'Livrées' },
  { value: 'cancelled', label: 'Annulées' },
]

export default function FilterPills({ active = 'all' }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleSelect(value) {
    const qs = buildQueryString(searchParams, { status: value === 'all' ? null : value, page: null })
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => handleSelect(filter.value)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            active === filter.value
              ? 'bg-violet-active text-white'
              : 'bg-beige-card text-gray-600 hover:bg-violet-light hover:text-violet-active'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
