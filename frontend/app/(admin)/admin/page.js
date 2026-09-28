'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowUp, Flag } from 'lucide-react'
import { PaymentDonut, PaymentDonutLegend, PaymentTag, RevenueChart, STATUS_STYLES } from '@/components/admin/OverviewCharts'
import Skeleton from '@/components/ui/Skeleton'
import { fetchPlatformOverview } from '@/lib/data/admin'
import { cn } from '@/lib/utils'

const STATUS_FILTERS = [
  { value: 'all', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
]

const ALERT_STYLES = {
  alert: { bg: '#FBEAE8', icon: '#C0392B', button: 'bg-[#C0392B] hover:bg-[#a52d20]', Icon: AlertTriangle },
  warning: { bg: '#FDF1E3', icon: '#B45309', button: 'bg-[#B45309] hover:bg-[#94430a]', Icon: Flag },
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchPlatformOverview().then(setOverview)
  }, [])

  if (!overview) return <OverviewSkeleton />

  const { kpis, revenueChart, newUsersSparkline, paymentBreakdown, paymentTransactionsTotal, recentOrders, platformAlerts } =
    overview

  const visibleOrders =
    statusFilter === 'all' ? recentOrders : recentOrders.filter((order) => order.status === statusFilter)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-violet-deep">Vue d&apos;ensemble</h1>
        <p className="mt-1 text-[13px] text-text-secondary">Activité de la plateforme BAYAM</p>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="CA du jour">
          <p className="mt-2 text-2xl font-extrabold text-violet-deep">{kpis.revenueToday}</p>
          <div className="mt-2 flex items-center gap-1">
            <ArrowUp className="h-[13px] w-[13px] text-[#1A7A45]" strokeWidth={2.5} />
            <span className="text-xs font-bold text-[#1A7A45]">{kpis.revenueTodayTrend}</span>
          </div>
        </KpiCard>

        <KpiCard label="Commandes actives">
          <p className="mt-2 text-2xl font-extrabold text-violet-deep">{kpis.activeOrders}</p>
          <button
            type="button"
            className="mt-2.5 rounded-md bg-violet-active px-4 py-1.5 text-xs font-bold text-white hover:bg-violet-active-hover"
          >
            Voir
          </button>
        </KpiCard>

        <KpiCard label="Nouveaux utilisateurs (7j)">
          <div className="mt-2 flex items-end justify-between gap-2.5">
            <span className="text-2xl font-extrabold text-violet-deep">{kpis.newUsers7d}</span>
            <svg width="72" height="28" viewBox="0 0 72 28" className="shrink-0">
              <path
                d={newUsersSparkline}
                fill="none"
                stroke="#6D28D9"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="72" cy="3" r="2.5" fill="#6D28D9" />
            </svg>
          </div>
        </KpiCard>

        <KpiCard label="Vendeurs actifs">
          <p className="mt-2 text-2xl font-extrabold text-violet-deep">{kpis.activeVendors}</p>
          <p className="mt-2 text-xs text-text-secondary">Sur {kpis.registeredVendors} inscrits</p>
        </KpiCard>
      </div>

      {/* CHARTS ROW */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[10px] border border-beige-border bg-white p-6">
          <p className="text-base font-bold text-violet-deep">Évolution du CA (30 jours)</p>
          <div className="mt-5">
            <RevenueChart points={revenueChart.points} yLabels={revenueChart.yLabels} xLabels={revenueChart.xLabels} />
          </div>
        </div>

        <div className="rounded-[10px] border border-beige-border bg-white p-6">
          <p className="text-base font-bold text-violet-deep">Répartition des paiements</p>
          <PaymentDonut breakdown={paymentBreakdown} total={paymentTransactionsTotal} />
          <PaymentDonutLegend breakdown={paymentBreakdown} />
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="mt-6 overflow-hidden rounded-[10px] border border-beige-border bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-5">
          <p className="text-base font-bold text-violet-deep">Dernières commandes</p>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  'rounded-md border border-beige-border bg-white px-[15px] py-[7px] text-xs font-bold text-text-secondary',
                  statusFilter === filter.value && 'border-violet-deep bg-violet-deep text-white'
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3.5 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                {['ID', 'Acheteur', 'Vendeur', 'Montant', 'Paiement', 'Statut', 'Date', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap border-b border-beige-border px-[18px] py-3 text-[11px] font-bold uppercase tracking-wide text-text-secondary"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => {
                const status = STATUS_STYLES[order.status]
                return (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap border-b border-beige-border px-[18px] py-[13px] text-[13px] font-bold text-[#1E1026]">
                      {order.id}
                    </td>
                    <td className="whitespace-nowrap border-b border-beige-border px-[18px] py-[13px] text-[13px] text-[#1E1026]">
                      {order.buyer}
                    </td>
                    <td className="whitespace-nowrap border-b border-beige-border px-[18px] py-[13px] text-[13px] text-[#1E1026]">
                      {order.vendor}
                    </td>
                    <td className="whitespace-nowrap border-b border-beige-border px-[18px] py-[13px] text-[13px] font-bold text-violet-deep">
                      {order.amount}
                    </td>
                    <td className="whitespace-nowrap border-b border-beige-border px-[18px] py-[13px] text-[13px]">
                      <PaymentTag payment={order.payment} />
                    </td>
                    <td className="whitespace-nowrap border-b border-beige-border px-[18px] py-[13px]">
                      <span
                        className="inline-block rounded-full px-[11px] py-1 text-[11px] font-bold"
                        style={{ background: status.bg, color: status.text }}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap border-b border-beige-border px-[18px] py-[13px] text-[13px] text-text-secondary">
                      {order.date}
                    </td>
                    <td className="whitespace-nowrap border-b border-beige-border px-[18px] py-[13px]">
                      <a href="#" className="text-xs font-bold text-violet-active hover:text-violet-active-hover">
                        Voir
                      </a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* URGENT ALERTS */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        {platformAlerts.map((alert) => {
          const style = ALERT_STYLES[alert.tone]
          const Icon = style.Icon
          return (
            <div
              key={alert.id}
              className="flex items-center gap-4 rounded-[10px] p-5"
              style={{ background: style.bg }}
            >
              <Icon className="h-[26px] w-[26px] shrink-0" style={{ color: style.icon }} strokeWidth={1.8} />
              <div className="flex-1">
                <p className="text-sm font-bold text-[#1E1026]">{alert.title}</p>
                <p className="mt-0.5 text-xs text-text-secondary">{alert.description}</p>
              </div>
              <button
                type="button"
                className={cn('shrink-0 rounded-lg px-[18px] py-2.5 text-xs font-bold text-white', style.button)}
              >
                {alert.cta}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KpiCard({ label, children }) {
  return (
    <div className="rounded-[10px] border border-beige-border bg-white p-5">
      <p className="text-xs font-semibold text-text-secondary">{label}</p>
      {children}
    </div>
  )
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-[10px]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-72 rounded-[10px]" />
        <Skeleton className="h-72 rounded-[10px]" />
      </div>
      <Skeleton className="h-64 rounded-[10px]" />
    </div>
  )
}
