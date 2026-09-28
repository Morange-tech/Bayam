'use client'

import { MapPin } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { CITIES } from '@/lib/checkout'
import useCheckoutStore from '@/stores/checkoutStore'

// No saved-addresses API/table exists yet — this shows the delivery address from the last
// checkout (checkoutStore.delivery) as a stand-in until a real multi-address feature is built.
export default function AddressesPage() {
  const delivery = useCheckoutStore((state) => state.delivery)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-violet-deep">Mes adresses</h1>

      {!delivery ? (
        <EmptyState
          icon={MapPin}
          title="Aucune adresse enregistrée"
          description="L'adresse utilisée lors de votre prochaine commande sera enregistrée ici."
        />
      ) : (
        <div className="rounded-xl bg-white p-5 shadow-card">
          <p className="font-medium text-violet-deep">
            {delivery.firstName} {delivery.lastName}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {delivery.address}, {delivery.neighborhood}
          </p>
          <p className="text-sm text-gray-600">
            {CITIES.find((c) => c.value === delivery.city)?.label ?? delivery.city}
          </p>
          <p className="mt-2 text-sm text-gray-500">{delivery.phone}</p>
        </div>
      )}
    </div>
  )
}
