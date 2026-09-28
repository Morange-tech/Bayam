'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'
import { cn } from '@/lib/utils'
import { resolvePostLoginPath } from '@/lib/staff'
import { FormError } from '@/components/auth/FormError'
import { SocialButton } from '@/components/auth/SocialButton'

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  remember: z.boolean().optional(),
})

export default function ConnexionPage() {
  const router = useRouter()
  const { setUser, setToken } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data) {
    setAuthError(null)
    try {
      const res = await api.post('/auth/login', data)
      setToken(res.data.token)
      setUser(res.data.user)
      localStorage.setItem('bayam_token', res.data.token)
      router.push(resolvePostLoginPath(res.data.user))
    } catch (err) {
      setAuthError(err.response?.data?.message ?? 'Email ou mot de passe incorrect.')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-violet-deep sm:text-3xl">Bienvenue</h1>
      <p className="mt-1 text-sm text-gray-500">Connectez-vous à votre compte BAYAM</p>

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
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-violet-deep">Mot de passe</label>
            <Link href="/mot-de-passe-oublie" className="text-xs text-violet-active hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className={cn('auth-input pr-12', errors.password && 'auth-input-error')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-violet-active"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <FormError message={errors.password?.message} />
        </div>

        <label className="flex cursor-pointer select-none items-center gap-2.5">
          <input
            {...register('remember')}
            type="checkbox"
            className="h-4 w-4 rounded border-beige-border accent-violet-active"
          />
          <span className="text-sm text-gray-600">Se souvenir de moi</span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-violet-active font-medium text-white transition-colors hover:bg-violet-deep disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Connexion...
            </>
          ) : (
            'Se connecter'
          )}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-500">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="font-medium text-violet-active hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
