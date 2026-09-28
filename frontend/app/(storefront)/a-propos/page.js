import { Handshake, ShieldCheck, Smartphone, Truck } from 'lucide-react'

const values = [
  {
    icon: ShieldCheck,
    title: 'Confiance',
    description: 'Des vendeurs vérifiés et des produits contrôlés pour des achats en toute sérénité.',
  },
  {
    icon: Smartphone,
    title: 'Paiement local',
    description: 'MTN Mobile Money, Orange Money et paiement à la livraison, adaptés à nos habitudes.',
  },
  {
    icon: Truck,
    title: 'Livraison rapide',
    description: 'Une logistique pensée pour livrer vos commandes partout au Cameroun, sans surprise.',
  },
  {
    icon: Handshake,
    title: 'Proximité',
    description: 'Une équipe locale, joignable et à l’écoute pour vous accompagner à chaque étape.',
  },
]

export default function AProposPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <h1 className="text-2xl font-bold text-violet-deep sm:text-3xl">À propos de BAYAM</h1>
      <p className="mt-4 text-gray-600">
        BAYAM est une marketplace africaine qui simplifie l&apos;achat en ligne au Cameroun. Notre mission est
        de rendre le e-commerce accessible à tous : des produits de qualité à prix juste, un paiement adapté
        à nos réalités locales (Mobile Money, paiement à la livraison), et une livraison fiable jusqu&apos;à
        votre porte.
      </p>
      <p className="mt-4 text-gray-600">
        Que vous cherchiez de l&apos;électronique, de la mode, des articles pour la maison ou de
        l&apos;alimentation, BAYAM réunit l&apos;essentiel du quotidien sur une seule plateforme, simple et
        fiable.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {values.map((value) => (
          <div key={value.title} className="rounded-xl bg-white p-6 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-light text-violet-active">
              <value.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-semibold text-violet-deep">{value.title}</h2>
            <p className="mt-1.5 text-sm text-gray-600">{value.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl bg-white p-6 shadow-card">
        <h2 className="font-semibold text-violet-deep">Notre engagement</h2>
        <p className="mt-1.5 text-sm text-gray-600">
          BAYAM ne fonctionne pas comme une place de marché multi-vendeurs : chaque produit vendu sur la
          plateforme est sélectionné et géré directement par notre équipe, pour garantir une expérience
          d&apos;achat cohérente du début à la fin — du choix du produit jusqu&apos;au service après-vente.
        </p>
      </div>
    </div>
  )
}
