'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShieldCheck, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'

const BACKGROUNDS = {
  '/inscription': '/images/auth/inscription-bg.jpg',
  '/connexion': '/images/auth/connexion-bg.jpg',
}

export default function AuthLayout({ children }) {
  const pathname = usePathname()
  const backgroundImage = BACKGROUNDS[pathname]

  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      <div className="flex w-full flex-col lg:w-1/2">
        <header className="px-6 py-6 sm:px-10">
          <Link href="/" className="flex w-fit items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-violet-deep">BAYAM</span>
          </Link>
        </header>

        <main className="flex flex-1 items-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </main>

        <footer className="px-6 py-4 text-xs text-gray-400 sm:px-10">
          © 2026 BAYAM ·
          <Link href="/confidentialite" className="mx-1 hover:text-violet-active">
            Confidentialité
          </Link>
          ·
          <Link href="/cgv" className="mx-1 hover:text-violet-active">
            CGV
          </Link>
        </footer>
      </div>

      <div className="relative hidden p-3 lg:block lg:w-1/2">
        <div
          className={cn(
            'relative h-full w-full overflow-hidden rounded-[160px_28px_160px_28px]',
            !backgroundImage && 'bg-gradient-to-br from-violet-deep via-violet-active to-violet-soft'
          )}
        >
          {backgroundImage && (
            <>
              <Image src={backgroundImage} alt="" fill priority sizes="50vw" className="object-cover" />
              {/* Semi-transparent overlay so the white text stays readable over the photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-violet-deep/90 via-violet-deep/50 to-violet-deep/20" />
            </>
          )}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_50%)]" />
          <div className="absolute inset-x-0 bottom-0 p-10 text-white">
            <h2 className="text-3xl font-bold leading-tight">
              Faites vos achats en toute confiance, partout au Cameroun
            </h2>
            <p className="mt-3 max-w-sm text-sm text-white/80">
              Des milliers de produits, un paiement Mobile Money sécurisé et une livraison rapide jusqu&apos;à
              votre porte.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4" /> Paiement sécurisé
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm">
                <Truck className="h-4 w-4" /> Livraison rapide
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
