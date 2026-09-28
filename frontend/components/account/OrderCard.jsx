'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import Button from '@/components/ui/Button'
import OrderInlineTimeline from '@/components/account/OrderInlineTimeline'
import { ORDER_STATUS } from '@/lib/orders'
import { cn, formatDate, formatPrice } from '@/lib/utils'
import useCartStore from '@/stores/cartStore'
import useOrdersStore from '@/stores/ordersStore'
import useReviewsStore from '@/stores/reviewsStore'

// Matches the mockup's own info/success/alert tokens exactly — this pill's palette is distinct
// from the app-wide Badge variants used elsewhere, so it's kept local rather than added there.
const STATUS_PILL_CLASSES = {
  processing: 'bg-[#E8EEFC] text-[#1D4ED8]',
  shipped: 'bg-[#E8EEFC] text-[#1D4ED8]',
  delivered: 'bg-[#E7F4EC] text-[#1A7A45]',
  cancelled: 'bg-[#FBEAE8] text-[#C0392B]',
}

export default function OrderCard({ order }) {
  const router = useRouter()
  const addItem = useCartStore((state) => state.addItem)
  const cancelOrder = useOrdersStore((state) => state.cancelOrder)
  const reviewedByProduct = useReviewsStore((state) => state.byProduct)

  const status = ORDER_STATUS[order.status]
  const isTrackable = order.status === 'processing' || order.status === 'shipped'
  const isDelivered = order.status === 'delivered'
  // Once a courier has the package there's no self-service cancellation in this demo — only
  // orders still being prepared by the vendor can be cancelled.
  const isCancellable = order.status === 'processing'

  function handleReorder() {
    order.items.forEach((item) => addItem(item, item.quantity))
    router.push('/panier')
  }

  function handleCancel() {
    if (window.confirm(`Annuler la commande #${order.id} ?`)) {
      cancelOrder(order.id)
    }
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold text-violet-deep">Commande #{order.id}</span>
          <span className="text-sm text-gray-500">· {formatDate(order.placedAt)}</span>
        </div>
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', STATUS_PILL_CLASSES[order.status])}>
          {status.label}
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {order.items.map((item) => {
          const hasReviewed = (reviewedByProduct[item.productId] ?? []).some((r) => r.orderId === order.id)
          return (
            <div key={item.productId} className="flex items-center gap-3">
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-beige-base ring-1 ring-beige-border">
                <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium text-violet-deep">{item.name}</p>
                <p className="mt-0.5 text-xs text-gray-500">Qté : {item.quantity}</p>
                {isDelivered &&
                  (hasReviewed ? (
                    <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-green-600">
                      <Check className="h-3 w-3" /> Avis envoyé
                    </span>
                  ) : (
                    <Link
                      href={`/produits/${item.slug}?tab=reviews&write=1&orderId=${order.id}`}
                      className="mt-0.5 inline-block text-xs font-medium text-violet-active hover:underline"
                    >
                      Laisser un avis
                    </Link>
                  ))}
              </div>
              <p className="shrink-0 font-semibold text-violet-deep">{formatPrice(item.price * item.quantity)}</p>
            </div>
          )
        })}
      </div>

      <div className="my-4 border-t border-beige-border" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {isTrackable && (
            <Link href={`/compte/commandes/${order.id}`}>
              <Button size="sm">Suivre la commande</Button>
            </Link>
          )}
          {isCancellable && (
            <Button
              size="sm"
              variant="ghost"
              className="border-[1.5px] border-beige-border text-gray-500 hover:border-red-500 hover:text-red-500"
              onClick={handleCancel}
            >
              Annuler la commande
            </Button>
          )}
          {(isDelivered || (!isTrackable && !isCancellable)) && (
            <Button
              size="sm"
              variant="ghost"
              className="border-[1.5px] border-beige-border text-gray-500 hover:border-violet-active hover:text-violet-active"
              onClick={handleReorder}
            >
              Recommander
            </Button>
          )}
        </div>
        <p className="text-base font-extrabold text-violet-deep">Total : {formatPrice(order.total)}</p>
      </div>

      {isTrackable && (
        <div className="mt-5 border-t border-beige-border pt-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-wide text-gray-500">Suivi de la commande</p>
          <OrderInlineTimeline order={order} />
        </div>
      )}
    </div>
  )
}
