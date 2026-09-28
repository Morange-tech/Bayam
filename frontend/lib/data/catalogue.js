import { products } from '@/lib/mock/products'

// Mock data until the Laravel API exists — same async shape, swap the body for an api.get() call later.

export const categories = [
  { slug: 'electronique', name: 'Électronique' },
  { slug: 'mode', name: 'Mode' },
  { slug: 'maison', name: 'Maison & Cuisine' },
  { slug: 'beaute', name: 'Beauté & Santé' },
  { slug: 'sport', name: 'Sport & Loisirs' },
  { slug: 'alimentation', name: 'Alimentation' },
]

const priceBounds = products.reduce(
  (acc, p) => ({ min: Math.min(acc.min, p.price), max: Math.max(acc.max, p.price) }),
  { min: Infinity, max: 0 }
)

export async function fetchCatalogueFilters() {
  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count: products.filter((p) => p.category.slug === cat.slug).length,
  }))
  return { categories: categoriesWithCount, priceBounds }
}

export async function fetchProducts(searchParams = {}) {
  const {
    q,
    category,
    min_price: minPrice,
    max_price: maxPrice,
    rating,
    sort,
    in_stock: inStock,
    fast_delivery: fastDelivery,
  } = searchParams

  const activeCategories = category ? String(category).split(',').filter(Boolean) : []

  let list = products.filter((p) => {
    if (q && !p.name.toLowerCase().includes(String(q).toLowerCase())) return false
    if (activeCategories.length && !activeCategories.includes(p.category.slug)) return false
    if (minPrice && p.price < Number(minPrice)) return false
    if (maxPrice && p.price > Number(maxPrice)) return false
    if (rating && p.rating < Number(rating)) return false
    if (inStock === '1' && p.inStock === false) return false
    if (fastDelivery === '1' && !p.fastDelivery) return false
    return true
  })

  if (sort === 'price_asc') list = [...list].sort((a, b) => a.price - b.price)
  else if (sort === 'price_desc') list = [...list].sort((a, b) => b.price - a.price)
  else if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
  else if (sort === 'newest') list = [...list].reverse()

  return {
    products: list,
    total: list.length,
  }
}
