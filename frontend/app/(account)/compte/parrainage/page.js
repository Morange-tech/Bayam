'use client'

import { useState } from 'react'
import { Check, Copy, Gift } from 'lucide-react'
import useAuthStore from '@/stores/authStore'

export default function ReferralPage() {
  const user = useAuthStore((state) => state.user)
  const [copied, setCopied] = useState(false)

  const code = `BAYAM-${(user?.firstName ?? 'AMI').slice(0, 4).toUpperCase()}${user?.id ?? ''}`
  const link = `https://bayam.africa/inscription?ref=${code}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be denied by the browser — the code is still visible to copy by hand.
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-violet-deep">Parrainage</h1>

      <div className="rounded-xl bg-white p-6 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-beige-card text-violet-active">
            <Gift className="h-5 w-5" />
          </span>
          <div>
            <p className="font-bold text-violet-deep">Parrainez vos amis</p>
            <p className="text-sm text-gray-500">Ils reçoivent 10% sur leur première commande, vous aussi.</p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <div className="flex-1 truncate rounded-lg border border-beige-border bg-beige-base px-4 py-3 font-mono text-sm text-violet-deep">
            {link}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-violet-active px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-deep"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copié' : 'Copier'}
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          Votre code : <span className="font-mono font-medium text-violet-deep">{code}</span>
        </p>
      </div>
    </div>
  )
}
