'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const variants = {
  primary: 'bg-violet-active text-white hover:bg-violet-deep',
  secondary: 'border-[1.5px] border-violet-active text-violet-active hover:bg-violet-light',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  ghost: 'text-violet-active hover:bg-violet-light',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#20ba58]',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  )
}
