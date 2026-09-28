'use client'

import { useState } from 'react'
import { CheckCircle, ChevronDown, Heart, MessageCircle, ShoppingCart, Truck } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import PriceDisplay from '@/components/ui/PriceDisplay'
import StarRating from '@/components/ui/StarRating'
import QuantitySelector from './QuantitySelector'
import VariantSelector from './VariantSelector'
import { cn } from '@/lib/utils'
import { CITIES } from '@/lib/checkout'
import useCartStore from '@/stores/cartStore'
import useFavoritesStore from '@/stores/favoritesStore'
import useToastStore from '@/stores/toastStore'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '237600000000'

const FAST_CITIES = ['douala', 'yaounde']

const PAYMENT_METHODS = [
  { label: 'MTN MoMo', dot: 'bg-[#FFCC08]' },
  { label: 'Orange Money', dot: 'bg-[#FF7900]' },
  { label: 'Carte bancaire', dot: 'bg-violet-active' },
]

// Cart lines only track a color/size pair — map whichever variant groups the product defines onto those two slots.
function buildCartVariant(product, selected) {
  if (!product.hasVariants || !selected) return undefined

  const colorGroup = product.variants.find((group) => group.id === 'couleur')
  const otherGroup = product.variants.find((group) => group.id !== 'couleur')

  const color = colorGroup?.options.find((option) => option.id === selected[colorGroup.id])?.label
  const size = otherGroup?.options.find((option) => option.id === selected[otherGroup.id])?.label

  return color || size ? { color, size } : undefined
}

export default function ProductInfo({ product }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [zoneOpen, setZoneOpen] = useState(false)
  const [city, setCity] = useState('douala')
  const addItem = useCartStore((state) => state.addItem)
  const isFavorite = useFavoritesStore((state) => state.ids.includes(product.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggle)
  const showToast = useToastStore((state) => state.showToast)

  const outOfStock = product.stock === 0

  function handleAddToCart() {
    if (outOfStock) return
    addItem({ ...product, variant: buildCartVariant(product, selectedVariant) }, quantity)
    showToast('Article ajouté au panier')
  }

  function handleToggleFavorite() {
    toggleFavorite(product.id)
    showToast(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris')
  }

  const whatsappMessage = `Bonjour, je suis intéressé(e) par "${product.name}" (${quantity} ${
    quantity > 1 ? 'unités' : 'unité'
  }).`
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`

  const cityLabel = CITIES.find((c) => c.value === city)?.label || 'Douala'
  const deliveryEstimate = FAST_CITIES.includes(city) ? '3–5 jours' : '5–8 jours'

  return (
    <div>
      <h1 className="text-2xl font-bold leading-tight text-violet-deep">{product.name}</h1>

      <div className="my-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        <StarRating rating={product.rating} count={product.reviewCount} />
        {typeof product.soldCount === 'number' && (
          <span className="text-sm text-gray-400">· {product.soldCount} vendus</span>
        )}
      </div>

      <PriceDisplay price={product.price} originalPrice={product.originalPrice} discount={product.discount} />

      <div className="my-4 border-t border-beige-border" />

      {product.hasVariants && (
        <div className="mb-4">
          <VariantSelector variants={product.variants} onChange={setSelectedVariant} />
        </div>
      )}

      {product.stock > 0 && product.stock <= 5 && (
        <p className="text-sm text-red-500">Plus que {product.stock} en stock !</p>
      )}
      {outOfStock && <Badge variant="danger">Rupture de stock</Badge>}

      <div className="mt-4 flex gap-3">
        <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock || 1} />
        <Button className="flex-1" onClick={handleAddToCart} disabled={outOfStock}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Ajouter au panier
        </Button>
      </div>

      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <Button variant="whatsapp" className="mt-2 w-full">
          <MessageCircle className="mr-2 h-4 w-4" /> Commander via WhatsApp
        </Button>
      </a>

      <Button variant="secondary" className="mt-2 w-full" onClick={handleToggleFavorite}>
        <Heart className={cn('mr-2 h-4 w-4', isFavorite && 'fill-violet-active')} />
        {isFavorite ? 'Retiré des favoris' : 'Ajouter aux favoris'}
      </Button>

      <div className="mt-5 space-y-4 border-t border-beige-border pt-4">
        <div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-violet-deep">
              <Truck className="h-4 w-4 shrink-0 text-violet-active" />
              <span>
                Livré en {deliveryEstimate} à {cityLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setZoneOpen((v) => !v)}
              className="shrink-0 text-sm font-medium text-violet-active hover:underline"
            >
              Calculer ma zone
            </button>
          </div>

          {zoneOpen && (
            <div className="relative mt-2">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full appearance-none rounded-lg border border-beige-border bg-white px-3 py-2 pr-9 text-sm text-violet-deep focus:outline-none focus:ring-2 focus:ring-violet-active/30"
              >
                {CITIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-active" />
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs text-gray-500">Paiement accepté</p>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method.label}
                className="inline-flex items-center gap-1.5 rounded-lg border border-beige-border px-2.5 py-1.5 text-xs font-medium text-violet-deep"
              >
                <span className={cn('h-2 w-2 rounded-full', method.dot)} />
                {method.label}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>Retour gratuit sous 7 jours</span>
        </div>
      </div>
    </div>
  )
}
