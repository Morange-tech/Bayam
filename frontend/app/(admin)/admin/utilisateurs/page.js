'use client'

import { useState } from 'react'
import { Search, Users } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import EmptyState from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'
import useAdminUsersStore from '@/stores/adminUsersStore'

export default function AdminUtilisateursPage() {
  const users = useAdminUsersStore((state) => state.users)
  const hasHydrated = useAdminUsersStore((state) => state.hasHydrated)
  const toggleBan = useAdminUsersStore((state) => state.toggleBan)
  const [search, setSearch] = useState('')

  if (!hasHydrated) return null

  const query = search.trim().toLowerCase()
  const visibleUsers = users.filter(
    (user) =>
      !query ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-violet-deep">Utilisateurs</h1>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client..."
            className="pl-10"
          />
        </div>
      </div>

      {visibleUsers.length === 0 ? (
        <EmptyState icon={Users} title="Aucun utilisateur" description="Aucun client ne correspond à cette recherche." />
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-beige-border text-xs uppercase text-gray-400">
                  <th className="px-5 py-3 font-medium">Nom</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Inscrit le</th>
                  <th className="px-5 py-3 font-medium">Commandes</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-border">
                {visibleUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-violet-deep">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">{user.email}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">{formatDate(user.joinedAt)}</td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">{user.ordersCount}</td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <Badge variant={user.banned ? 'danger' : 'success'}>{user.banned ? 'Banni' : 'Actif'}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <Button
                        size="sm"
                        variant={user.banned ? 'secondary' : 'danger'}
                        onClick={() => toggleBan(user.id)}
                      >
                        {user.banned ? 'Réactiver' : 'Bannir'}
                      </Button>
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
