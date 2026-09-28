import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Stable reference so components selecting `getReviews(id)` for a product with no
// reviews don't get a new [] every render (which would trigger an infinite re-render loop).
const EMPTY_REVIEWS = []

// User-submitted reviews, layered on top of each product's static mock reviews (lib/mock/products.js)
// until there's a real API to persist them through. Keyed by productId.
const useReviewsStore = create(
  persist(
    (set, get) => ({
      byProduct: {},

      addReview: (productId, review) =>
        set((state) => ({
          byProduct: {
            ...state.byProduct,
            [productId]: [review, ...(state.byProduct[productId] ?? [])],
          },
        })),

      getReviews: (productId) => get().byProduct[productId] ?? EMPTY_REVIEWS,

      hasReviewed: (productId, orderId) =>
        (get().byProduct[productId] ?? []).some((review) => review.orderId === orderId),
    }),
    { name: 'bayam-reviews' }
  )
)

export default useReviewsStore
