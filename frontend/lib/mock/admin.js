// Deterministic (no Math.random) so server-rendered and client-rendered charts always match.
function generateSalesData(days) {
  const data = []
  const today = new Date('2026-09-17T00:00:00.000Z')

  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayIndex = days - i
    const wave = Math.sin(dayIndex / 4.5) * 180000 + Math.sin(dayIndex / 11) * 90000
    const trend = dayIndex * 4200
    const weekendBoost = date.getDay() === 0 || date.getDay() === 6 ? 120000 : 0
    const revenue = Math.max(60000, Math.round(620000 + wave + trend + weekendBoost))
    data.push({ date: date.toISOString().slice(0, 10), revenue })
  }

  return data
}

export const salesData = generateSalesData(90)

export const adminOrders = [
  {
    id: 'BYM-20260916-9012',
    buyer: { name: 'Aurélie Fotso', email: 'aurelie.fotso@example.com' },
    total: 49000,
    paymentMethod: 'cod',
    status: 'processing',
    placedAt: '2026-09-16T08:05:00.000Z',
  },
  {
    id: 'BYM-20260916-4471',
    buyer: { name: 'Blaise Nkeng', email: 'blaise.nkeng@example.com' },
    total: 26500,
    paymentMethod: 'orange',
    status: 'processing',
    placedAt: '2026-09-16T14:22:00.000Z',
  },
  {
    id: 'BYM-20260915-3305',
    buyer: { name: 'Carine Owona', email: 'carine.owona@example.com' },
    total: 53500,
    paymentMethod: 'mtn',
    status: 'shipped',
    placedAt: '2026-09-15T10:40:00.000Z',
  },
  {
    id: 'BYM-20260914-7719',
    buyer: { name: 'Didier Essomba', email: 'didier.essomba@example.com' },
    total: 150100,
    paymentMethod: 'mtn',
    status: 'delivered',
    placedAt: '2026-09-14T09:15:00.000Z',
  },
  {
    id: 'BYM-20260913-2288',
    buyer: { name: 'Estelle Mbarga', email: 'estelle.mbarga@example.com' },
    total: 65000,
    paymentMethod: 'card',
    status: 'delivered',
    placedAt: '2026-09-13T11:05:00.000Z',
  },
  {
    id: 'BYM-20260912-6634',
    buyer: { name: 'Franck Biya', email: 'franck.biya@example.com' },
    total: 31300,
    paymentMethod: 'cod',
    status: 'delivered',
    placedAt: '2026-09-12T16:50:00.000Z',
  },
  {
    id: 'BYM-20260911-9903',
    buyer: { name: 'Ghislaine Tchoumi', email: 'ghislaine.tchoumi@example.com' },
    total: 37500,
    paymentMethod: 'orange',
    status: 'cancelled',
    placedAt: '2026-09-11T13:00:00.000Z',
  },
  {
    id: 'BYM-20260910-1250',
    buyer: { name: 'Herve Ndongo', email: 'herve.ndongo@example.com' },
    total: 154000,
    paymentMethod: 'card',
    status: 'delivered',
    placedAt: '2026-09-10T07:40:00.000Z',
  },
]

export const alerts = [
  { id: 'a1', message: '4 produits sont en rupture de stock.', type: 'stock' },
  { id: 'a2', message: '2 commandes en attente de confirmation depuis plus de 24h.', type: 'orders' },
]

