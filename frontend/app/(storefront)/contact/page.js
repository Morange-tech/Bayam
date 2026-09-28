'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, MapPin, Phone } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormError } from '@/components/auth/FormError'
import useToastStore from '@/stores/toastStore'

const contactSchema = z.object({
  name: z.string().min(2, 'Nom requis (min. 2 caractères)'),
  email: z.string().email('Adresse email invalide'),
  subject: z.string().min(3, 'Sujet requis'),
  message: z.string().min(10, 'Votre message doit contenir au moins 10 caractères'),
})

const contactInfo = [
  { icon: Phone, label: '+237 6 77 00 00 00' },
  { icon: Mail, label: 'contact@bayam.africa' },
  { icon: MapPin, label: 'Douala, Cameroun' },
]

export default function ContactPage() {
  const showToast = useToastStore((state) => state.showToast)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(contactSchema) })

  // No support-ticket endpoint on the backend yet — mock the round trip until one exists.
  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 600))
    showToast('Message envoyé, nous vous répondrons rapidement')
    reset()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <h1 className="text-2xl font-bold text-violet-deep sm:text-3xl">Contactez-nous</h1>
      <p className="mt-2 text-gray-600">
        Une question sur une commande, un produit ou votre compte ? Notre équipe vous répond sous 24h.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {contactInfo.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-card">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-light text-violet-active">
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl bg-white p-6 shadow-card">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-violet-deep">Nom complet</label>
            <Input {...register('name')} placeholder="Jean Dupont" />
            <FormError message={errors.name?.message} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-violet-deep">Adresse email</label>
            <Input {...register('email')} type="email" placeholder="votre@email.com" />
            <FormError message={errors.email?.message} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-violet-deep">Sujet</label>
            <Input {...register('subject')} placeholder="Suivi de ma commande" />
            <FormError message={errors.subject?.message} />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-violet-deep">Message</label>
            <textarea
              {...register('message')}
              rows={5}
              placeholder="Décrivez votre demande..."
              className="w-full rounded-lg border border-beige-border bg-white px-4 py-3 text-violet-deep placeholder:text-gray-400 focus:border-violet-active focus:outline-none focus:ring-2 focus:ring-violet-active/30"
            />
            <FormError message={errors.message?.message} />
          </div>

          <Button type="submit" loading={isSubmitting} className="w-full">
            Envoyer le message
          </Button>
        </form>
      </div>
    </div>
  )
}
