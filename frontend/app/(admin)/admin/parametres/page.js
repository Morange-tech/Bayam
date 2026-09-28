'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import useAdminSettingsStore from '@/stores/adminSettingsStore'
import useToastStore from '@/stores/toastStore'

export default function AdminParametresPage() {
  const settings = useAdminSettingsStore((state) => state.settings)
  const hasHydrated = useAdminSettingsStore((state) => state.hasHydrated)
  const updateSettings = useAdminSettingsStore((state) => state.updateSettings)
  const showToast = useToastStore((state) => state.showToast)

  const [form, setForm] = useState(settings)

  useEffect(() => {
    if (hasHydrated) setForm(settings)
  }, [hasHydrated, settings])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    updateSettings(form)
    showToast('Paramètres enregistrés')
  }

  if (!hasHydrated) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-violet-deep">Paramètres</h1>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4 rounded-xl bg-white p-6 shadow-card">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-violet-deep">Nom de la boutique</label>
          <Input value={form.storeName} onChange={(e) => updateField('storeName', e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-violet-deep">Email de contact</label>
          <Input
            type="email"
            value={form.contactEmail}
            onChange={(e) => updateField('contactEmail', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-violet-deep">Téléphone support</label>
          <Input value={form.supportPhone} onChange={(e) => updateField('supportPhone', e.target.value)} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-violet-deep">Devise</label>
          <Input value="XAF (Franc CFA)" disabled className="bg-beige-base text-gray-500" />
        </div>
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={form.maintenanceMode}
            onChange={(e) => updateField('maintenanceMode', e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-beige-border accent-violet-active"
          />
          <span className="text-sm text-gray-600">
            Mode maintenance — désactive temporairement l&apos;accès à la boutique pour les clients
          </span>
        </label>

        <div className="flex justify-end pt-2">
          <Button type="submit">
            <Save className="mr-1.5 h-4 w-4" /> Enregistrer
          </Button>
        </div>
      </form>
    </div>
  )
}
