'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, ChevronDown, User as UserIcon } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import useAuthStore from '@/stores/authStore'

const profileSchema = z.object({
  firstName: z.string().min(2, 'Prénom trop court'),
  lastName: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  phone: z.string().regex(/^(\+237|237)?6[5-9]\d{7}$/, 'Numéro de téléphone camerounais invalide'),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Mot de passe requis'),
    newPassword: z.string().min(8, '8 caractères minimum'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user)
  const fileInputRef = useRef(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || null)
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isSavingProfile },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isSavingPassword },
  } = useForm({ resolver: zodResolver(passwordSchema) })

  function handleAvatarClick() {
    fileInputRef.current?.click()
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result)
    reader.readAsDataURL(file)
  }

  async function onSaveProfile() {
    // Mock update until the Laravel API exists.
    await new Promise((resolve) => setTimeout(resolve, 600))
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  async function onSavePassword() {
    await new Promise((resolve) => setTimeout(resolve, 600))
    setPasswordSaved(true)
    resetPasswordForm()
    setTimeout(() => setPasswordSaved(false), 2500)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-violet-deep">Mon profil</h1>

      <div className="rounded-xl bg-white p-6 shadow-card">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleAvatarClick}
            aria-label="Changer la photo de profil"
            className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-violet-light text-violet-active"
          >
            {avatarPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center">
                <UserIcon className="h-8 w-8" />
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera className="h-5 w-5 text-white" />
            </span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          <div>
            <p className="font-medium text-violet-deep">Photo de profil</p>
            <p className="text-sm text-gray-500">Cliquez sur l&apos;avatar pour changer votre photo.</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit(onSaveProfile)} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Prénom" error={profileErrors.firstName?.message}>
              <Input {...registerProfile('firstName')} />
            </Field>
            <Field label="Nom" error={profileErrors.lastName?.message}>
              <Input {...registerProfile('lastName')} />
            </Field>
          </div>
          <Field label="Email" error={profileErrors.email?.message}>
            <Input {...registerProfile('email')} type="email" />
          </Field>
          <Field label="Téléphone" error={profileErrors.phone?.message}>
            <Input {...registerProfile('phone')} type="tel" placeholder="6XX XXX XXX" />
          </Field>

          <div className="flex items-center gap-3">
            <Button type="submit" loading={isSavingProfile}>
              Enregistrer
            </Button>
            {profileSaved && <span className="text-sm text-green-600">Profil mis à jour</span>}
          </div>
        </form>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-card">
        <button
          type="button"
          onClick={() => setPasswordOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <div>
            <p className="font-medium text-violet-deep">Mot de passe</p>
            <p className="text-sm text-gray-500">Modifiez votre mot de passe de connexion.</p>
          </div>
          <ChevronDown
            className={cn('h-5 w-5 text-violet-active transition-transform', passwordOpen && 'rotate-180')}
          />
        </button>

        {passwordOpen && (
          <form
            onSubmit={handlePasswordSubmit(onSavePassword)}
            className="mt-4 space-y-4 border-t border-beige-border pt-4"
          >
            <Field label="Mot de passe actuel" error={passwordErrors.currentPassword?.message}>
              <Input {...registerPassword('currentPassword')} type="password" />
            </Field>
            <Field label="Nouveau mot de passe" error={passwordErrors.newPassword?.message}>
              <Input {...registerPassword('newPassword')} type="password" />
            </Field>
            <Field label="Confirmer le mot de passe" error={passwordErrors.confirmPassword?.message}>
              <Input {...registerPassword('confirmPassword')} type="password" />
            </Field>
            <div className="flex items-center gap-3">
              <Button type="submit" loading={isSavingPassword}>
                Modifier le mot de passe
              </Button>
              {passwordSaved && <span className="text-sm text-green-600">Mot de passe modifié</span>}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-violet-deep">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
