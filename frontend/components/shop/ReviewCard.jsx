import { Check } from 'lucide-react'
import StarRating from '@/components/ui/StarRating'
import { formatDate } from '@/lib/utils'

export default function ReviewCard({ review }) {
  const parts = review.author.trim().split(' ')
  const displayName = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0]
  const initials = parts
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="border-b border-beige-border py-5 first:pt-0 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-beige-card text-sm font-semibold text-violet-deep">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-violet-deep">{displayName}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  <Check className="h-3 w-3" /> Achat vérifié
                </span>
              )}
            </div>
            <span className="shrink-0 text-xs text-gray-400">{formatDate(review.date)}</span>
          </div>
          <StarRating rating={review.rating} size="sm" className="mt-1" />
          <p className="mt-2 text-sm text-gray-600">{review.text}</p>
        </div>
      </div>
    </div>
  )
}