// Exact figures/copy from the admin dashboard design (Vue d'ensemble) — kept
// separate from `adminOrders`/`salesData` above (different shape, used by the
// design-matched overview page only).
export const platformOverview = {
  kpis: {
    revenueToday: '6 840 000 F',
    revenueTodayTrend: '+12% vs hier',
    activeOrders: 142,
    newUsers7d: 318,
    activeVendors: 486,
    registeredVendors: 512,
  },
  revenueChart: {
    points: 'M40,150 L92,140 L144,158 L196,132 L248,120 L300,138 L352,100 L404,112 L456,80 L508,92 L560,60 L612,44 L650,36',
    yLabels: ['10M', '7M', '3M', '0'],
    xLabels: ['Jour 1', 'Jour 15', 'Jour 30'],
  },
  newUsersSparkline: 'M0,22 L12,20 L24,16 L36,17 L48,10 L60,8 L72,3',
  paymentBreakdown: [
    { label: 'Mobile Money', color: '#6D28D9', percent: 62 },
    { label: 'Carte bancaire', color: '#B8966E', percent: 23 },
    { label: 'Commande WhatsApp', color: '#A78BFA', percent: 15 },
  ],
  paymentTransactionsTotal: '1 842',
  recentOrders: [
    {
      id: '#BY-10482',
      buyer: 'Larissa Ekwalla',
      vendor: 'TechStore CM',
      amount: '185 000 F',
      payment: { method: 'mtn', label: 'MTN MoMo', color: '#FFCC00' },
      status: 'pending',
      date: '07 sept.',
    },
    {
      id: '#BY-10481',
      buyer: 'Éric F.',
      vendor: 'ElectroPlus',
      amount: '32 000 F',
      payment: { method: 'orange', label: 'Orange Money', color: '#FF6600' },
      status: 'shipped',
      date: '07 sept.',
    },
    {
      id: '#BY-10479',
      buyer: 'Aïcha N.',
      vendor: 'GadgetHub',
      amount: '8 500 F',
      payment: { method: 'card', label: 'Carte' },
      status: 'delivered',
      date: '06 sept.',
    },
    {
      id: '#BY-10477',
      buyer: 'Moussa T.',
      vendor: 'Boutique Amina',
      amount: '15 500 F',
      payment: { method: 'whatsapp', label: 'WhatsApp' },
      status: 'cancelled',
      date: '06 sept.',
    },
    {
      id: '#BY-10475',
      buyer: 'Chantal S.',
      vendor: 'SmartWorld',
      amount: '64 900 F',
      payment: { method: 'mtn', label: 'MTN MoMo', color: '#FFCC00' },
      status: 'delivered',
      date: '05 sept.',
    },
  ],
  platformAlerts: [
    {
      id: 'vendors-pending',
      tone: 'alert',
      title: '3 vendeurs en attente de validation',
      description: 'Documents à vérifier avant activation',
      cta: 'Traiter',
    },
    {
      id: 'products-reported',
      tone: 'warning',
      title: '12 produits signalés par des utilisateurs',
      description: 'À examiner pour non-conformité',
      cta: 'Traiter',
    },
  ],
}

export const adminUsers = [
  { id: 'u1', firstName: 'Aurélie', lastName: 'Fotso', email: 'aurelie.fotso@example.com', joinedAt: '2026-03-12', ordersCount: 8, banned: false },
  { id: 'u2', firstName: 'Blaise', lastName: 'Nkeng', email: 'blaise.nkeng@example.com', joinedAt: '2026-04-02', ordersCount: 3, banned: false },
  { id: 'u3', firstName: 'Carine', lastName: 'Owona', email: 'carine.owona@example.com', joinedAt: '2026-04-20', ordersCount: 12, banned: false },
  { id: 'u4', firstName: 'Didier', lastName: 'Essomba', email: 'didier.essomba@example.com', joinedAt: '2026-05-05', ordersCount: 1, banned: false },
  { id: 'u5', firstName: 'Estelle', lastName: 'Mbarga', email: 'estelle.mbarga@example.com', joinedAt: '2026-05-18', ordersCount: 5, banned: false },
  { id: 'u6', firstName: 'Franck', lastName: 'Biya', email: 'franck.biya@example.com', joinedAt: '2026-06-01', ordersCount: 0, banned: true },
  { id: 'u7', firstName: 'Ghislaine', lastName: 'Tchoumi', email: 'ghislaine.tchoumi@example.com', joinedAt: '2026-06-14', ordersCount: 2, banned: false },
  { id: 'u8', firstName: 'Herve', lastName: 'Ndongo', email: 'herve.ndongo@example.com', joinedAt: '2026-07-09', ordersCount: 9, banned: false },
]

export const reports = [
  { id: 'r1', title: 'Rapport de ventes', description: 'Chiffre d’affaires journalier sur 90 jours', period: 'Sept. 2026', dataset: 'sales' },
  { id: 'r2', title: 'Rapport des commandes', description: 'Détail des commandes avec statut et paiement', period: 'Sept. 2026', dataset: 'orders' },
  { id: 'r3', title: 'Rapport des utilisateurs', description: 'Liste des comptes clients et leur activité', period: 'Sept. 2026', dataset: 'users' },
]

export const promotions = [
  {
    id: 'promo-1',
    code: 'BAYAM10',
    type: 'percent',
    value: 10,
    expiresAt: '2026-10-31',
    maxUses: 500,
    currentUses: 128,
    active: true,
  },
  {
    id: 'promo-2',
    code: 'BAYAM5000',
    type: 'flat',
    value: 5000,
    expiresAt: '2026-09-30',
    maxUses: 200,
    currentUses: 64,
    active: true,
  },
  {
    id: 'promo-3',
    code: 'WELCOME15',
    type: 'percent',
    value: 15,
    expiresAt: '2026-09-20',
    maxUses: 1000,
    currentUses: 940,
    active: true,
  },
  {
    id: 'promo-4',
    code: 'FLASH2026',
    type: 'flat',
    value: 3000,
    expiresAt: '2026-08-15',
    maxUses: 300,
    currentUses: 300,
    active: false,
  },
]
