import MobileFilterSheet from '@/components/shop/MobileFilterSheet'
import FilterSidebar from '@/components/shop/FilterSidebar'
import CatalogueResults from '@/components/shop/CatalogueResults'
import { fetchCatalogueFilters, fetchProducts } from '@/lib/data/catalogue'

export default async function CataloguePage({ searchParams }) {
  const [{ categories, priceBounds }, result] = await Promise.all([
    fetchCatalogueFilters(),
    fetchProducts(searchParams),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <MobileFilterSheet categories={categories} priceBounds={priceBounds} />

      <div className="md:grid md:grid-cols-[280px_1fr] md:gap-8">
        <aside className="hidden md:sticky md:top-24 md:block md:h-fit">
          <FilterSidebar categories={categories} priceBounds={priceBounds} />
        </aside>

        <div>
          <CatalogueResults products={result.products} count={result.total} />
        </div>
      </div>
    </div>
  )
}
