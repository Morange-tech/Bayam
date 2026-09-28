import Skeleton from '@/components/ui/Skeleton'

export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-card">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  )
}
