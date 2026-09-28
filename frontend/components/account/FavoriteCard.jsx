'use client'

import ProductCard from '@/components/shop/ProductCard'
import useFavoritesStore from '@/stores/favoritesStore'

export default function FavoriteCard({ product }) {
  const toggleFavorite = useFavoritesStore((state) => state.toggle)

  return (
    <div className="group relative">
      <ProductCard product={product} />
      <button
        type="button"
        onClick={() => toggleFavorite(product.id)}
        className="absolute left-1/2 top-[38%] z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-red-500 opacity-0 shadow-card-hover transition-opacity group-hover:opacity-100"
      >
        Retirer
      </button>
    </div>
  )
}
