import { Baby, Droplet, Home, Laptop, Shirt, ShoppingBasket, Smartphone, Dumbbell } from 'lucide-react'
import { products } from '@/lib/mock/products'

// Mock data until the Laravel API exists — same async shape, swap the body for an api.get() call later.

const banners = [
  {
    id: 1,
    title: 'Les meilleures offres du moment',
    mobileTitle: 'Vos essentiels, livrés vite',
    subtitle: "Jusqu'à -30% sur une sélection de produits high-tech",
    ctaLabel: 'Découvrir',
    ctaHref: '/catalogue',
    image: '/images/hero/promo-hightech.jpg',
  },
  {
    id: 2,
    title: 'La mode qui vous ressemble',
    subtitle: 'Nouvelle collection Mode disponible dès maintenant',
    ctaLabel: 'Voir la collection',
    ctaHref: '/catalogue?category=mode',
    image: '/images/hero/mode-collection.jpg',
  },
  {
    id: 3,
    title: 'Payez en toute simplicité',
    subtitle: 'MTN Mobile Money et Orange Money acceptés partout',
    ctaLabel: 'En savoir plus',
    ctaHref: '/a-propos',
    image: '/images/hero/mobile-money.jpg',
  },
]

// Mirrors the "Nos catégories" homepage tiles. Two of these (Téléphonie, Enfants & Jouets) aren't
// part of the shared catalogue taxonomy (lib/data/catalogue.js) yet — they render here but won't
// have matching products until that list is extended.
const featuredCategories = [
  { slug: 'mode', name: 'Mode & Vêtements', shortName: 'Mode', icon: Shirt },
  { slug: 'electronique', name: 'Électronique', shortName: 'Électro', icon: Laptop },
  { slug: 'maison', name: 'Maison & Cuisine', shortName: 'Maison', icon: Home },
  { slug: 'beaute', name: 'Beauté & Soins', shortName: 'Beauté', icon: Droplet },
  { slug: 'alimentation', name: 'Épicerie', shortName: 'Épicerie', icon: ShoppingBasket },
  { slug: 'sport', name: 'Sport & Loisirs', shortName: 'Sport', icon: Dumbbell },
  { slug: 'telephonie', name: 'Téléphonie', shortName: 'Téléphonie', icon: Smartphone },
  { slug: 'enfants', name: 'Enfants & Jouets', shortName: 'Enfants', icon: Baby },
]

export async function fetchBanners() {
  return banners
}

export async function fetchFeaturedCategories() {
  return featuredCategories
}

export async function fetchBestsellers() {
  return products.slice(0, 5)
}

export async function fetchFlashSale() {
  return {
    endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    products: [products[0], products[3], products[7], products[4]],
  }
}

export async function fetchNewArrivals() {
  return products.slice(4, 8)
}
