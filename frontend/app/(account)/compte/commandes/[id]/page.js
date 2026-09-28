'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, CreditCard, MapPin } from 'lucide-react'
import Button from '@/components/ui/Button'
import OrderTimeline from '@/components/account/OrderTimeline'
import { CITIES } from '@/lib/checkout'
import { ORDER_STATUS, PAYMENT_METHOD_LABELS } from '@/lib/orders'
import useOrdersStore from '@/stores/ordersStore'
import { cn, formatDate, formatPrice } from '@/lib/utils'

// A solid pill for the big status header — bolder than the generic Badge variants used
// elsewhere (order list, ...), matching the tracking mockup's dark-violet "in progress" pill.
const STATUS_PILL_CLASSES = {
  processing: 'bg-violet-active text-white',
  shipped: 'bg-violet-active text-white',
  delivered: 'bg-green-500 text-white',
  cancelled: 'bg-red-500 text-white',
}

export default function OrderDetailPage() {
  const params = useParams()
  const order = useOrdersStore((state) => state.getOrder(params.id))
  const cancelOrder = useOrdersStore((state) => state.cancelOrder)

  if (!order) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-card">
        <p className="text-gray-500">Commande introuvable.</p>
        <Link href="/compte/commandes" className="mt-3 inline-block text-sm text-violet-active hover:underline">
          Retour à mes commandes
        </Link>
      </div>
    )
  }

  const status = ORDER_STATUS[order.status]
  // The live map/WhatsApp contact makes sense for as long as the order is on its way — from
  // being readied at the vendor through to actual delivery — not just once a courier is assigned.
  const isInProgress = order.status === 'processing' || order.status === 'shipped'
  // Once a courier has the package there's no self-service cancellation in this demo — only
  // orders still being prepared by the vendor can be cancelled.
  const isCancellable = order.status === 'processing'
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER

  function handleCancel() {
    if (window.confirm(`Annuler la commande #${order.id} ?`)) {
      cancelOrder(order.id)
    }
  }

  return (
    <div>
      <Link
        href="/compte/commandes"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-active"
      >
        <ArrowLeft className="h-4 w-4" /> Mes commandes
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xl font-extrabold text-violet-deep">Commande #{order.id}</p>
          <p className="mt-1 text-sm text-gray-500">Commandée le {formatDate(order.placedAt)}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn('rounded-full px-5 py-2.5 text-sm font-bold', STATUS_PILL_CLASSES[order.status])}>
            {status.label}
          </span>
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
        </div>
      </div>

      {order.status === 'cancelled' ? (
        <div className="rounded-xl bg-white p-8 text-center shadow-card">
          <p className="text-sm text-gray-500">Cette commande a été annulée.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl bg-white p-6 shadow-card lg:p-7">
            <OrderTimeline order={order} />
          </div>

          <div className="rounded-xl bg-white p-6 shadow-card">
            <p className="mb-4 font-bold text-violet-deep">Récapitulatif</p>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <span className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-lg bg-beige-base ring-1 ring-beige-border">
                    <Image src={item.image} alt={item.name} fill sizes="52px" className="object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-violet-deep">{item.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">Qté : {item.quantity}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-violet-deep">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-4 border-t border-beige-border" />

            <div className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-active" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Adresse de livraison</p>
                <p className="mt-0.5 text-sm text-violet-deep">
                  {order.delivery.firstName} {order.delivery.lastName} · {order.delivery.neighborhood},{' '}
                  {order.delivery.address},{' '}
                  {CITIES.find((c) => c.value === order.delivery.city)?.label ?? order.delivery.city}
                </p>
              </div>
            </div>

            <div className="mt-3.5 flex gap-2.5">
              <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-violet-active" />
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Mode de paiement</p>
                <p className="mt-0.5 text-sm text-violet-deep">
                  {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
                </p>
              </div>
            </div>

            <div className="my-4 border-t border-beige-border" />

            <div className="space-y-1.5 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span>{formatPrice(order.deliveryFee)}</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold text-violet-deep">Total</span>
              <span className="text-lg font-extrabold text-violet-deep">{formatPrice(order.total)}</span>
            </div>

            {isInProgress && whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Bonjour, je suis client BAYAM pour la commande #${order.id}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-bold text-white transition-colors hover:bg-[#1fb857]"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1s-.7.8-.9 1c-.2.2-.3.2-.6.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.3-.4a.5.5 0 0 0 0-.5c-.1-.1-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2c0 1.3.9 2.6 1.1 2.8.1.2 2 3 4.7 4.2a15 15 0 0 0 1.6.6 3.8 3.8 0 0 0 1.8.1c.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2s-.2-.2-.4-.3z" />
                </svg>
                {order.courierName ? 'Contacter le livreur via WhatsApp' : 'Contacter le support via WhatsApp'}
              </a>
            )}
          </div>
        </div>
      )}

      {isInProgress && <DeliveryMap courierName={order.courierName} />}
    </div>
  )
}

