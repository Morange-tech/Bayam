'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, ShoppingCart, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import PriceDisplay from '@/components/ui/PriceDisplay'
import QuantitySelector from '@/components/shop/QuantitySelector'
import useCartStore from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const promoCode = useCartStore((state) => state.promoCode)
  const discount = useCartStore((state) => state.discount)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const applyPromo = useCartStore((state) => state.applyPromo)
  const subtotal = useCartStore((state) => state.subtotal())
  const total = useCartStore((state) => state.total())

  const [promoInput, setPromoInput] = useState('')
  const [applyingPromo, setApplyingPromo] = useState(false)
  const [promoError, setPromoError] = useState(null)

  async function handleApplyPromo(e) {
    e.preventDefault()
    if (!promoInput.trim() || applyingPromo) return

    setApplyingPromo(true)
    setPromoError(null)
    try {
      await applyPromo(promoInput)
      setPromoInput('')
    } catch (err) {
      setPromoError(err.message)
    } finally {
      setApplyingPromo(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <EmptyState
          icon={ShoppingCart}
          title="Votre panier est vide"
          description="Parcourez notre catalogue pour trouver des produits qui vous plaisent."
          action={
            <Link href="/catalogue">
              <Button>Découvrir le catalogue</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <h1 className="mb-6 text-2xl font-bold text-violet-deep">Mon panier</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variant?.color ?? ''}-${item.variant?.size ?? ''}`}
              className="flex gap-4 border-b border-beige-border py-4"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-xl bg-beige-card object-cover"
              />
              <div className="flex-1">
                <h3 className="line-clamp-2 font-medium text-violet-deep">{item.name}</h3>
                {item.variant && (item.variant.color || item.variant.size) && (
                  <p className="text-xs text-gray-500">
                    {[item.variant.color, item.variant.size].filter(Boolean).join(' / ')}
                  </p>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(qty) => updateQuantity(item.productId, qty)}
                    max={item.stock}
                  />
                  <PriceDisplay price={item.price * item.quantity} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                aria-label="Retirer du panier"
                className="self-start text-red-400 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-2xl bg-white p-6 shadow-card lg:sticky lg:top-24">
          <h2 className="mb-4 font-bold text-violet-deep">Récapitulatif</h2>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Livraison</span>
              <span>Calculé à l&apos;étape suivante</span>
            </div>
            {promoCode && (
              <div className="flex items-center justify-between text-green-600">
                <span>Réduction ({promoCode})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
          </div>

          <div className="my-4 border-t border-beige-border" />

          <div className="flex items-center justify-between">
            <span className="font-medium text-violet-deep">Total</span>
            <span className="text-xl font-bold text-violet-deep">{formatPrice(total)}</span>
          </div>

          <form onSubmit={handleApplyPromo} className="mt-4 flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Code promo"
              className="w-full rounded-lg border border-beige-border px-3 py-2 text-sm text-violet-deep placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-active/30"
            />
            <Button type="submit" variant="secondary" loading={applyingPromo} disabled={applyingPromo}>
              Appliquer
            </Button>
          </form>
          {promoError && <p className="mt-1.5 text-xs text-red-500">{promoError}</p>}

          <Button className="mt-6 w-full" onClick={() => router.push('/checkout/livraison')}>
            Passer la commande
          </Button>

          <div className="mt-4 space-y-1.5 text-center text-xs text-gray-500">
            <p className="flex items-center justify-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-violet-active" /> Paiement sécurisé
            </p>
            <p>MTN MoMo · Orange Money · Carte bancaire</p>
          </div>
        </div>
      </div>
    </div>
  )
}
