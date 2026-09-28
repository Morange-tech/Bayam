import Link from 'next/link'
import { ShieldCheck, Store, Truck } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import HeroBanner from '@/components/shop/HeroBanner'
import TrustBar from '@/components/shop/TrustBar'
import ProductCard from '@/components/shop/ProductCard'
import FlashSale from '@/components/shop/FlashSale'
import {
  fetchBanners,
  fetchBestsellers,
  fetchFeaturedCategories,
  fetchFlashSale,
  fetchNewArrivals,
} from '@/lib/data/home'

const reasons = [
  {
    icon: Store,
    title: 'Large choix de produits',
    description: "Des milliers d'articles dans toutes les catégories, mis à jour chaque jour.",
  },
  {
    icon: Truck,
    title: 'Livraison partout en Afrique',
    description: 'Un réseau de livraison fiable qui couvre les grandes villes et au-delà.',
  },
  {
    icon: ShieldCheck,
    title: 'Paiement sécurisé Mobile Money',
    description: 'Payez en toute confiance avec Mobile Money, carte bancaire ou à la livraison.',
  },
]

export default async function HomePage() {
  const [banners, categories, bestsellers, flashSale, newArrivals] = await Promise.all([
    fetchBanners(),
    fetchFeaturedCategories(),
    fetchBestsellers(),
    fetchFlashSale(),
    fetchNewArrivals(),
  ])

  return (
    <>
      <HeroBanner banners={banners} />
      <TrustBar />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-violet-deep">Nos catégories</h2>
          <Link href="/catalogue" className="text-sm font-medium text-violet-active hover:underline">
            Voir tout →
          </Link>
        </div>
        {/* Mobile: horizontal-scroll circular shortcuts */}
        <div className="flex gap-5 overflow-x-auto pb-1 md:hidden">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalogue?category=${cat.slug}`}
              className="flex shrink-0 flex-col items-center gap-2"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-beige-gold/15 text-violet-active">
                <cat.icon className="h-7 w-7" />
              </span>
              <span className="text-xs font-medium text-violet-deep">{cat.shortName}</span>
            </Link>
          ))}
        </div>

        {/* Desktop: bordered card grid */}
        <div className="hidden gap-4 md:grid md:grid-cols-4 lg:grid-cols-8">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/catalogue?category=${cat.slug}`}>
              <div className="flex h-full flex-col items-center gap-3 rounded-xl border border-beige-border bg-white p-6 text-center transition-colors hover:border-violet-active/60">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-beige-gold/15 text-violet-active">
                  <cat.icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-semibold text-violet-deep">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-violet-deep">Coups de cœur</h2>
            <Badge variant="gold" className="uppercase">
              Tendance
            </Badge>
          </div>
          <Link href="/catalogue" className="text-sm font-medium text-violet-active hover:underline">
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/catalogue">
            <Button variant="secondary">Voir plus</Button>
          </Link>
        </div>
      </section>

      <FlashSale endsAt={flashSale.endsAt} products={flashSale.products} />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-violet-deep">Nouveautés</h2>
            <Badge variant="new">Nouveau</Badge>
          </div>
          <Link href="/catalogue" className="text-sm text-violet-active hover:underline">
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link href="/catalogue">
            <Button variant="secondary">Voir plus</Button>
          </Link>
        </div>
      </section>

      <section className="bg-beige-card py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="mb-10 text-center text-2xl font-bold text-violet-deep">Pourquoi choisir BAYAM ?</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {reasons.map((reason) => (
              <div key={reason.title} className="flex flex-col items-center text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-beige-border bg-white text-violet-active">
                  <reason.icon className="h-7 w-7" />
                </span>
                <h3 className="mb-2 text-lg font-semibold text-violet-deep">{reason.title}</h3>
                <p className="text-sm text-gray-500">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
