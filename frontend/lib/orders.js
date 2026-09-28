export const ORDER_STATUS = {
  processing: { label: 'En préparation', badge: 'default' },
  shipped: { label: 'En livraison', badge: 'gold' },
  delivered: { label: 'Livrée', badge: 'success' },
  cancelled: { label: 'Annulée', badge: 'danger' },
}

export const PAYMENT_METHOD_LABELS = {
  mtn: 'MTN MoMo',
  orange: 'Orange Money',
  card: 'Carte bancaire',
  cod: 'Paiement à la livraison',
}

export const ORDER_STEPS = [
  { key: 'commandee', label: 'Commande passée' },
  { key: 'paiementConfirme', label: 'Paiement confirmé' },
  { key: 'enPreparation', label: 'Commande préparée par le vendeur' },
  { key: 'enLivraison', label: 'En cours de livraison' },
  { key: 'livree', label: 'Livré' },
]

// Turns an order's sparse { commandee, paiementConfirme, ... } timeline into the 5 fixed UI steps,
// marking everything up to the last completed key as done and the one right after as active.
export function buildTimelineSteps(order) {
  const doneUntilIndex = ORDER_STEPS.reduce(
    (acc, step, i) => (order.timeline?.[step.key] ? i : acc),
    -1
  )

  return ORDER_STEPS.map((step, i) => ({
    key: step.key,
    label: step.label,
    datetime: order.timeline?.[step.key] ?? null,
    done: i <= doneUntilIndex,
    active: i === doneUntilIndex + 1,
  }))
}

// A timestamp on "enLivraison" means the package left for delivery, not that delivery is done —
// buildTimelineSteps marks it "done" (only "livree" is left as the active step), but visually
// that in-transit moment should read as the current step, not a completed one. Shared by every
// timeline display (the full vertical tracking view and the compact inline order-card one).
export function resolveShippingSteps(order) {
  const steps = buildTimelineSteps(order)
  const shippingIndex = steps.findIndex((step) => step.key === 'enLivraison')
  const isCurrentlyShipping = shippingIndex !== -1 && steps[shippingIndex].done && !steps[shippingIndex + 1]?.done

  if (!isCurrentlyShipping) return steps

  return steps.map((step, i) => {
    if (i === shippingIndex) return { ...step, done: false, active: true }
    if (i === shippingIndex + 1) return { ...step, active: false }
    return step
  })
}
