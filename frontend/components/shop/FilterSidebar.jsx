'use client'

import { useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, Star, X } from 'lucide-react'
import { buildQueryString, cn, formatPrice } from '@/lib/utils'
import { CITIES } from '@/lib/checkout'

const RATING_TIERS = [4, 3, 2]

export default function FilterSidebar({ categories, priceBounds, onClose, className }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState({ price: true, rating: true, category: true, delivery: true, zone: true })
  const [deliveryZone, setDeliveryZone] = useState('')

  const activeCategories = (searchParams.get('category') || '').split(',').filter(Boolean)
  const minPrice = Number(searchParams.get('min_price')) || priceBounds.min
  const maxPrice = Number(searchParams.get('max_price')) || priceBounds.max
  const activeRating = Number(searchParams.get('rating')) || 0
  const fastDeliveryOnly = searchParams.get('fast_delivery') === '1'

  function updateParams(updates) {
    const qs = buildQueryString(searchParams, { ...updates, page: null })
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  function toggleSection(key) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function handleMinChange(value) {
    const next = Math.min(Number(value), maxPrice)
    updateParams({ min_price: next === priceBounds.min ? null : next })
  }

  function handleMaxChange(value) {
    const next = Math.max(Number(value), minPrice)
    updateParams({ max_price: next === priceBounds.max ? null : next })
  }

  function toggleCategory(slug) {
    const next = activeCategories.includes(slug)
      ? activeCategories.filter((c) => c !== slug)
      : [...activeCategories, slug]
    updateParams({ category: next.length ? next.join(',') : null })
  }

  const range = Math.max(1, priceBounds.max - priceBounds.min)
  const minPercent = ((minPrice - priceBounds.min) / range) * 100
  const maxPercent = ((maxPrice - priceBounds.min) / range) * 100
  const step = Math.max(1, Math.round(range / 200))

  return (
    <div className={cn('rounded-xl bg-white p-5 shadow-card', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-violet-deep">Filtrer</h2>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push(pathname)} className="text-sm text-violet-active hover:underline">
            Réinitialiser
          </button>
          {onClose && (
            <button type="button" onClick={onClose} aria-label="Fermer" className="text-violet-deep">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <FilterSection title="Prix" open={open.price} onToggle={() => toggleSection('price')}>
        <div className="relative pt-1">
          <div className="relative h-1.5 rounded-full bg-beige-border">
            <div
              className="absolute h-1.5 rounded-full bg-violet-active"
              style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
            />
          </div>
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            step={step}
            value={minPrice}
            onChange={(e) => handleMinChange(e.target.value)}
            aria-label="Prix minimum"
            className="range-thumb absolute inset-x-0 top-1 h-1.5 w-full"
          />
          <input
            type="range"
            min={priceBounds.min}
            max={priceBounds.max}
            step={step}
            value={maxPrice}
            onChange={(e) => handleMaxChange(e.target.value)}
            aria-label="Prix maximum"
            className="range-thumb absolute inset-x-0 top-1 h-1.5 w-full"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span>{formatPrice(priceBounds.min)}</span>
          <span>{formatPrice(priceBounds.max)}</span>
        </div>
        <p className="mt-1.5 text-center text-sm font-bold text-violet-deep">
          {formatPrice(minPrice)} – {formatPrice(maxPrice)}
        </p>
      </FilterSection>

      <FilterSection title="Note minimale" open={open.rating} onToggle={() => toggleSection('rating')}>
        <div className="flex flex-col gap-2.5">
          {RATING_TIERS.map((tier) => (
            <label key={tier} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="radio"
                name="rating"
                checked={activeRating === tier}
                onChange={() => updateParams({ rating: tier })}
                className="h-4 w-4 accent-violet-active"
              />
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn('h-4 w-4', i < tier ? 'fill-beige-gold text-beige-gold' : 'fill-none text-beige-gold')}
                  />
                ))}
              </span>
              <span className="text-sm text-violet-deep">&amp; plus</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Catégorie" open={open.category} onToggle={() => toggleSection('category')}>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <label key={cat.slug} className="flex cursor-pointer items-center justify-between gap-2 text-sm text-violet-deep">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={activeCategories.includes(cat.slug)}
                  onChange={() => toggleCategory(cat.slug)}
                  className="h-4 w-4 rounded border-beige-border accent-violet-active focus:ring-2 focus:ring-violet-active/30"
                />
                {cat.name}
              </span>
              {cat.count != null && <span className="text-xs text-gray-400">({cat.count})</span>}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Livraison" open={open.delivery} onToggle={() => toggleSection('delivery')}>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-violet-deep">
          <input
            type="checkbox"
            checked={fastDeliveryOnly}
            onChange={() => updateParams({ fast_delivery: fastDeliveryOnly ? null : '1' })}
            className="h-4 w-4 rounded border-beige-border accent-violet-active focus:ring-2 focus:ring-violet-active/30"
          />
          Livraison rapide disponible
        </label>
      </FilterSection>

      <FilterSection title="Zone de livraison" open={open.zone} onToggle={() => toggleSection('zone')} last>
        <div className="relative">
          <select
            value={deliveryZone}
            onChange={(e) => setDeliveryZone(e.target.value)}
            className="w-full appearance-none rounded-lg border border-beige-border bg-white px-3 py-2 pr-9 text-sm text-violet-deep focus:outline-none focus:ring-2 focus:ring-violet-active/30"
          >
            <option value="">Toutes les villes</option>
            {CITIES.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-active" />
        </div>
      </FilterSection>
    </div>
  )
}

function FilterSection({ title, open, onToggle, children, last }) {
  return (
    <div className={cn('py-4', !last && 'border-b border-beige-border')}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-sm font-medium text-violet-deep"
      >
        {title}
        <ChevronDown className={cn('h-4 w-4 text-violet-active transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}
