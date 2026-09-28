'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import StepIndicator from '@/components/checkout/StepIndicator'
import OrderSummary from '@/components/checkout/OrderSummary'
import useCartStore from '@/stores/cartStore'

export default function CheckoutLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const isConfirmation = pathname.startsWith('/checkout/confirmation')
  const itemCount = useCartStore((state) => state.items.length)
  const hasHydrated = useCartStore((state) => state.hasHydrated)

  const currentStep = pathname.includes('paiement') ? 'paiement' : 'livraison'

  useEffect(() => {
    if (!isConfirmation && hasHydrated && itemCount === 0) {
      router.replace('/panier')
    }
  }, [isConfirmation, hasHydrated, itemCount, router])

  // The confirmation page clears the cart on arrival, so it renders outside the cart-empty guard
  // and skips the step indicator / order-summary sidebar used by the form steps.
  if (isConfirmation) return children

  if (!hasHydrated || itemCount === 0) return null

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8">
        <StepIndicator current={currentStep} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div>{children}</div>
        <OrderSummary />
      </div>
    </div>
  )
}
