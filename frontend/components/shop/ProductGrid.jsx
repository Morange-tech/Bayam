import { PackageSearch } from 'lucide-react'
import ProductCard from './ProductCard'
import EmptyState from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

export default function ProductGrid({ products, view = 'grid' }) {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="Aucun produit trouvé"
        description="Essayez d'ajuster vos filtres ou votre recherche."
      />
    )
  }

  return (
    <div
      className={cn(
        'grid gap-4 md:gap-6',
        view === 'list' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
