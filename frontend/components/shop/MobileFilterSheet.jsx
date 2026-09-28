'use client'

import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import FilterSidebar from './FilterSidebar'
import Button from '@/components/ui/Button'

export default function MobileFilterSheet({ categories, priceBounds }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="secondary" size="sm" className="mb-4 md:hidden" onClick={() => setOpen(true)}>
        <SlidersHorizontal className="mr-1.5 h-4 w-4" />
        Filtres
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-card-hover">
            <FilterSidebar
              categories={categories}
              priceBounds={priceBounds}
              onClose={() => setOpen(false)}
              className="rounded-none shadow-none"
            />
          </div>
        </div>
      )}
    </>
  )
}
