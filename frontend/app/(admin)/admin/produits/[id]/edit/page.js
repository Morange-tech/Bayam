'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'
import useAdminProductsStore from '@/stores/adminProductsStore'

export default function EditProductPage() {
  const params = useParams()
  const hasHydrated = useAdminProductsStore((state) => state.hasHydrated)
  const product = useAdminProductsStore((state) => state.products.find((p) => p.id === params.id))

  if (!hasHydrated) return null

  if (!product) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-card">
        <p className="text-gray-500">Produit introuvable.</p>
        <Link href="/admin/produits" className="mt-3 inline-block text-sm text-violet-active hover:underline">
          Retour aux produits
        </Link>
      </div>
    )
  }

  return <ProductForm product={product} />
}
