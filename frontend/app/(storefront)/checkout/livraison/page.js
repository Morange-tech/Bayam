'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight } from 'lucide-react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { CITIES, DELIVERY_MODES } from '@/lib/checkout'
import { cn, formatPrice } from '@/lib/utils'
import useCheckoutStore from '@/stores/checkoutStore'

const deliverySchema = z.object({
  firstName: z.string().min(2, 'Prénom trop court'),
  lastName: z.string().min(2, 'Nom trop court'),
  phone: z.string().regex(/^(\+237|237)?6[5-9]\d{7}$/, 'Numéro de téléphone camerounais invalide'),
  city: z.string().min(1, 'Sélectionnez une ville'),
  neighborhood: z.string().min(2, 'Quartier trop court'),
  address: z.string().min(5, 'Adresse trop courte'),
  instructions: z.string().optional(),
  deliveryMode: z.enum(['standard', 'express']),
})

export default function DeliveryPage() {
  const router = useRouter()
  const savedDelivery = useCheckoutStore((state) => state.delivery)
  const setDelivery = useCheckoutStore((state) => state.setDelivery)
  const setDeliveryMode = useCheckoutStore((state) => state.setDeliveryMode)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      firstName: savedDelivery?.firstName || '',
      lastName: savedDelivery?.lastName || '',
      phone: savedDelivery?.phone || '',
      city: savedDelivery?.city || '',
      neighborhood: savedDelivery?.neighborhood || '',
      address: savedDelivery?.address || '',
      instructions: savedDelivery?.instructions || '',
      deliveryMode: savedDelivery?.deliveryMode || 'standard',
    },
  })

  const deliveryMode = watch('deliveryMode')

  useEffect(() => {
    setDeliveryMode(deliveryMode)
  }, [deliveryMode, setDeliveryMode])

  function onSubmit(data) {
    setDelivery(data)
    router.push('/checkout/paiement')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-2xl bg-white p-6 shadow-card">
      <h1 className="mb-6 text-xl font-bold text-violet-deep">Adresse de livraison</h1>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Prénom" error={errors.firstName?.message}>
          <Input {...register('firstName')} placeholder="Awa" />
        </Field>
        <Field label="Nom" error={errors.lastName?.message}>
          <Input {...register('lastName')} placeholder="Koné" />
        </Field>
      </div>

      <Field label="Téléphone" error={errors.phone?.message} className="mt-4">
        <Input {...register('phone')} type="tel" placeholder="+237 6 77 00 00 00" />
      </Field>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Field label="Ville" error={errors.city?.message}>
          <Select {...register('city')} defaultValue={savedDelivery?.city || ''}>
            <option value="" disabled>
              Sélectionnez une ville
            </option>
            {CITIES.map((city) => (
              <option key={city.value} value={city.value}>
                {city.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Quartier" error={errors.neighborhood?.message}>
          <Input {...register('neighborhood')} placeholder="Bonapriso" />
        </Field>
      </div>

      <Field label="Adresse complète" error={errors.address?.message} className="mt-4">
        <Input {...register('address')} placeholder="Rue, numéro d'immeuble, point de repère..." />
      </Field>

      <Field label="Instructions de livraison (optionnel)" className="mt-4">
        <textarea
          {...register('instructions')}
          rows={3}
          placeholder="Ex : appeler à l'arrivée, portail bleu..."
          className="w-full rounded-lg border border-beige-border bg-white px-4 py-3 text-sm text-violet-deep placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-active/30 focus:border-violet-active"
        />
      </Field>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-violet-deep">Mode de livraison</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {DELIVERY_MODES.map((mode) => (
            <label
              key={mode.value}
              className={cn(
                'relative flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors',
                deliveryMode === mode.value ? 'border-violet-active bg-beige-card' : 'border-beige-border bg-white'
              )}
            >
              {mode.value === 'express' && (
                <span className="absolute -top-2.5 right-3 rounded-full bg-violet-active px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                  Populaire
                </span>
              )}
              <input type="radio" value={mode.value} {...register('deliveryMode')} className="hidden" />
              <span
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                  deliveryMode === mode.value ? 'border-violet-active' : 'border-beige-border'
                )}
              >
                {deliveryMode === mode.value && <span className="h-2.5 w-2.5 rounded-full bg-violet-active" />}
              </span>
              <div>
                <p className="font-semibold text-violet-deep">Livraison {mode.label.toLowerCase()}</p>
                <p className="text-sm text-gray-500">{mode.duration}</p>
                <p className="mt-1 font-bold text-violet-deep">{formatPrice(mode.price)}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" className="mt-6 w-full" loading={isSubmitting}>
        Continuer vers le paiement
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  )
}

function Field({ label, error, className, children }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-violet-deep">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
