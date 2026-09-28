'use client'

import { CheckCircle2 } from 'lucide-react'
import useToastStore from '@/stores/toastStore'

export default function Toast() {
  const message = useToastStore((state) => state.message)

  if (!message) return null

  return (
    <div className="fixed inset-x-0 bottom-20 z-[60] flex justify-center px-4 md:bottom-6">
      <div className="flex items-center gap-2 rounded-full bg-violet-deep px-4 py-3 text-sm font-medium text-white shadow-card-hover">
        <CheckCircle2 className="h-4 w-4 text-green-400" />
        {message}
      </div>
    </div>
  )
}
