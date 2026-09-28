import ProductCardSkeleton from '@/components/shop/ProductCardSkeleton'

export default function CatalogueLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="md:grid md:grid-cols-[280px_1fr] md:gap-8">
        <div className="hidden md:block">
          <div className="h-96 animate-pulse rounded-xl bg-white shadow-card" />
        </div>
        <div>
          <div className="mb-4 h-14 animate-pulse rounded-xl bg-white shadow-card" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
