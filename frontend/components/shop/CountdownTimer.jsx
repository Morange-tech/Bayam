'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

function getRemaining(endsAt) {
  const diff = Math.max(0, new Date(endsAt).getTime() - Date.now())
  return {
    hours: Math.floor(diff / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  }
}

function pad(n) {
  return String(n).padStart(2, '0')
}

const units = [
  { key: 'hours', label: 'Heures' },
  { key: 'minutes', label: 'Min' },
  { key: 'seconds', label: 'Sec' },
]

export default function CountdownTimer({ endsAt }) {
  const [remaining, setRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    setRemaining(getRemaining(endsAt))
    const interval = setInterval(() => setRemaining(getRemaining(endsAt)), 1000)
    return () => clearInterval(interval)
  }, [endsAt])

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-white/70">Se termine dans</span>
      <div className="flex items-center gap-1.5">
        {units.map((unit, i) => (
          <div key={unit.key} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex h-10 w-11 items-center justify-center rounded-lg font-mono text-lg font-bold',
                  i === 0 ? 'bg-white text-violet-deep' : 'bg-violet-active text-white'
                )}
              >
                {pad(remaining[unit.key])}
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-wide text-white/50">{unit.label}</span>
            </div>
            {i < units.length - 1 && <span className="pb-4 text-lg font-bold text-white">:</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
