import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Input = forwardRef(function Input({ className, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full h-12 px-4 rounded-lg border border-beige-border bg-white text-violet-deep placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-active/30 focus:border-violet-active',
        className
      )}
      {...props}
    />
  )
})

export default Input
