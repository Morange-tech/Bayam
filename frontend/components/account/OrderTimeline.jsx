import { Car, Check, Circle, Home, Truck } from 'lucide-react'
import { resolveShippingSteps } from '@/lib/orders'
import { cn, formatDate } from '@/lib/utils'

const timeFormatter = new Intl.DateTimeFormat('fr-CM', { hour: '2-digit', minute: '2-digit' })

function formatStepDateTime(dateString) {
  return `${formatDate(dateString)} · ${timeFormatter.format(new Date(dateString))}`
}

// Vehicle-in-motion steps get a pulsing icon while they're the current step — a car while the
// order is being readied for pickup, a truck once it's actually left for delivery.
const VEHICLE_ICONS = { enPreparation: Car, enLivraison: Truck }

function StepIcon({ step }) {
  if (step.done) return <Check className="h-4 w-4" />
  if (step.active && VEHICLE_ICONS[step.key]) {
    const Icon = VEHICLE_ICONS[step.key]
    return <Icon className="h-4 w-4" />
  }
  if (!step.active && step.key === 'livree') return <Home className="h-4 w-4" />
  return <Circle className="h-4 w-4" />
}

export default function OrderTimeline({ order }) {
  const steps = resolveShippingSteps(order)
  const sinceTime = order.timeline?.enLivraison

  return (
    <div>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const isActiveVehicle = step.active && Boolean(VEHICLE_ICONS[step.key])
        const isActiveShipping = step.active && step.key === 'enLivraison'

        return (
          <div key={step.label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                {isActiveVehicle && (
                  <span className="absolute inset-0 animate-ping rounded-full bg-violet-active/60" />
                )}
                <div
                  className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-full',
                    step.done
                      ? 'bg-green-500 text-white'
                      : step.active
                        ? 'bg-violet-active text-white'
                        : 'bg-white text-gray-400 ring-2 ring-beige-border'
                  )}
                >
                  <StepIcon step={step} />
                </div>
              </div>
              {!isLast && <div className={cn('h-12 w-0.5', step.done ? 'bg-green-500' : 'bg-beige-border')} />}
            </div>
            <div className="pb-7">
              <p className={cn('font-semibold', step.active ? 'text-violet-active' : 'text-violet-deep')}>
                {step.label}
              </p>
              {step.datetime && !isActiveShipping && (
                <p className="mt-0.5 text-xs text-gray-500">{formatStepDateTime(step.datetime)}</p>
              )}
              {isActiveShipping && order.courierName && (
                <>
                  <p className="mt-1 text-sm text-violet-deep">Livreur assigné : {order.courierName}</p>
                  {sinceTime && (
                    <p className="mt-0.5 text-xs text-gray-500">Depuis {timeFormatter.format(new Date(sinceTime))}</p>
                  )}
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
