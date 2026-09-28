'use client'

import { Heart } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import FavoriteCard from '@/components/account/FavoriteCard'
import useFavoritesStore from '@/stores/favoritesStore'
import { products } from '@/lib/mock/products'

export default function FavoritesPage() {
  const ids = useFavoritesStore((state) => state.ids)
  const favoriteProducts = products.filter((product) => ids.includes(product.id))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-violet-deep">Mes favoris</h1>

      {favoriteProducts.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Aucun favori pour le moment"
          description="Ajoutez des produits à vos favoris pour les retrouver ici."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {favoriteProducts.map((product) => (
            <FavoriteCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
