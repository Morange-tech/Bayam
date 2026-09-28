'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CreditCard, Lock } from 'lucide-react'
import Button from '@/components/ui/Button'
import useCartStore from '@/stores/cartStore'
import useCheckoutStore from '@/stores/checkoutStore'
import { getDeliveryFee } from '@/lib/checkout'
import { cn, formatPrice } from '@/lib/utils'

const PAYMENT_METHODS = [
  { label: 'MTN MoMo', dot: 'bg-[#FFCB05]' },
  { label: 'Orange Money', dot: 'bg-[#FF6600]' },
  { label: 'Visa', icon: CreditCard },
  { label: 'Mastercard', icon: CreditCard },
]

export default function OrderSummary() {
  const items = useCartStore((state) => state.items)
  const promoCode = useCartStore((state) => state.promoCode)
  const discount = useCartStore((state) => state.discount)
  const subtotal = useCartStore((state) => state.subtotal())
  const applyPromo = useCartStore((state) => state.applyPromo)
  const delivery = useCheckoutStore((state) => state.delivery)
  const previewMode = useCheckoutStore((state) => state.deliveryMode)

  const [promoInput, setPromoInput] = useState('')
  const [applyingPromo, setApplyingPromo] = useState(false)
  const [promoError, setPromoError] = useState(null)

  const deliveryFee = getDeliveryFee(delivery?.deliveryMode ?? previewMode)
  const total = subtotal - discount + deliveryFee

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

  return (
    <div className="h-fit rounded-2xl bg-white p-6 shadow-card lg:sticky lg:top-24">
      <h2 className="mb-4 text-base font-bold text-violet-deep">Votre commande</h2>

      <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variant?.color ?? ''}-${item.variant?.size ?? ''}`}
            className="flex items-center gap-3"
          >
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-beige-card">
              <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs font-medium text-violet-deep">{item.name}</p>
              <p className="text-xs text-gray-500">Qté : {item.quantity}</p>
            </div>
            <p className="shrink-0 text-xs font-semibold text-violet-deep">
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="my-4 border-t border-beige-border" />

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>Sous-total</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {promoCode && (
          <div className="flex items-center justify-between text-green-600">
            <span>Réduction ({promoCode})</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-gray-600">
          <span>Livraison</span>
          <span>{formatPrice(deliveryFee)}</span>
        </div>
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

      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-gray-400">Moyens de paiement acceptés</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {PAYMENT_METHODS.map((method) => (
          <span
            key={method.label}
            className="inline-flex items-center gap-1.5 rounded-lg border border-beige-border px-2.5 py-1 text-xs font-medium text-violet-deep"
          >
            {method.dot ? (
              <span className={cn('h-2 w-2 rounded-full', method.dot)} />
            ) : (
              <method.icon className="h-3.5 w-3.5 text-violet-active" />
            )}
            {method.label}
          </span>
        ))}
      </div>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-gray-500">
        <Lock className="h-3.5 w-3.5 text-violet-active" /> Paiement 100% sécurisé
      </p>
    </div>
  )
}
