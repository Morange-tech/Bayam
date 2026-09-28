'use client'

import { useState } from 'react'
import { Plus, Tag, Trash2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import EmptyState from '@/components/ui/EmptyState'
import { formatDate, formatPrice } from '@/lib/utils'
import useAdminPromotionsStore from '@/stores/adminPromotionsStore'

const emptyForm = { code: '', type: 'percent', value: '', expiresAt: '', maxUses: '' }

export default function AdminPromotionsPage() {
  const promotions = useAdminPromotionsStore((state) => state.promotions)
  const hasHydrated = useAdminPromotionsStore((state) => state.hasHydrated)
  const addPromotion = useAdminPromotionsStore((state) => state.addPromotion)
  const toggleActive = useAdminPromotionsStore((state) => state.toggleActive)
  const deletePromotion = useAdminPromotionsStore((state) => state.deletePromotion)

  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function closeForm() {
    setFormOpen(false)
    setForm(emptyForm)
    setError(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const code = form.code.trim().toUpperCase()

    if (!code) {
      setError('Le code est requis')
      return
    }
    if (!form.value || Number(form.value) <= 0) {
      setError('Valeur invalide')
      return
    }
    if (promotions.some((p) => p.code === code)) {
      setError('Ce code existe déjà')
      return
    }

    addPromotion({
      code,
      type: form.type,
      value: Number(form.value),
      expiresAt: form.expiresAt || null,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
    })
    closeForm()
  }

  if (!hasHydrated) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-violet-deep">Promotions</h1>
        <Button onClick={() => setFormOpen((v) => !v)}>
          <Plus className="mr-1.5 h-4 w-4" /> Créer un code promo
        </Button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-card">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Field label="Code">
              <Input
                value={form.code}
                onChange={(e) => updateField('code', e.target.value)}
                placeholder="BAYAM10"
              />
            </Field>
            <Field label="Type">
              <Select value={form.type} onChange={(e) => updateField('type', e.target.value)}>
                <option value="percent">Pourcentage (%)</option>
                <option value="flat">Montant fixe (FCFA)</option>
              </Select>
            </Field>
            <Field label="Valeur">
              <Input
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => updateField('value', e.target.value)}
              />
            </Field>
            <Field label="Expire le">
              <Input type="date" value={form.expiresAt} onChange={(e) => updateField('expiresAt', e.target.value)} />
            </Field>
            <Field label="Utilisations max">
              <Input
                type="number"
                min="0"
                value={form.maxUses}
                onChange={(e) => updateField('maxUses', e.target.value)}
                placeholder="Illimité"
              />
            </Field>
          </div>
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="mt-4 flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={closeForm}>
              Annuler
            </Button>
            <Button type="submit">Créer le code</Button>
          </div>
        </form>
      )}

      {promotions.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="Aucun code promo"
          description="Créez votre premier code promo pour animer les ventes."
        />
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-beige-border text-xs uppercase text-gray-400">
                  <th className="px-5 py-3 font-medium">Code</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Valeur</th>
                  <th className="px-5 py-3 font-medium">Expire le</th>
                  <th className="px-5 py-3 font-medium">Utilisations</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-border">
                {promotions.map((promo) => (
                  <tr key={promo.id}>
                    <td className="whitespace-nowrap px-5 py-3 font-mono font-medium text-violet-deep">
                      {promo.code}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                      {promo.type === 'percent' ? 'Pourcentage' : 'Montant fixe'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-violet-deep">
                      {promo.type === 'percent' ? `${promo.value}%` : formatPrice(promo.value)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                      {promo.expiresAt ? formatDate(promo.expiresAt) : '—'}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-gray-500">
                      {promo.currentUses}
                      {promo.maxUses ? ` / ${promo.maxUses}` : ''}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <button type="button" onClick={() => toggleActive(promo.id)} className="inline-flex">
                        <Badge variant={promo.active ? 'success' : 'default'}>
                          {promo.active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </button>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3">
                      <button
                        type="button"
                        onClick={() => deletePromotion(promo.id)}
                        aria-label="Supprimer"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600"
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
