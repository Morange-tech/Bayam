import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-violet-light text-violet-active',
  promo: 'bg-red-500 text-white',
  new: 'bg-violet-active text-white',
  success: 'bg-green-100 text-green-800',
  gold: 'bg-beige-gold text-white',
  danger: 'bg-red-500 text-white',
}

export default function Badge({ variant = 'default', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
