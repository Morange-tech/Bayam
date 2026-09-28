import { cn } from '@/lib/utils'

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow', className)}
      {...props}
    >
      {children}
    </div>
  )
}
