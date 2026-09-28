import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  { id: 'panier', label: 'Panier' },
  { id: 'livraison', label: 'Livraison' },
  { id: 'paiement', label: 'Paiement' },
]

export default function StepIndicator({ current }) {
  const currentIndex = steps.findIndex((step) => step.id === current)

  return (
    <ol className="flex items-center justify-center">
      {steps.map((step, i) => {
        const isDone = i < currentIndex
        const isActive = i === currentIndex

        return (
          <li key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors',
                  isDone && 'bg-violet-active text-white',
                  isActive && 'bg-white font-bold text-violet-active ring-2 ring-violet-active',
                  !isDone && !isActive && 'bg-beige-card text-gray-400'
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-violet-active' : isDone ? 'text-violet-deep' : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn('mx-3 mb-5 h-0.5 w-10 sm:mx-4 sm:w-20', isDone ? 'bg-violet-active' : 'bg-beige-card')}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
