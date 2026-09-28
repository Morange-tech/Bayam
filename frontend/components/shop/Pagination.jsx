'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { buildQueryString, cn } from '@/lib/utils'

export default function Pagination({ page, totalPages }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function goTo(n) {
    const qs = buildQueryString(searchParams, { page: n === 1 ? null : n })
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="mt-8 flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
        aria-label="Page précédente"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-violet-deep hover:bg-violet-light disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => goTo(n)}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium',
            n === page ? 'bg-violet-active text-white' : 'text-violet-deep hover:bg-violet-light'
          )}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
        aria-label="Page suivante"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-violet-deep hover:bg-violet-light disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
