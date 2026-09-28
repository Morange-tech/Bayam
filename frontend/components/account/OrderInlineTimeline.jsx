import { Car, Check, Home, Truck } from 'lucide-react'
import { resolveShippingSteps } from '@/lib/orders'
import { cn } from '@/lib/utils'

const COMPACT_LABELS = ['Commandé', 'Confirmé', 'Expédié', 'En livraison', 'Livré']
const VEHICLE_ICONS = { enPreparation: Car, enLivraison: Truck }

function StepIcon({ step }) {
  if (step.done) return <Check className="h-4 w-4" />
  if (step.active && VEHICLE_ICONS[step.key]) {
    const Icon = VEHICLE_ICONS[step.key]
    return <Icon className="h-4 w-4" />
  }
  if (step.key === 'livree') return <Home className="h-4 w-4" />
  return null
}

// Compact horizontal readout of the same 5-step timeline shown in full on the order detail page —
// used on the account order list so a trackable order's progress is visible without a click.
export default function OrderInlineTimeline({ order }) {
  const steps = resolveShippingSteps(order)

  return (
    <div className="flex items-start">
      {steps.map((step, i) => (
        <div key={step.key} className="flex flex-1 items-start last:flex-none">
          <div className="flex w-full flex-col items-center gap-2">
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full',
                step.done || step.active
                  ? 'bg-violet-active text-white'
                  : 'bg-white text-gray-400 ring-2 ring-beige-border'
              )}
              style={step.active ? { boxShadow: '0 0 0 4px rgba(109,40,217,.18)' } : undefined}
            >
              <StepIcon step={step} />
            </span>
            <span
              className={cn(
                'text-center text-[11px] font-bold',
                step.done || step.active ? 'text-violet-active' : 'text-gray-500'
              )}
            >
              {COMPACT_LABELS[i]}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn('mt-4 h-0.5 flex-1', step.done ? 'bg-violet-active' : 'bg-beige-border')} />
          )}
        </div>
      ))}
    </div>
  )
}
