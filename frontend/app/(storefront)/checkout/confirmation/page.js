'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import Button from '@/components/ui/Button'
import useCartStore from '@/stores/cartStore'
import useCheckoutStore from '@/stores/checkoutStore'
import { formatPrice } from '@/lib/utils'

export default function ConfirmationPage() {
  const router = useRouter()
  const lastOrder = useCheckoutStore((state) => state.lastOrder)
  const resetDelivery = useCheckoutStore((state) => state.reset)
  const clearCart = useCartStore((state) => state.clearCart)
  const hasCleared = useRef(false)

  useEffect(() => {
    if (!lastOrder) {
      router.replace('/')
      return
    }
    if (!hasCleared.current) {
      hasCleared.current = true
      clearCart()
      resetDelivery()
    }
  }, [lastOrder, clearCart, resetDelivery, router])

  if (!lastOrder) return null

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="rounded-2xl bg-white p-8 text-center shadow-card">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600"
        >
          <Check className="h-8 w-8" />
        </motion.span>

        <h1 className="mt-6 text-2xl font-bold text-violet-deep">Commande confirmée !</h1>
        <p className="mt-2 text-sm text-gray-500">
          Merci {lastOrder.delivery.firstName}, votre commande a bien été enregistrée.
        </p>

        <p className="mt-4 font-mono text-xl text-violet-deep">{lastOrder.orderId}</p>

        <div className="mt-6 space-y-2 rounded-xl bg-beige-card p-4 text-left">
          <h2 className="mb-2 text-sm font-semibold text-violet-deep">Résumé de la commande</h2>
          {lastOrder.items.map((item) => (
            <div
              key={`${item.productId}-${item.variant?.color ?? ''}-${item.variant?.size ?? ''}`}
              className="flex items-center justify-between text-sm text-gray-600"
            >
              <span className="line-clamp-1 pr-3">
                {item.name} × {item.quantity}
              </span>
              <span className="shrink-0 font-medium text-violet-deep">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}

          <div className="my-2 border-t border-beige-border" />

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Livraison</span>
            <span>{formatPrice(lastOrder.deliveryFee)}</span>
          </div>
          {lastOrder.discount > 0 && (
            <div className="flex items-center justify-between text-sm text-green-600">
              <span>Réduction {lastOrder.promoCode && `(${lastOrder.promoCode})`}</span>
              <span>-{formatPrice(lastOrder.discount)}</span>
            </div>
          )}
          <div className="flex items-center justify-between font-bold text-violet-deep">
            <span>Total</span>
            <span>{formatPrice(lastOrder.total)}</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Livraison à {lastOrder.delivery.address}, {lastOrder.delivery.neighborhood} — {lastOrder.delivery.city}.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href={`/compte/commandes/${lastOrder.orderId}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              Suivre ma commande
            </Button>
          </Link>
          <Link href="/catalogue" className="flex-1">
            <Button className="w-full">Continuer mes achats</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
