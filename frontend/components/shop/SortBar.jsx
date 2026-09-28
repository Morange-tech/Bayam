'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { LayoutGrid, List } from 'lucide-react'
import Select from '@/components/ui/Select'
import { buildQueryString, cn } from '@/lib/utils'

const sortOptions = [
  { value: '', label: 'Pertinence' },
  { value: 'price_asc', label: 'Prix ↑' },
  { value: 'price_desc', label: 'Prix ↓' },
  { value: 'rating', label: 'Mieux notés' },
  { value: 'newest', label: 'Nouveautés' },
]

export default function SortBar({ count, view, onViewChange }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort') || ''

  function handleSortChange(e) {
    const qs = buildQueryString(searchParams, { sort: e.target.value || null, page: null })
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  return (
    <div className="mb-4 flex items-center justify-between rounded-xl bg-white px-4 py-3">
      <p className="text-sm text-gray-500">{count} produits</p>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1 sm:flex">
          <button
            type="button"
            onClick={() => onViewChange('grid')}
            aria-label="Vue grille"
            className={cn(
              'rounded-md p-1.5',
              view === 'grid' ? 'bg-violet-light text-violet-active' : 'text-gray-400 hover:text-violet-active'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewChange('list')}
            aria-label="Vue liste"
            className={cn(
              'rounded-md p-1.5',
              view === 'list' ? 'bg-violet-light text-violet-active' : 'text-gray-400 hover:text-violet-active'
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
        <Select value={sort} onChange={handleSortChange} className="h-10 w-40 text-sm">
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
