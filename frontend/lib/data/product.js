import { products } from '@/lib/mock/products'

// Mock data until the Laravel API exists — same async shape, swap the body for an api.get() call later.

export async function fetchProduct(slug) {
  return products.find((p) => p.slug === slug) ?? null
}

export async function fetchRelatedProducts(product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category.slug === product.category.slug)
    .slice(0, limit)
}

export async function fetchFrequentlyBoughtTogether(product, limit = 2) {
  const others = products
    .filter((p) => p.id !== product.id && p.category.slug === product.category.slug)
    .slice(0, limit)

  return [product, ...others]
}
