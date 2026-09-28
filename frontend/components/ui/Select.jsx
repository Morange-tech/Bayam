import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const Select = forwardRef(function Select({ className, children, ...props }, ref) {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'w-full h-12 px-4 pr-10 rounded-lg border border-beige-border bg-white text-violet-deep appearance-none focus:outline-none focus:ring-2 focus:ring-violet-active/30 focus:border-violet-active',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-active" />
    </div>
  )
})

export default Select
