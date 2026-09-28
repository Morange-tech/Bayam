import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    maximumFractionDigits: 0,
  }).format(amount)
  // Affiche : "45 000 FCFA"
}

export function formatDate(dateString) {
  return new Intl.DateTimeFormat('fr-CM', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(dateString))
}

export function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function buildQueryString(searchParams, updates) {
  const params = new URLSearchParams(searchParams?.toString())
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      params.delete(key)
    } else {
      params.set(key, String(value))
    }
  })
  return params.toString()
}
