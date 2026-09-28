import Link from 'next/link'
import { Apple, Mail, Phone, Play, X } from 'lucide-react'

// This lucide-react version doesn't export brand icons (Facebook/Instagram) — inlined here using
// the same Feather/Lucide source paths and stroke styling so they match the rest of the icon set.
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const socialLinks = [
  { href: '#', label: 'Facebook', icon: FacebookIcon },
  { href: '#', label: 'Instagram', icon: InstagramIcon },
  { href: '#', label: 'X', icon: X },
]

const buyerLinks = [
  { href: '/comment-commander', label: 'Comment commander' },
  { href: '/compte/commandes', label: 'Suivi de commande' },
  { href: '/retours', label: 'Retours & remboursements' },
  { href: '/mobile-money', label: 'Mobile Money' },
  { href: '/faq', label: 'FAQ' },
]

// The mockup also has a "Vendeurs" column (Devenir vendeur, Tableau de bord vendeur, Frais &
// commissions, ...) — deliberately omitted: this is a single-seller platform (see dev rules:
// "Pas de multi-vendeurs — aucune route /vendor, aucun composant VendorCard, aucune mention de
// commission dans le code. Seul l'admin gère les produits.").

const infoLinks = [
  { href: '/a-propos', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
  { href: '/cgv', label: 'CGV' },
  { href: '/confidentialite', label: 'Politique de confidentialité' },
  { href: '/cookies', label: 'Cookies' },
]

export default function Footer() {
  return (
    <footer className="bg-violet-deep pb-16 text-white md:pb-0">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <span className="text-2xl font-bold tracking-tight text-white">BAYAM</span>
          <p className="mt-3 text-sm text-white/70">Votre marketplace africaine, simple et fiable.</p>
          <div className="mt-4 flex items-center gap-3">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              >
                <social.icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">Acheteurs</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            {buyerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">Informations</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            {infoLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/90">Contact &amp; App</h3>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" /> +237 6 77 00 00 00
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" /> contact@bayam.africa
            </li>
          </ul>
          <p className="mb-2 mt-4 text-sm text-white/70">Téléchargez l&apos;app</p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm text-white/90 hover:bg-white/20"
            >
              <Apple className="h-4 w-4" /> App Store
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm text-white/90 hover:bg-white/20"
            >
              <Play className="h-4 w-4" /> Google Play
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-white/60">
        © {new Date().getFullYear()} BAYAM. Tous droits réservés.
      </div>
    </footer>
  )
}
