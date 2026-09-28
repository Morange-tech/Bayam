import { cn } from '@/lib/utils'

export default function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse bg-beige-card rounded-lg', className)} {...props} />
}
