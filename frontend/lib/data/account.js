import useOrdersStore from '@/stores/ordersStore'

// Mock data until the Laravel API exists — same async shape, swap the body for an api.get() call later.
// Reads the orders store's current snapshot (not the hook) since these are plain async functions,
// not components — pages that need to react live to a cancellation use the store's hook directly.

const ACTIVE_STATUSES = ['processing', 'shipped']

function byMostRecent(a, b) {
  return new Date(b.placedAt) - new Date(a.placedAt)
}

export async function fetchAccountStats() {
  const orders = useOrdersStore.getState().orders
  return {
    totalOrders: orders.length,
    activeOrders: orders.filter((order) => ACTIVE_STATUSES.includes(order.status)).length,
    totalSaved: orders.reduce((sum, order) => sum + (order.discount || 0), 0),
  }
}

export async function fetchRecentOrders(limit = 3) {
  return [...useOrdersStore.getState().orders].sort(byMostRecent).slice(0, limit)
}

export async function fetchOrders({ status } = {}) {
  let list = [...useOrdersStore.getState().orders].sort(byMostRecent)

  if (status && status !== 'all') {
    list = status === 'active' ? list.filter((o) => ACTIVE_STATUSES.includes(o.status)) : list.filter((o) => o.status === status)
  }

  return list
}

export async function fetchOrder(id) {
  return useOrdersStore.getState().getOrder(id)
}
