'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreditCard, Lock, Smartphone, Wallet } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import StripeCardForm from '@/components/checkout/StripeCardForm'
import { generateOrderId, getDeliveryFee } from '@/lib/checkout'
import { cn, formatPrice } from '@/lib/utils'
import useCartStore from '@/stores/cartStore'
import useCheckoutStore from '@/stores/checkoutStore'
import useOrdersStore from '@/stores/ordersStore'

const PHONE_REGEX = /^(\+237|237)?6[5-9]\d{7}$/

const paymentMethods = [
  { id: 'mtn', label: 'MTN Mobile Money', icon: Smartphone, field: 'mtnPhone' },
  { id: 'orange', label: 'Orange Money', icon: Smartphone, field: 'orangePhone' },
  { id: 'card', label: 'Carte bancaire', icon: CreditCard },
  { id: 'cod', label: 'Paiement à la livraison', icon: Wallet },
]

const paymentSchema = z
  .object({
    method: z.enum(['mtn', 'orange', 'card', 'cod']),
    mtnPhone: z.string().optional(),
    orangePhone: z.string().optional(),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCvc: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method === 'mtn' && !PHONE_REGEX.test(data.mtnPhone || '')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['mtnPhone'], message: 'Numéro MTN invalide' })
    }
    if (data.method === 'orange' && !PHONE_REGEX.test(data.orangePhone || '')) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['orangePhone'], message: 'Numéro Orange invalide' })
    }
    if (data.method === 'card') {
      if (!/^\d{16}$/.test((data.cardNumber || '').replace(/\s/g, ''))) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cardNumber'], message: 'Numéro de carte invalide' })
      }
      if (!/^\d{2}\/\d{2}$/.test(data.cardExpiry || '')) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cardExpiry'], message: 'Format MM/AA attendu' })
      }
      if (!/^\d{3,4}$/.test(data.cardCvc || '')) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['cardCvc'], message: 'CVC invalide' })
      }
    }
  })

export default function PaymentPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const promoCode = useCartStore((state) => state.promoCode)
  const discount = useCartStore((state) => state.discount)
  const subtotal = useCartStore((state) => state.subtotal())
  const delivery = useCheckoutStore((state) => state.delivery)
  const setLastOrder = useCheckoutStore((state) => state.setLastOrder)
  const addOrder = useOrdersStore((state) => state.addOrder)

  useEffect(() => {
    if (!delivery) router.replace('/checkout/livraison')
  }, [delivery, router])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: 'mtn',
      mtnPhone: '',
      orangePhone: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
    },
  })

  const method = watch('method')

  if (!delivery) return null

  const deliveryFee = getDeliveryFee(delivery.deliveryMode)
  const total = subtotal - discount + deliveryFee

  async function onSubmit(data) {
    // Mock payment processing until the Laravel API + payment gateways exist.
    await new Promise((resolve) => setTimeout(resolve, 1200))

    const orderId = generateOrderId()
    const placedAt = new Date().toISOString()

    setLastOrder({
      orderId,
      items,
      subtotal,
      discount,
      promoCode,
      deliveryFee,
      total,
      delivery,
      paymentMethod: data.method,
      placedAt,
    })

    // No backend order-status workflow exists yet (see CLAUDE.md) — a real order would sit at
    // "en préparation" until the vendor and a courier act on it. For this demo, mark prep and
    // shipping done immediately too, so the order lands on "en cours de livraison" right away,
    // and appears (cancellable while still "processing") in "Mes commandes".
    const enLivraisonAt = new Date(placedAt)
    enLivraisonAt.setHours(15, 10, 0, 0)
    addOrder({
      id: orderId,
      placedAt,
      status: 'processing',
      items,
      subtotal,
      discount,
      promoCode,
      deliveryFee,
      total,
      delivery,
      paymentMethod: data.method,
      courierName: 'Jean-Pierre',
      timeline: {
        commandee: placedAt,
        paiementConfirme: placedAt,
        enPreparation: placedAt,
        enLivraison: enLivraisonAt.toISOString(),
        livree: null,
      },
    })

    // The cart is only cleared once the confirmation page has mounted and captured this order.
    router.push('/checkout/confirmation')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-card">
      <h1 className="mb-6 text-xl font-bold text-violet-deep">Paiement</h1>

      <div className="space-y-3">
        {paymentMethods.map((pm) => {
          const Icon = pm.icon
          const active = method === pm.id

          return (
            <div key={pm.id}>
              <label
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4 transition-colors',
                  active ? 'border-violet-active bg-violet-light' : 'border-beige-border'
                )}
              >
                <input type="radio" value={pm.id} {...register('method')} className="hidden" />
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                    active ? 'bg-violet-active text-white' : 'bg-beige-card text-violet-active'
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-medium text-violet-deep">{pm.label}</span>
              </label>

              {pm.field && active && (
                <div className="animate-in slide-in-from-top-2 mt-3 duration-200">
                  <Input {...register(pm.field)} type="tel" placeholder="6XX XXX XXX" autoFocus />
                  {errors[pm.field] && <p className="mt-1 text-xs text-red-500">{errors[pm.field].message}</p>}
                </div>
              )}

              {pm.id === 'card' && active && (
                <div className="animate-in slide-in-from-top-2 mt-3 duration-200">
                  <StripeCardForm register={register} errors={errors} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Button type="submit" size="lg" className="mt-6 w-full bg-violet-active py-4 text-base" loading={isSubmitting}>
        <Lock className="mr-2 h-4 w-4" />
        Confirmer et payer — {formatPrice(total)}
      </Button>
    </form>
  )
}
