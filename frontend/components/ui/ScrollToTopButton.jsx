'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400)
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Remonter en haut de la page"
      className="fixed bottom-20 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-violet-active text-white shadow-card-hover transition-colors hover:bg-violet-deep md:bottom-6"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
