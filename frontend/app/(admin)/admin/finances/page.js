'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { PaymentDonut, PaymentDonutLegend, PaymentTag, RevenueChart, STATUS_STYLES } from '@/components/admin/OverviewCharts'
import Skeleton from '@/components/ui/Skeleton'
import { fetchPlatformOverview } from '@/lib/data/admin'

// Same revenue/payments source data as the admin overview (Vue d'ensemble) —
// this page is the subset of it a Comptable's poste (`finances` section) may
// reach, per backend/app/Enums/StaffRole.php.
export default function AdminFinancesPage() {
  const [overview, setOverview] = useState(null)

  useEffect(() => {
    fetchPlatformOverview().then(setOverview)
  }, [])

  if (!overview) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
          <Skeleton className="h-72 rounded-[10px]" />
          <Skeleton className="h-72 rounded-[10px]" />
        </div>
        <Skeleton className="h-64 rounded-[10px]" />
      </div>
    )
  }

  const { kpis, revenueChart, paymentBreakdown, paymentTransactionsTotal, recentOrders } = overview

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-violet-deep">Finances</h1>
        <p className="mt-1 text-[13px] text-text-secondary">Revenus et paiements de la plateforme BAYAM</p>
      </div>

      <div className="rounded-[10px] border border-beige-border bg-white p-5 sm:max-w-xs">
        <p className="text-xs font-semibold text-text-secondary">CA du jour</p>
        <p className="mt-2 text-2xl font-extrabold text-violet-deep">{kpis.revenueToday}</p>
        <div className="mt-2 flex items-center gap-1">
          <ArrowUp className="h-[13px] w-[13px] text-[#1A7A45]" strokeWidth={2.5} />
          <span className="text-xs font-bold text-[#1A7A45]">{kpis.revenueTodayTrend}</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[10px] border border-beige-border bg-white p-6">
          <p className="text-base font-bold text-violet-deep">Évolution du CA (30 jours)</p>
          <div className="mt-5">
            <RevenueChart
              points={revenueChart.points}
              yLabels={revenueChart.yLabels}
              xLabels={revenueChart.xLabels}
              gradientId="revFillFinances"
            />
          </div>
        </div>

        <div className="rounded-[10px] border border-beige-border bg-white p-6">
          <p className="text-base font-bold text-violet-deep">Répartition des paiements</p>
          <PaymentDonut breakdown={paymentBreakdown} total={paymentTransactionsTotal} />
          <PaymentDonutLegend breakdown={paymentBreakdown} />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[10px] border border-beige-border bg-white">
        <p className="px-5 pt-5 text-base font-bold text-violet-deep">Transactions récentes</p>
        <div className="mt-3.5 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                {['ID', 'Acheteur', 'Montant', 'Paiement', 'Statut', 'Date'].map((h) => (
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
              {recentOrders.map((order) => {
                const status = STATUS_STYLES[order.status]
                return (
                  <tr key={order.id}>
                    <td className="whitespace-nowrap border-b border-beige-border px-[18px] py-[13px] text-[13px] font-bold text-[#1E1026]">
                      {order.id}
                    </td>
                    <td className="whitespace-nowrap border-b border-beige-border px-[18px] py-[13px] text-[13px] text-[#1E1026]">
                      {order.buyer}
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
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
