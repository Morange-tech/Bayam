'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Expand, X } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

// `unoptimized` because the mock `images` (lib/mock/products.js) are placehold.co SVGs without an
// XML prolog — Next's image optimizer can't detect their content type and rejects them outright.
// Drop it once these are swapped for real product photos.
export default function ProductGallery({ images, discount }) {
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const current = images[active]

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-beige-card">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          priority
          unoptimized
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        {discount && (
          <Badge variant="promo" className="absolute left-3 top-3">
            -{discount}%
          </Badge>
        )}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Agrandir l'image"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-violet-deep transition-colors hover:bg-white"
        >
          <Expand className="h-4 w-4" />
        </button>
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Voir l'image ${i + 1}`}
              className={cn(
                'relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-beige-card',
                i === active ? 'border-violet-active' : 'border-transparent'
              )}
            >
              <Image src={image.url} alt={image.alt} fill unoptimized sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Fermer"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative h-full max-h-[85vh] w-full max-w-3xl">
            <Image src={current.url} alt={current.alt} fill unoptimized sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}
    </div>
  )
}
