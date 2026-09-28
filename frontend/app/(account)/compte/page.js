'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Heart, Package, Truck, Wallet } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import { fetchAccountStats, fetchRecentOrders } from '@/lib/data/account'
import { ORDER_STATUS } from '@/lib/orders'
import useFavoritesStore from '@/stores/favoritesStore'
import { formatDate, formatPrice } from '@/lib/utils'

export default function AccountDashboardPage() {
  const favoritesCount = useFavoritesStore((state) => state.ids.length)
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchAccountStats().then(setStats), fetchRecentOrders(3).then(setRecentOrders)]).then(() =>
      setLoading(false)
    )
  }, [])

  const kpis = [
    { label: 'Total commandes', value: stats?.totalOrders ?? '—', icon: Package },
    { label: 'En cours', value: stats?.activeOrders ?? '—', icon: Truck },
    { label: 'Favoris', value: favoritesCount, icon: Heart },
    { label: 'Économisé', value: stats ? formatPrice(stats.totalSaved) : '—', icon: Wallet },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-violet-deep">Tableau de bord</h1>

      <div className="grid grid-cols-2 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <KpiCardSkeleton key={i} />)
          : kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-xl bg-white p-5 shadow-card">
                <span className="mb-3 inline-flex rounded-lg bg-violet-light p-2 text-violet-active">
                  <kpi.icon className="h-5 w-5" />
                </span>
                <p className="text-2xl font-bold text-violet-deep">{kpi.value}</p>
                <p className="text-sm text-gray-500">{kpi.label}</p>
              </div>
            ))}
      </div>

      <div className="rounded-xl bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-beige-border p-5">
          <h2 className="font-bold text-violet-deep">Commandes récentes</h2>
          <Link href="/compte/commandes" className="text-sm text-violet-active hover:underline">
            Voir tout
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-beige-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <OrderRowSkeleton key={i} />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="p-5 text-sm text-gray-500">Aucune commande pour le moment.</p>
        ) : (
          <div className="divide-y divide-beige-border">
            {recentOrders.map((order) => {
              const status = ORDER_STATUS[order.status]
              return (
                <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-mono text-sm font-medium text-violet-deep">#{order.id}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.placedAt)}</p>
                  </div>
                  <p className="font-medium text-violet-deep">{formatPrice(order.total)}</p>
                  <Badge variant={status.badge}>{status.label}</Badge>
                  <Link href={`/compte/commandes/${order.id}`}>
                    <Button size="sm" variant="secondary">
                      Voir
                    </Button>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function KpiCardSkeleton() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card">
      <Skeleton className="mb-3 h-9 w-9 rounded-lg" />
      <Skeleton className="h-7 w-14" />
      <Skeleton className="mt-2 h-4 w-20" />
    </div>
  )
}

function OrderRowSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-8 w-14" />
    </div>
  )
}
