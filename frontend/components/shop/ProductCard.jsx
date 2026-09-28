'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Plus } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import StarRating from '@/components/ui/StarRating'
import PriceDisplay from '@/components/ui/PriceDisplay'
import { cn, formatPrice } from '@/lib/utils'
import useCartStore from '@/stores/cartStore'
import useFavoritesStore from '@/stores/favoritesStore'
import useToastStore from '@/stores/toastStore'

export default function ProductCard({ product, variant = 'default' }) {
  const addItem = useCartStore((state) => state.addItem)
  const isFavorite = useFavoritesStore((state) => state.ids.includes(product.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggle)
  const showToast = useToastStore((state) => state.showToast)
  const dark = variant === 'dark'

  function handleAddToCart() {
    addItem(product, 1)
    showToast('Article ajouté au panier')
  }

  return (
    <Card className={cn('group relative overflow-hidden', dark && 'bg-white/10 shadow-none hover:shadow-none')}>
      <div className="relative aspect-square overflow-hidden bg-beige-card">
        <Link href={`/produits/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {product.discount ? (
          <Badge variant="promo" className="absolute left-2 top-2 uppercase">
            Promo
          </Badge>
        ) : (
          product.isNew && (
            <Badge variant="new" className="absolute left-2 top-2 uppercase">
              Nouveau
            </Badge>
          )
        )}
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-label="Ajouter aux favoris"
          className="absolute right-2 top-2 hidden h-8 w-8 items-center justify-center rounded-full bg-white/90 text-violet-deep transition-colors hover:text-red-500 md:flex"
        >
          <Heart className={cn('h-4 w-4', isFavorite && 'fill-red-500 text-red-500')} />
        </button>
      </div>

      <div className="p-3">
        <Link href={`/produits/${product.slug}`}>
          <p className={cn('hidden truncate text-xs md:block', dark ? 'text-white/60' : 'text-gray-500')}>
            {product.category.name}
          </p>
          <h3
            className={cn(
              'line-clamp-1 text-sm font-medium md:line-clamp-2 md:min-h-[2.5rem]',
              dark ? 'text-white' : 'text-violet-deep'
            )}
          >
            {product.name}
          </h3>
        </Link>

        <StarRating rating={product.rating} count={product.reviewCount} size="sm" className="mt-1 hidden md:flex" />

        {/* Mobile: price + circular add button */}
        <div className="mt-1.5 flex items-center justify-between md:hidden">
          <span className={cn('text-base font-bold', dark ? 'text-white' : 'text-violet-deep')}>
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label="Ajouter au panier"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-active text-white transition-colors hover:bg-violet-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Desktop: full price row + button */}
        <div className="hidden md:block">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            className="mt-1"
          />
          <Button size="sm" className="mt-2 w-full" onClick={handleAddToCart} disabled={product.stock === 0}>
            Ajouter au panier
          </Button>
        </div>
      </div>
    </Card>
  )
}