// Illustrative placeholder map — no real map provider is wired up yet, so a stylised
// road sketch + pulsing courier position stands in until Google Maps is integrated.
function DeliveryMap({ courierName }) {
  return (
    <div className="mt-7 overflow-hidden rounded-xl border border-beige-border bg-beige-card">
      <div className="relative h-[360px] w-full">
        <svg
          viewBox="0 0 1150 360"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <line x1="0" y1="80" x2="1150" y2="60" stroke="#DDD0B8" strokeWidth="10" />
          <line x1="0" y1="220" x2="1150" y2="260" stroke="#DDD0B8" strokeWidth="14" />
          <line x1="180" y1="0" x2="140" y2="360" stroke="#DDD0B8" strokeWidth="10" />
          <line x1="620" y1="0" x2="660" y2="360" stroke="#DDD0B8" strokeWidth="16" />
          <line x1="920" y1="0" x2="960" y2="360" stroke="#DDD0B8" strokeWidth="8" />
          <path
            d="M410,205 C 470,190 560,150 700,120"
            fill="none"
            stroke="#6D28D9"
            strokeWidth="3"
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-card">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-active opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-active" />
          </span>
          <span className="text-xs font-bold text-violet-deep">Suivi en direct</span>
        </div>

        <div className="absolute" style={{ left: 'calc(35.6% - 12px)', top: 'calc(56.9% - 12px)' }}>
          <span className="relative flex h-6 w-6">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-active opacity-60" />
            <span className="relative inline-flex h-6 w-6 rounded-full border-[3px] border-white bg-violet-active shadow-card" />
          </span>
        </div>
        <div
          className="absolute whitespace-nowrap rounded-lg bg-white px-2.5 py-1 shadow-card"
          style={{ left: 'calc(35.6% - 42px)', top: 'calc(56.9% - 46px)' }}
        >
          <span className="text-[11px] font-bold text-violet-deep">{courierName ?? 'Votre commande'}</span>
        </div>

        <div className="absolute" style={{ left: 'calc(60.9% - 14px)', top: 'calc(33.3% - 34px)' }}>
          <svg width="30" height="38" viewBox="0 0 30 38" fill="none">
            <path
              d="M15 1C7.3 1 1 7.2 1 14.8 1 24.5 15 37 15 37s14-12.5 14-22.2C29 7.2 22.7 1 15 1z"
              fill="#3A1868"
            />
            <circle cx="15" cy="14.5" r="5.5" fill="#fff" />
          </svg>
        </div>
        <div
          className="absolute whitespace-nowrap rounded-lg bg-white px-2.5 py-1 shadow-card"
          style={{ left: 'calc(60.9% - 58px)', top: 'calc(33.3% - 62px)' }}
        >
          <span className="text-[11px] font-bold text-violet-deep">Point de livraison</span>
        </div>

        <div className="absolute bottom-3.5 right-4 rounded-md bg-white/90 px-2.5 py-1.5">
          <span className="text-[10px] text-gray-500">
            Carte illustrative — intégration Google Maps après validation
          </span>
        </div>
      </div>
    </div>
  )
}
