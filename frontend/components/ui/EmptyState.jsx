import { cn } from '@/lib/utils'

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-4 py-12 text-center', className)}>
      {Icon && <Icon size={48} className="mb-4 text-beige-gold" />}
      <h3 className="mb-1 text-lg font-semibold text-violet-deep">{title}</h3>
      <p className="mb-4 max-w-sm text-sm text-gray-500">{description}</p>
      {action}
    </div>
  )
}
