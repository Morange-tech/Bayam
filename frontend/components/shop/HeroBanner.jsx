'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HeroBanner({ banners }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <section className="relative h-[280px] overflow-hidden md:h-[520px]">
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative flex h-full w-full shrink-0 items-center overflow-hidden bg-gradient-to-br from-violet-active to-violet-deep px-6 md:px-16"
          >
            {banner.image && (
              <div className="absolute inset-0 md:hidden">
                <Image src={banner.image} alt="" fill sizes="100vw" className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-deep via-violet-deep/85 to-violet-deep/30" />
              </div>
            )}

            <div className="relative z-10 max-w-lg">
              <h1 className="text-3xl font-bold leading-tight text-white md:hidden">
                {banner.mobileTitle || banner.title}
              </h1>
              <h1 className="hidden text-4xl font-bold leading-tight text-white md:block md:text-5xl">
                {banner.title}
              </h1>
              <p className="mt-4 hidden text-white/70 md:block">{banner.subtitle}</p>
              <Link
                href={banner.ctaHref}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-beige-gold px-6 py-3 font-medium text-white transition-opacity hover:opacity-90 md:mt-6"
              >
                {banner.ctaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="absolute inset-y-8 right-6 hidden w-[42%] max-w-md md:right-16 md:block lg:right-24">
              <div className="relative h-full w-full overflow-hidden rounded-3xl bg-white/10">
                {banner.image ? (
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    sizes="(min-width: 768px) 42vw, 0px"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute -right-2 -top-6 h-28 w-28 rounded-full bg-white/25 md:h-36 md:w-36" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {banners.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`Aller au slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn('h-2 rounded-full bg-white/40 transition-all', i === index ? 'w-7 bg-white' : 'w-2')}
          />
        ))}
      </div>
    </section>
  )
}
