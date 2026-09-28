'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, ChevronLeft, ChevronRight, HelpCircle, Star } from 'lucide-react'
import ReviewCard from './ReviewCard'
import Button from '@/components/ui/Button'
import StarRating from '@/components/ui/StarRating'
import { cn } from '@/lib/utils'
import useAuthStore from '@/stores/authStore'
import useReviewsStore from '@/stores/reviewsStore'

const REVIEWS_PER_PAGE = 5

const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Caractéristiques' },
  { id: 'reviews', label: 'Avis' },
  { id: 'questions', label: 'Questions' },
]

function ReviewForm({ productId, orderId, onDone }) {
  const user = useAuthStore((state) => state.user)
  const addReview = useReviewsStore((state) => state.addReview)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() || submitting) return
    setSubmitting(true)
    addReview(productId, {
      id: `r-${Date.now()}`,
      author: user ? `${user.firstName} ${user.lastName}` : 'Client BAYAM',
      verified: Boolean(orderId),
      date: new Date().toISOString(),
      rating,
      text: text.trim(),
      orderId: orderId || null,
    })
    setSubmitting(false)
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-beige-border p-4">
      <p className="mb-2 text-sm font-semibold text-violet-deep">Votre note</p>
      <div className="mb-3 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${n} étoile${n > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                'h-6 w-6',
                n <= (hoverRating || rating) ? 'fill-beige-gold text-beige-gold' : 'fill-none text-beige-gold'
              )}
            />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Qu'avez-vous pensé de ce produit ?"
        className="w-full rounded-lg border border-beige-border px-3 py-2 text-sm text-violet-deep placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-active/30"
        required
      />
      <div className="mt-3 flex gap-2">
        <Button type="submit" size="sm" loading={submitting}>
          Publier mon avis
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onDone}>
          Annuler
        </Button>
      </div>
    </form>
  )
}

export default function ProductTabs({ product }) {
  const searchParams = useSearchParams()
  const [active, setActive] = useState(() => (searchParams.get('tab') === 'reviews' ? 'reviews' : 'description'))
  const [reviewPage, setReviewPage] = useState(1)
  const [showForm, setShowForm] = useState(() => searchParams.get('write') === '1')
  const [sanitize, setSanitize] = useState(null)

  // Loaded lazily so nothing runs during server prerendering (dompurify needs a DOM).
  useEffect(() => {
    import('dompurify').then((mod) => setSanitize(() => mod.default.sanitize))
  }, [])

  const orderId = searchParams.get('orderId')
  const userReviews = useReviewsStore((state) => state.getReviews(product.id))

  const reviews = [...userReviews, ...(product.reviews || [])]
  const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : product.rating
  const totalPages = Math.max(1, Math.ceil(reviews.length / REVIEWS_PER_PAGE))
  const start = (reviewPage - 1) * REVIEWS_PER_PAGE
  const pageReviews = reviews.slice(start, start + REVIEWS_PER_PAGE)

  const questions = product.questions || []
  const highlights = product.highlights?.length
    ? product.highlights
    : (product.specifications || []).slice(0, 5).map((spec) => `${spec.label} : ${spec.value}`)

  return (
    <div className="mt-10">
      <div className="flex gap-6 border-b border-beige-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActive(tab.id)}
            className={cn(
              'border-b-2 border-transparent pb-3 text-sm transition-colors',
              active === tab.id
                ? 'border-violet-active font-medium text-violet-active'
                : 'text-gray-500 hover:text-violet-deep'
            )}
          >
            {tab.label}
            {tab.id === 'reviews' && ` (${reviews.length})`}
            {tab.id === 'questions' && ` (${questions.length})`}
          </button>
        ))}
      </div>

      <div className="py-6">
        {active === 'description' && (
          <div>
            <div
              className="space-y-3 text-sm leading-relaxed text-gray-600 [&_li]:ml-5 [&_strong]:text-violet-deep [&_ul]:list-disc [&_ul]:space-y-1"
              dangerouslySetInnerHTML={{ __html: sanitize ? sanitize(product.description || '') : '' }}
            />

            {highlights.length > 0 && (
              <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold text-violet-deep">Points forts</h3>
                <ul className="space-y-2">
                  {highlights.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-violet-active" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {active === 'specifications' && (
          <table className="w-full text-sm">
            <tbody>
              {(product.specifications || []).map((spec, i) => (
                <tr key={spec.label} className={i % 2 === 0 ? 'bg-beige-card' : 'bg-white'}>
                  <td className="w-1/3 px-4 py-2.5 font-medium text-violet-deep">{spec.label}</td>
                  <td className="px-4 py-2.5 text-gray-600">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {active === 'reviews' && (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-beige-border pb-6">
              {reviews.length > 0 ? (
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-violet-deep">{avgRating.toFixed(1)}</span>
                  <div>
                    <StarRating rating={avgRating} />
                    <p className="mt-0.5 text-sm text-gray-500">Basé sur {reviews.length} avis</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun avis pour ce produit.</p>
              )}
              {!showForm && (
                <Button size="sm" variant="secondary" onClick={() => setShowForm(true)}>
                  Laisser un avis
                </Button>
              )}
            </div>

            {showForm && (
              <ReviewForm productId={product.id} orderId={orderId} onDone={() => setShowForm(false)} />
            )}

            {pageReviews.length > 0 && (
              <>
                <div>
                  {pageReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="mt-6 flex items-center justify-center gap-1">
                    <button
                      type="button"
                      disabled={reviewPage <= 1}
                      onClick={() => setReviewPage((p) => p - 1)}
                      aria-label="Avis précédents"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-violet-deep hover:bg-violet-light disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewPage(n)}
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium',
                          n === reviewPage ? 'bg-violet-active text-white' : 'text-violet-deep hover:bg-violet-light'
                        )}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={reviewPage >= totalPages}
                      onClick={() => setReviewPage((p) => p + 1)}
                      aria-label="Avis suivants"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-violet-deep hover:bg-violet-light disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        )}

        {active === 'questions' && (
          <div>
            {questions.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <HelpCircle className="h-8 w-8 text-violet-soft" />
                <p className="text-sm text-gray-500">Aucune question pour ce produit pour le moment.</p>
                <Button variant="secondary" size="sm">
                  Poser une question
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((qa) => (
                  <div key={qa.id} className="rounded-xl border border-beige-border p-4">
                    <p className="text-sm font-medium text-violet-deep">{qa.question}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {qa.author} · {new Date(qa.date).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="mt-3 border-l-2 border-violet-light pl-3 text-sm text-gray-600">{qa.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
