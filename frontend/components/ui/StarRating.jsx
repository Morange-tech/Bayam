import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const sizeMap = {
  sm: { star: 'h-3.5 w-3.5', text: 'text-xs' },
  md: { star: 'h-4 w-4', text: 'text-sm' },
}

export default function StarRating({ rating, count, size = 'md', className }) {
  const { star, text } = sizeMap[size]

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              star,
              i < Math.round(rating) ? 'fill-beige-gold text-beige-gold' : 'fill-none text-beige-gold'
            )}
          />
        ))}
      </div>
      {typeof count === 'number' && (
        <span className={cn('text-violet-active', text)}>({count})</span>
      )}
    </div>
  )
}
