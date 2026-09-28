'use client'

import { useEffect, useState } from 'react'
import SortBar from './SortBar'
import ProductGrid from './ProductGrid'
import Button from '@/components/ui/Button'
import ScrollToTopButton from '@/components/ui/ScrollToTopButton'

const PAGE_SIZE = 6

export default function CatalogueResults({ products, count }) {
  const [view, setView] = useState('grid')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [products])

  const visibleProducts = products.slice(0, visibleCount)
  const hasMore = visibleCount < products.length

  return (
    <>
      <SortBar count={count} view={view} onViewChange={setView} />
      <ProductGrid products={visibleProducts} view={view} />
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}>
            Voir plus
          </Button>
        </div>
      )}
      <ScrollToTopButton />
    </>
  )
}
