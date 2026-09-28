import { CreditCard, MessageCircle } from 'lucide-react'

// Shared by the admin Vue d'ensemble and Finances pages (same design source —
// Finances is the Comptable-accessible subset of the overview's revenue data).

export const STATUS_STYLES = {
  pending: { label: 'En attente', bg: '#FDF1E3', text: '#B45309' },
  shipped: { label: 'Expédiée', bg: '#E8EEFC', text: '#1D4ED8' },
  delivered: { label: 'Livrée', bg: '#E7F4EC', text: '#1A7A45' },
  cancelled: { label: 'Annulée', bg: '#FBEAE8', text: '#C0392B' },
}

export function RevenueChart({ points, yLabels, xLabels, gradientId = 'revFill' }) {
  const gridY = [8, 68, 128, 188]
  const fillPath = `${points} L650,188 L40,188 Z`
  const [last, lastY] = points.split(' ').at(-1).slice(1).split(',')

  return (
    <svg width="100%" height="230" viewBox="0 0 660 230" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#6D28D9" stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridY.map((y) => (
        <line key={y} x1="40" y1={y} x2="650" y2={y} stroke="#DDD0B8" strokeWidth="1" opacity="0.5" />
      ))}
      {yLabels.map((label, i) => (
        <text key={label} x="0" y={gridY[i] + 4} fontFamily="Inter" fontSize="10" fill="#6B5C7E">
          {label}
        </text>
      ))}

      <path d={fillPath} fill={`url(#${gradientId})`} />
      <path d={points} fill="none" stroke="#6D28D9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last} cy={lastY} r="5" fill="#6D28D9" stroke="#fff" strokeWidth="2" />

      <text x="40" y="210" fontFamily="Inter" fontSize="10" fill="#6B5C7E">
        {xLabels[0]}
      </text>
      <text x="345" y="210" fontFamily="Inter" fontSize="10" fill="#6B5C7E" textAnchor="middle">
        {xLabels[1]}
      </text>
      <text x="650" y="210" fontFamily="Inter" fontSize="10" fill="#6B5C7E" textAnchor="end">
        {xLabels[2]}
      </text>
    </svg>
  )
}

export function PaymentDonut({ breakdown, total }) {
  const circumference = 2 * Math.PI * 70
  let offset = 0
  const segments = breakdown.map((entry) => {
    const length = (entry.percent / 100) * circumference
    const segment = { ...entry, length, offset: -offset }
    offset += length
    return segment
  })

  return (
    <div className="relative mx-auto mt-5 h-[180px] w-[180px]">
      <svg width="180" height="180" viewBox="0 0 180 180">
        <g transform="rotate(-90 90 90)">
          <circle cx="90" cy="90" r="70" fill="none" stroke="#DDD0B8" strokeWidth="24" opacity="0.35" />
          {segments.map((segment) => (
            <circle
              key={segment.label}
              cx="90"
              cy="90"
              r="70"
              fill="none"
              stroke={segment.color}
              strokeWidth="24"
              strokeDasharray={`${segment.length} ${circumference}`}
              strokeDashoffset={segment.offset}
            />
          ))}
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xl font-extrabold text-violet-deep">{total}</p>
        <p className="text-[11px] text-text-secondary">transactions</p>
      </div>
    </div>
  )
}

export function PaymentDonutLegend({ breakdown }) {
  return (
    <div className="mt-5 flex flex-col gap-2.5">
      {breakdown.map((entry) => (
        <div key={entry.label} className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: entry.color }} />
          <span className="flex-1 text-sm text-[#1E1026]">{entry.label}</span>
          <span className="text-sm font-bold text-violet-deep">{entry.percent}%</span>
        </div>
      ))}
    </div>
  )
}

export function PaymentTag({ payment }) {
  if (payment.method === 'card') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <CreditCard className="h-3 w-3 text-text-secondary" strokeWidth={2} />
        {payment.label}
      </span>
    )
  }
  if (payment.method === 'whatsapp') {
    return (
      <span className="inline-flex items-center gap-1.5">
        <MessageCircle className="h-3 w-3 text-[#1A7A45]" strokeWidth={2.2} />
        {payment.label}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: payment.color }} />
      {payment.label}
    </span>
  )
}
