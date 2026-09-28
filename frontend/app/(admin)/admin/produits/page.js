'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import EmptyState from '@/components/ui/EmptyState'
import { categories } from '@/lib/data/catalogue'
import { cn, formatPrice } from '@/lib/utils'
import useAdminProductsStore from '@/stores/adminProductsStore'

const STATUS_INFO = {
  active: { label: 'Actif', badge: 'success' },
  hidden: { label: 'Masqué', badge: 'default' },
  draft: { label: 'Brouillon', badge: 'gold' },
}

export default function AdminProductsPage() {
  const products = useAdminProductsStore((state) => state.products)
  const hasHydrated = useAdminProductsStore((state) => state.hasHydrated)
  const setProductStatus = useAdminProductsStore((state) => state.setStatus)
  const deleteProduct = useAdminProductsStore((state) => state.deleteProduct)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    return products.filter((product) => {
      if (search && !product.name.toLowerCase().includes(search.toLowerCase())) return false
      if (category && product.category.slug !== category) return false
      if (statusFilter === 'active' && product.status !== 'active') return false
      if (statusFilter === 'hidden' && product.status !== 'hidden') return false
      if (statusFilter === 'rupture' && product.stock !== 0) return false
      return true
    })
  }, [products, search, category, statusFilter])

  function handleDelete(product) {
    if (window.confirm(`Supprimer "${product.name}" ?`)) {
      deleteProduct(product.id)
    }
  }

  if (!hasHydrated) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-violet-deep">Produits</h1>
        <Link href="/admin/produits/new">
          <Button className="bg-violet-active text-white">
            <Plus className="mr-1.5 h-4 w-4" /> Nouveau produit
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-card">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit..."
            className="pl-9"
          />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="w-48">
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-48">
          <option value="all">Tous les statuts</option>
          <option value="active">Actif</option>
          <option value="hidden">Masqué</option>
          <option value="rupture">Rupture</option>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Aucun produit" description="Aucun produit ne correspond à ces filtres." />
      ) : (
        <div className="overflow-hidden rounded-xl bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-beige-border text-xs uppercase text-gray-400">
                  <th className="px-5 py-3 font-medium">Image</th>
                  <th className="px-5 py-3 font-medium">Nom</th>
                  <th className="px-5 py-3 font-medium">Catégorie</th>
                  <th className="px-5 py-3 font-medium">Prix</th>
                  <th className="px-5 py-3 font-medium">Stock</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-border">
                {filtered.map((product) => {
                  const statusInfo = STATUS_INFO[product.status]
                  return (
                    <tr key={product.id}>
                      <td className="px-5 py-3">
                        <span className="relative block h-12 w-12 overflow-hidden rounded-lg bg-beige-card">
                          <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                        </span>
                      </td>
                      <td className="max-w-[220px] px-5 py-3">
                        <p className="line-clamp-2 font-medium text-violet-deep">{product.name}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-500">{product.category.name}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-violet-deep">{formatPrice(product.price)}</td>
                      <td
                        className={cn(
                          'whitespace-nowrap px-5 py-3',
                          product.stock <= 5 ? 'font-medium text-red-500' : 'text-gray-600'
                        )}
                      >
                        {product.stock}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3">
                        <Badge variant={statusInfo.badge}>{statusInfo.label}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3">
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/admin/produits/${product.id}/edit`}
                            aria-label="Éditer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-active hover:bg-violet-light"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              setProductStatus(product.id, product.status === 'active' ? 'hidden' : 'active')
                            }
                            aria-label={product.status === 'active' ? 'Masquer' : 'Rendre actif'}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-active hover:bg-violet-light"
                          >
                            {product.status === 'active' ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product)}
                            aria-label="Supprimer"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
