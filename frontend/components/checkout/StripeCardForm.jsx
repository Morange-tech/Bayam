import Input from '@/components/ui/Input'

// Mock card fields until Stripe Elements is wired to a real backend — same field names a real form would post.
export default function StripeCardForm({ register, errors }) {
  return (
    <div className="space-y-3 rounded-xl bg-beige-card p-4">
      <div>
        <Input {...register('cardNumber')} placeholder="1234 1234 1234 1234" inputMode="numeric" />
        {errors.cardNumber && <p className="mt-1 text-xs text-red-500">{errors.cardNumber.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input {...register('cardExpiry')} placeholder="MM/AA" />
          {errors.cardExpiry && <p className="mt-1 text-xs text-red-500">{errors.cardExpiry.message}</p>}
        </div>
        <div>
          <Input {...register('cardCvc')} placeholder="CVC" inputMode="numeric" />
          {errors.cardCvc && <p className="mt-1 text-xs text-red-500">{errors.cardCvc.message}</p>}
        </div>
      </div>
    </div>
  )
}
