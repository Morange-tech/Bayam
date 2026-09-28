'use client'

import { useState } from 'react'
import { Bell, Send } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import EmptyState from '@/components/ui/EmptyState'
import { formatDate } from '@/lib/utils'
import useAdminNotificationsStore from '@/stores/adminNotificationsStore'
import useToastStore from '@/stores/toastStore'

const TARGETS = [
  { value: 'all', label: 'Tous les clients' },
  { value: 'active', label: 'Clients actifs (7 derniers jours)' },
  { value: 'vendors', label: 'Vendeurs' },
]

const emptyForm = { title: '', message: '', target: 'all' }

export default function AdminNotificationsPage() {
  const history = useAdminNotificationsStore((state) => state.history)
  const hasHydrated = useAdminNotificationsStore((state) => state.hasHydrated)
  const addNotification = useAdminNotificationsStore((state) => state.addNotification)
  const showToast = useToastStore((state) => state.showToast)

  const [form, setForm] = useState(emptyForm)
  const [sending, setSending] = useState(false)

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSending(true)
    // No push/SMS/email gateway configured — mirrors the backend's
    // AdminNotificationController::send, which logs instead of dispatching.
    await new Promise((resolve) => setTimeout(resolve, 400))
    addNotification(form)
    showToast('Notification envoyée')
    setForm(emptyForm)
    setSending(false)
  }

  if (!hasHydrated) return null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-violet-deep">Notifications</h1>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-card">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-violet-deep">Titre</label>
          <Input value={form.title} onChange={(e) => updateField('title', e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-violet-deep">Message</label>
          <textarea
            value={form.message}
            onChange={(e) => updateField('message', e.target.value)}
            required
            rows={4}
            className="w-full resize-none rounded-lg border border-beige-border bg-white p-4 text-violet-deep placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-active/30 focus:border-violet-active"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-violet-deep">Destinataires</label>
          <Select value={form.target} onChange={(e) => updateField('target', e.target.value)}>
            {TARGETS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={sending}>
            <Send className="mr-1.5 h-4 w-4" /> Envoyer
          </Button>
        </div>
      </form>

      <div>
        <h2 className="mb-3 font-bold text-violet-deep">Historique</h2>
        {history.length === 0 ? (
          <EmptyState icon={Bell} title="Aucune notification envoyée" description="Les envois apparaîtront ici." />
        ) : (
          <div className="space-y-3">
            {history.map((notif) => (
              <div key={notif.id} className="rounded-xl bg-white p-4 shadow-card">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-violet-deep">{notif.title}</p>
                  <span className="shrink-0 text-xs text-gray-400">{formatDate(notif.sentAt)}</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">{notif.message}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {TARGETS.find((t) => t.value === notif.target)?.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
