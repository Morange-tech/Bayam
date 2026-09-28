import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductGallery from '@/components/shop/ProductGallery'
import ProductInfo from '@/components/shop/ProductInfo'
import ProductTabs from '@/components/shop/ProductTabs'
import FrequentlyBoughtTogether from '@/components/shop/FrequentlyBoughtTogether'
import ProductCard from '@/components/shop/ProductCard'
import { fetchFrequentlyBoughtTogether, fetchProduct, fetchRelatedProducts } from '@/lib/data/product'

export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.slug)
  if (!product) return {}

  return {
    title: `${product.name} | BAYAM`,
    description: product.shortDescription,
    openGraph: { images: [product.images[0].url] },
  }
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.slug)
  if (!product) notFound()

  const [relatedProducts, frequentlyBoughtTogether] = await Promise.all([
    fetchRelatedProducts(product),
    fetchFrequentlyBoughtTogether(product),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-violet-active">
          Accueil
        </Link>
        {' / '}
        <Link href={`/catalogue?category=${product.category.slug}`} className="hover:text-violet-active">
          {product.category.name}
        </Link>
        {' / '}
        <span className="text-violet-deep">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} discount={product.discount} />
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} />

      {frequentlyBoughtTogether.length > 1 && (
        <FrequentlyBoughtTogether products={frequentlyBoughtTogether} />
      )}

      {relatedProducts.length > 0 && (
        <section className="mt-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-violet-deep">Produits similaires</h2>
            <Link
              href={`/catalogue?category=${product.category.slug}`}
              className="text-sm font-medium text-violet-active hover:underline"
            >
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
