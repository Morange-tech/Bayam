// Mirrors backend/app/Enums/StaffRole.php — keep labels/sections in sync.
export const STAFF_ROLES = [
  { value: 'comptable', label: 'Comptable', sections: ['finances'] },
  { value: 'commandes', label: 'Gestionnaire commandes', sections: ['commandes'] },
  { value: 'catalogue', label: 'Gestionnaire catalogue', sections: ['catalogue'] },
  { value: 'support', label: 'Support client', sections: ['utilisateurs'] },
]

export function staffRoleLabel(value) {
  return STAFF_ROLES.find((role) => role.value === value)?.label ?? value
}

// Maps each admin/* route prefix to the staff.section key the backend gates
// it behind (routes/api.php) — mirrors backend/app/Enums/StaffRole.php.
// A route with no entry here is admin-only, unreachable by any staff poste.
export const ROUTE_SECTIONS = {
  '/admin/finances': 'finances',
  '/admin/commandes': 'commandes',
  '/admin/produits': 'catalogue',
  '/admin/promotions': 'catalogue',
  '/admin/utilisateurs': 'utilisateurs',
}

export function sectionForPath(pathname) {
  const match = Object.keys(ROUTE_SECTIONS).find((prefix) => pathname.startsWith(prefix))
  return match ? ROUTE_SECTIONS[match] : null
}

// A staff account's default landing page — the first admin/* route its poste
// can reach — so e.g. a Comptable lands on /admin/finances instead of the
// (admin-only) /admin overview.
export function firstAllowedPath(staffSections) {
  const entry = Object.entries(ROUTE_SECTIONS).find(([, section]) => staffSections.includes(section))
  return entry?.[0] ?? '/connexion'
}

// Single source of truth for "where does this user land right after login" —
// used by the login page so every role reaches its own dashboard instead of
// the customer storefront (see app/(admin)/layout.js for the guard that
// enforces the same mapping on every subsequent navigation).
export function resolvePostLoginPath(user) {
  if (user.role === 'admin') return '/admin'
  if (user.role === 'staff') return firstAllowedPath(user.staffSections ?? [])
  return '/'
}
