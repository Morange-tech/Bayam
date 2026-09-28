'use client'

import { useSearchParams } from 'next/navigation'
import { PackageSearch } from 'lucide-react'
import FilterPills from '@/components/account/FilterPills'
import OrderCard from '@/components/account/OrderCard'
import Pagination from '@/components/shop/Pagination'
import EmptyState from '@/components/ui/EmptyState'
import useOrdersStore from '@/stores/ordersStore'

const PAGE_SIZE = 4
const ACTIVE_STATUSES = ['processing', 'shipped']

export default function OrdersPage() {
  const searchParams = useSearchParams()
  const orders = useOrdersStore((state) => state.orders)

  const status = searchParams.get('status') || 'all'
  const page = Number(searchParams.get('page')) || 1

  let filtered = [...orders].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))
  if (status !== 'all') {
    filtered =
      status === 'active'
        ? filtered.filter((o) => ACTIVE_STATUSES.includes(o.status))
        : filtered.filter((o) => o.status === status)
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const pageOrders = filtered.slice(start, start + PAGE_SIZE)

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-violet-deep">Mes commandes</h1>

      <FilterPills active={status} />

      {pageOrders.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="Aucune commande"
          description="Vous n'avez pas encore de commande dans cette catégorie."
          className="mt-6"
        />
      ) : (
        <div className="mt-6 space-y-4">
          {pageOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} />
    </div>
  )
}
