'use client'

import { Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function QuantitySelector({ value, onChange, max = 99, className }) {
  function clamp(n) {
    return Math.min(max, Math.max(1, n))
  }

  return (
    <div className={cn('flex h-12 items-center rounded-lg border border-beige-border', className)}>
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= 1}
        aria-label="Diminuer la quantité"
        className="flex h-full w-10 items-center justify-center text-violet-active disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center text-sm font-medium text-violet-deep">{value}</span>
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
        className="flex h-full w-10 items-center justify-center text-violet-active disabled:opacity-30"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
