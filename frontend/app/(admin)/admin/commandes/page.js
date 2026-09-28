'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'
import Select from '@/components/ui/Select'
import EmptyState from '@/components/ui/EmptyState'
import { ShoppingBag } from 'lucide-react'
import { ORDER_STATUS, PAYMENT_METHOD_LABELS } from '@/lib/orders'
import { formatDate, formatPrice } from '@/lib/utils'
import useAdminOrdersStore from '@/stores/adminOrdersStore'

const STATUS_FILTERS = [{ value: 'all', label: 'Toutes' }, ...Object.entries(ORDER_STATUS).map(([value, s]) => ({ value, label: s.label }))]

export default function AdminCommandesPage() {
  const orders = useAdminOrdersStore((state) => state.orders)
  const hasHydrated = useAdminOrdersStore((state) => state.hasHydrated)
  const updateStatus = useAdminOrdersStore((state) => state.updateStatus)
  const [statusFilter, setStatusFilter] = useState('all')

  if (!hasHydrated) return null

  const visibleOrders = orders
    .filter((order) => statusFilter === 'all' || order.status === statusFilter)
    .sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt))

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-violet-deep">Commandes</h1>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === filter.value
                  ? 'bg-violet-active text-white'
                  : 'bg-beige-card text-gray-600 hover:bg-violet-light'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {visibleOrders.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="Aucune commande" description="Aucune commande ne correspond à ce filtre." />
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-beige-border text-xs uppercase text-gray-400">
                  <th className="px-5 py-3 font-medium">N°</th>
                  <th className="px-5 py-3 font-medium">Acheteur</th>
                  <th className="px-5 py-3 font-medium">Montant</th>
                  <th className="px-5 py-3 font-medium">Paiement</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-border">
                {visibleOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-violet-deep">#{order.id}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-violet-deep">{order.buyer.name}</td>
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-violet-deep">
                      {formatPrice(order.total)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                      {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">{formatDate(order.placedAt)}</td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={ORDER_STATUS[order.status].badge}>{ORDER_STATUS[order.status].label}</Badge>
                        <Select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="h-8 w-auto py-0 pl-2 pr-7 text-xs"
                        >
                          {Object.entries(ORDER_STATUS).map(([value, s]) => (
                            <option key={value} value={value}>
                              {s.label}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
