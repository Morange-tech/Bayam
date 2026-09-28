import { Headphones, RotateCcw, Truck, Wallet } from 'lucide-react'

const items = [
  { icon: Truck, label: 'Livraison rapide' },
  { icon: Wallet, label: 'MTN & Orange Money' },
  { icon: RotateCcw, label: 'Retour 7 jours' },
  { icon: Headphones, label: 'Support 7j/7' },
]

export default function TrustBar() {
  return (
    <section className="border-y border-beige-border bg-white py-4">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-beige-border px-4 md:grid-cols-4 md:divide-x md:px-6">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 px-4 py-2 text-center md:flex-row md:text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-beige-gold/15 text-beige-gold">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-sm text-violet-deep">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
