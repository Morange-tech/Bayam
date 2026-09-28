'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, KeyRound, Loader2, MailCheck } from 'lucide-react'
import api from '@/lib/api'

export default function MotDePasseOubliePage() {
  const [step, setStep] = useState('form')
  const [email, setEmail] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/auth/forgot-password', { email })
    } finally {
      // Always move to the "sent" state — even for an unknown email (anti-enumeration).
      setSubmitting(false)
      setStep('sent')
    }
  }

  if (step === 'form') {
    return (
      <div>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-violet-light">
            <KeyRound className="h-6 w-6 text-violet-active" />
          </div>
          <h1 className="text-2xl font-bold text-violet-deep">Mot de passe oublié ?</h1>
          <p className="mt-2 text-sm text-gray-500">
            Entrez votre adresse email — nous vous enverrons un lien de réinitialisation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="auth-label">Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="auth-input"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-violet-active font-medium text-white transition-colors hover:bg-violet-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Envoi...
              </>
            ) : (
              'Envoyer le lien'
            )}
          </button>
        </form>

        <Link
          href="/connexion"
          className="mt-6 flex items-center justify-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-violet-active"
        >
          <ArrowLeft className="h-4 w-4" /> Retour à la connexion
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
        <MailCheck className="h-6 w-6 text-green-600" />
      </div>
      <h2 className="text-xl font-bold text-violet-deep">Email envoyé !</h2>
      <p className="mt-2 text-sm text-gray-500">
        Un lien de réinitialisation a été envoyé à <strong className="text-violet-deep">{email}</strong>. Vérifiez
        également vos spams.
      </p>
      <p className="mt-3 text-xs text-gray-400">Le lien expire dans 60 minutes.</p>
      <Link href="/connexion" className="mt-6 inline-block text-sm font-medium text-violet-active hover:underline">
        Retour à la connexion
      </Link>
    </div>
  )
}
