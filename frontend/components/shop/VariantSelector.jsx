'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export default function VariantSelector({ variants, onChange }) {
  const [selected, setSelected] = useState(() =>
    Object.fromEntries(variants.map((group) => [group.id, group.options[0]?.id]))
  )

  useEffect(() => {
    onChange?.(selected)
    // Only report the initial selection once — later changes go through handleSelect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSelect(groupId, optionId) {
    const next = { ...selected, [groupId]: optionId }
    setSelected(next)
    onChange?.(next)
  }

  return (
    <div className="space-y-4">
      {variants.map((group) => (
        <div key={group.id}>
          <p className="mb-2 text-sm font-medium text-violet-deep">
            {group.label} :{' '}
            <span className="font-normal text-gray-500">
              {group.options.find((option) => option.id === selected[group.id])?.label}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) =>
              option.value?.startsWith('#') ? (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(group.id, option.id)}
                  aria-label={option.label}
                  aria-pressed={selected[group.id] === option.id}
                  className={cn(
                    'h-8 w-8 rounded-full border-2 transition-colors',
                    selected[group.id] === option.id ? 'border-violet-active' : 'border-transparent'
                  )}
                  style={{ backgroundColor: option.value }}
                />
              ) : (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(group.id, option.id)}
                  aria-pressed={selected[group.id] === option.id}
                  className={cn(
                    'rounded-lg border-[1.5px] px-3.5 py-1.5 text-sm font-medium transition-colors',
                    selected[group.id] === option.id
                      ? 'border-violet-active bg-violet-light text-violet-active'
                      : 'border-beige-border text-violet-deep hover:border-violet-soft'
                  )}
                >
                  {option.label}
                </button>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
