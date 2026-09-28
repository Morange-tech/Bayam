'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import useCartStore from '@/stores/cartStore'

export default function FrequentlyBoughtTogether({ products }) {
  const [checked, setChecked] = useState(() => new Set(products.map((p) => p.id)))
  const addItem = useCartStore((state) => state.addItem)

  function toggle(id) {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selected = products.filter((p) => checked.has(p.id))
  const total = selected.reduce((sum, p) => sum + p.price, 0)

  function handleAddAll() {
    selected.forEach((product) => addItem(product, 1))
  }

  return (
    <section className="mt-14">
      <h2 className="mb-4 text-xl font-bold text-violet-deep">Souvent achetés ensemble</h2>
      <div className="flex flex-col gap-6 rounded-xl border border-beige-border bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-start gap-3">
          {products.map((product, i) => (
            <div key={product.id} className="flex items-center gap-3">
              {i > 0 && <Plus className="mt-6 h-4 w-4 shrink-0 text-gray-300" />}
              <div className="w-28 shrink-0 text-center">
                <label className="relative mx-auto block h-20 w-20 cursor-pointer overflow-hidden rounded-lg bg-beige-card">
                  <input
                    type="checkbox"
                    checked={checked.has(product.id)}
                    onChange={() => toggle(product.id)}
                    className="absolute left-1 top-1 z-10 h-4 w-4 rounded border-beige-border accent-violet-active"
                  />
                  <Image src={product.image} alt={product.name} fill sizes="80px" className="object-cover" />
                </label>
                <p className="mt-2 line-clamp-2 text-xs text-violet-deep">{product.name}</p>
                <p className="text-sm font-semibold text-violet-deep">{formatPrice(product.price)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 border-t border-beige-border pt-4 lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <div>
            <p className="text-xs text-gray-500">Total pour les {selected.length}</p>
            <p className="text-lg font-bold text-violet-deep">{formatPrice(total)}</p>
          </div>
          <Button onClick={handleAddAll} disabled={selected.length === 0}>
            Ajouter les {selected.length} au panier
          </Button>
        </div>
      </div>
    </section>
  )
}
