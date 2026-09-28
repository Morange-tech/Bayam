import Badge from './Badge'
import { cn, formatPrice } from '@/lib/utils'

export default function PriceDisplay({ price, originalPrice, discount, className }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-lg font-bold text-violet-deep">{formatPrice(price)}</span>
      {originalPrice && (
        <span className="text-sm text-gray-400 line-through">{formatPrice(originalPrice)}</span>
      )}
      {discount && <Badge variant="promo">-{discount}%</Badge>}
    </div>
  )
}
