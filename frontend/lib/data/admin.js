import { Package, ShoppingBag, Users, Wallet } from 'lucide-react'
import { adminOrders, alerts, platformOverview, salesData } from '@/lib/mock/admin'
import { formatPrice } from '@/lib/utils'

// Mock data until the Laravel API exists — same async shape, swap the body for an api.get() call later.

export async function fetchDashboardKpis() {
  const monthRevenue = salesData.slice(-30).reduce((sum, day) => sum + day.revenue, 0)

  return [
    { label: 'CA du mois', value: formatPrice(monthRevenue), trend: 12.4, icon: Wallet },
    { label: 'Commandes totales', value: '428', trend: 8.1, icon: ShoppingBag },
    { label: 'Nouveaux clients', value: '56', trend: -3.2, icon: Users },
    { label: 'Produits actifs', value: null, trend: 1.5, icon: Package },
  ]
}

export async function fetchSalesData(period = 30) {
  return salesData.slice(-period)
}

export async function fetchRecentAdminOrders(limit = 6) {
  return [...adminOrders].sort((a, b) => new Date(b.placedAt) - new Date(a.placedAt)).slice(0, limit)
}

export async function fetchAlerts() {
  return alerts
}

export async function fetchPendingOrdersCount() {
  return adminOrders.filter((order) => order.status === 'processing').length
}

// Powers the design-matched Vue d'ensemble page (app/(admin)/admin/page.js).
export async function fetchPlatformOverview() {
  return platformOverview
}
