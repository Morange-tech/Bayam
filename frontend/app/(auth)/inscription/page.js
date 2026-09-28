'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { FormError } from '@/components/auth/FormError'
import { PasswordStrengthBar } from '@/components/auth/PasswordStrengthBar'
import { SocialButton } from '@/components/auth/SocialButton'

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Prénom requis (min. 2 caractères)'),
    lastName: z.string().min(2, 'Nom requis (min. 2 caractères)'),
    phone: z
      .string()
      .regex(/^6[5-9]\d{7}$/, 'Format invalide — ex : 6XX XXX XXX')
      .optional()
      .or(z.literal('')),
    email: z.string().email('Adresse email invalide'),
    password: z
      .string()
      .min(8, 'Minimum 8 caractères')
      .regex(/[A-Z]/, 'Au moins une majuscule')
      .regex(/[0-9]/, 'Au moins un chiffre'),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((v) => v === true, 'Vous devez accepter les conditions'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export default function InscriptionPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [authError, setAuthError] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const password = watch('password', '')

  async function onSubmit(data) {
    setAuthError(null)
    try {
      const res = await api.post('/auth/register', {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone || null,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
      })
      setToken(res.data.token)
      setUser(res.data.user)
      localStorage.setItem('bayam_token', res.data.token)
      router.push('/')
    } catch (err) {
      setAuthError(err.response?.data?.message ?? 'Une erreur est survenue. Veuillez réessayer.')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-violet-deep sm:text-3xl">Créer un compte</h1>
      <p className="mt-1 text-sm text-gray-500">Rejoignez BAYAM et commencez vos achats</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <SocialButton provider="google" />
        <SocialButton provider="facebook" />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-beige-border" />
        <span className="shrink-0 text-xs text-gray-400">ou</span>
        <div className="h-px flex-1 bg-beige-border" />
      </div>

      {authError && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="auth-label">
              Prénom <span className="text-red-400">*</span>
            </label>
            <input
              {...register('firstName')}
              placeholder="Jean"
              className={cn('auth-input', errors.firstName && 'auth-input-error')}
            />
            <FormError message={errors.firstName?.message} />
          </div>
          <div>
            <label className="auth-label">
              Nom <span className="text-red-400">*</span>
            </label>
            <input
              {...register('lastName')}
              placeholder="Dupont"
              className={cn('auth-input', errors.lastName && 'auth-input-error')}
            />
            <FormError message={errors.lastName?.message} />
          </div>
        </div>

        <div>
          <label className="auth-label">
            Téléphone / WhatsApp <span className="font-normal text-gray-400">(optionnel)</span>
          </label>
          <div className="flex gap-2">
            <div className="flex h-12 shrink-0 select-none items-center gap-1.5 rounded-lg border border-beige-border bg-beige-base px-3 text-sm text-gray-600">
              🇨🇲 +237
            </div>
            <input
              {...register('phone')}
              type="tel"
              placeholder="6XX XXX XXX"
              className={cn('auth-input flex-1', errors.phone && 'auth-input-error')}
            />
          </div>
          <FormError message={errors.phone?.message} />
        </div>

        <div>
          <label className="auth-label">
            Adresse email <span className="text-red-400">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            placeholder="votre@email.com"
            autoComplete="email"
            className={cn('auth-input', errors.email && 'auth-input-error')}
          />
          <FormError message={errors.email?.message} />
        </div>

        <div>
          <label className="auth-label">
            Mot de passe <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPwd ? 'text' : 'password'}
              placeholder="••••••••"
              className={cn('auth-input pr-12', errors.password && 'auth-input-error')}
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-violet-active"
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <PasswordStrengthBar password={password} />
          <FormError message={errors.password?.message} />
        </div>

        <div>
          <label className="auth-label">Confirmer le mot de passe</label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirm ? 'text' : 'password'}
              placeholder="••••••••"
              className={cn('auth-input pr-12', errors.confirmPassword && 'auth-input-error')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-violet-active"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FormError message={errors.confirmPassword?.message} />
        </div>

        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            {...register('acceptTerms')}
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-beige-border accent-violet-active"
          />
          <span className="text-sm leading-snug text-gray-600">
            J&apos;accepte les{' '}
            <Link href="/cgv" target="_blank" className="text-violet-active hover:underline">
              Conditions générales de vente
            </Link>{' '}
            et la{' '}
            <Link href="/confidentialite" target="_blank" className="text-violet-active hover:underline">
              Politique de confidentialité
            </Link>
          </span>
        </label>
        <FormError message={errors.acceptTerms?.message} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-violet-active font-medium text-white transition-colors hover:bg-violet-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Création en cours...
            </>
          ) : (
            'Créer mon compte'
          )}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        Déjà un compte ?{' '}
        <Link href="/connexion" className="font-medium text-violet-active hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  )
}
