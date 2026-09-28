'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, UserCog } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import { createStaff, deleteStaff, fetchStaff } from '@/lib/data/staff'
import { STAFF_ROLES, staffRoleLabel } from '@/lib/staff'

const emptyForm = { firstName: '', lastName: '', email: '', password: '', staffRole: STAFF_ROLES[0].value }

export default function AdminEquipePage() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchStaff()
      .then(setStaff)
      .finally(() => setLoading(false))
  }, [])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function closeForm() {
    setFormOpen(false)
    setForm(emptyForm)
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const created = await createStaff(form)
      setStaff((prev) => [created, ...prev])
      closeForm()
    } catch (err) {
      const validation = err.response?.data?.errors
      setError(
        Object.values(validation ?? {})[0]?.[0] ?? err.response?.data?.message ?? 'Une erreur est survenue.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    setDeletingId(id)
    try {
      await deleteStaff(id)
      setStaff((prev) => prev.filter((member) => member.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-violet-deep">Équipe</h1>
          <p className="mt-1 text-[13px] text-text-secondary">
            Créez des comptes staff avec un accès limité à leur poste — un comptable, par exemple, ne peut gérer
            que les finances.
          </p>
        </div>
        <Button onClick={() => setFormOpen((v) => !v)}>
          <Plus className="mr-1.5 h-4 w-4" /> Ajouter un membre
        </Button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-card">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Field label="Prénom">
              <Input value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} required />
            </Field>
            <Field label="Nom">
              <Input value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} required />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
              />
            </Field>
            <Field label="Mot de passe">
              <Input
                type="password"
                value={form.password}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder="Min. 8 caractères"
                required
              />
            </Field>
            <Field label="Poste">
              <Select value={form.staffRole} onChange={(e) => updateField('staffRole', e.target.value)}>
                {STAFF_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <p className="mt-3 text-xs text-text-secondary">
            Sections accessibles pour ce poste :{' '}
            <span className="font-medium text-violet-deep">
              {STAFF_ROLES.find((r) => r.value === form.staffRole)?.sections.join(', ')}
            </span>
          </p>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={closeForm}>
              Annuler
            </Button>
            <Button type="submit" loading={submitting}>
              Créer le compte
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : staff.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title="Aucun membre du staff"
          description="Ajoutez un comptable, un gestionnaire de commandes ou de catalogue pour déléguer une partie de l'administration."
        />
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-beige-border text-xs uppercase text-gray-400">
                  <th className="px-5 py-3 font-medium">Nom</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Poste</th>
                  <th className="px-5 py-3 font-medium">Accès</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-border">
                {staff.map((member) => (
                  <tr key={member.id}>
                    <td className="whitespace-nowrap px-5 py-3 font-medium text-violet-deep">
                      {member.firstName} {member.lastName}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">{member.email}</td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <Badge variant="default">{staffRoleLabel(member.staffRole)}</Badge>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                      {member.staffSections?.join(', ')}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <button
                        type="button"
                        onClick={() => handleDelete(member.id)}
                        disabled={deletingId === member.id}
                        aria-label="Supprimer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-violet-deep">{label}</label>
      {children}
    </div>
  )
}
