'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Plus, Upload, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import MarkdownEditor from './MarkdownEditor'
import { categories } from '@/lib/data/catalogue'
import { cn, slugify } from '@/lib/utils'
import useAdminProductsStore from '@/stores/adminProductsStore'

const MAX_IMAGES = 5
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

export default function ProductForm({ product }) {
  const router = useRouter()
  const addProduct = useAdminProductsStore((state) => state.addProduct)
  const updateProduct = useAdminProductsStore((state) => state.updateProduct)
  const isEditing = Boolean(product)

  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price ?? '')
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice ?? '')
  const [stock, setStock] = useState(product?.stock ?? '')
  const [hasVariants, setHasVariants] = useState(product?.hasVariants || false)
  const [variants, setVariants] = useState(
    (product?.variants || []).map((v) => ({
      id: v.id,
      label: v.label,
      options: v.options.map((o) => o.label).join(', '),
    }))
  )
  const [specifications, setSpecifications] = useState(product?.specifications || [])
  const [images, setImages] = useState(
    (product?.images || (product?.image ? [{ url: product.image }] : [])).map((img, i) => ({
      id: `existing-${i}`,
      url: img.url || img,
    }))
  )
  const [status, setStatus] = useState(product?.status || 'draft')
  const [category, setCategory] = useState(product?.category?.slug || '')
  const [tags, setTags] = useState(product?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const slug = slugify(name)

  function validate() {
    const next = {}
    if (name.trim().length < 2) next.name = 'Nom trop court'
    if (!price || Number(price) <= 0) next.price = 'Prix requis'
    if (stock === '' || Number(stock) < 0) next.stock = 'Stock requis'
    if (!category) next.category = 'Catégorie requise'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleFiles(fileList) {
    const files = Array.from(fileList).slice(0, MAX_IMAGES - images.length)
    files.forEach((file) => {
      if (!file.type.startsWith('image/') || file.size > MAX_IMAGE_SIZE) return
      const reader = new FileReader()
      reader.onload = () => {
        setImages((prev) =>
          prev.length >= MAX_IMAGES ? prev : [...prev, { id: `${file.name}-${Date.now()}`, url: reader.result }]
        )
      }
      reader.readAsDataURL(file)
    })
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  function removeImage(id) {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  function addVariantGroup() {
    setVariants((prev) => [...prev, { id: `variant-${prev.length}`, label: '', options: '' }])
  }

  function updateVariantGroup(index, updates) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...updates } : v)))
  }

  function removeVariantGroup(index) {
    setVariants((prev) => prev.filter((_, i) => i !== index))
  }

  function addSpecification() {
    setSpecifications((prev) => [...prev, { label: '', value: '' }])
  }

  function updateSpecification(index, updates) {
    setSpecifications((prev) => prev.map((s, i) => (i === index ? { ...s, ...updates } : s)))
  }

  function removeSpecification(index) {
    setSpecifications((prev) => prev.filter((_, i) => i !== index))
  }

  function addTag() {
    const value = tagInput.trim()
    if (value && !tags.includes(value)) setTags((prev) => [...prev, value])
    setTagInput('')
  }

  function handleTagKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    }
  }

  async function handleSave(targetStatus) {
    if (!validate()) return
    setSaving(true)

    const selectedCategory = categories.find((c) => c.slug === category)
    const payload = {
      name,
      slug,
      description,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: Number(stock),
      hasVariants,
      variants: hasVariants
        ? variants
            .filter((v) => v.label.trim())
            .map((v) => ({
              id: slugify(v.label),
              label: v.label,
              options: v.options
                .split(',')
                .map((o) => o.trim())
                .filter(Boolean)
                .map((label) => ({ id: slugify(label), label })),
            }))
        : [],
      specifications: specifications.filter((s) => s.label.trim()),
      images: images.map((img) => ({ url: img.url, alt: name })),
      image: images[0]?.url || product?.image || 'https://placehold.co/500x500/EDE9FE/3A1868?text=Produit',
      status: targetStatus,
      category: selectedCategory ? { slug: selectedCategory.slug, name: selectedCategory.name } : product?.category,
      tags,
    }

    // Mock save until the Laravel API exists.
    await new Promise((resolve) => setTimeout(resolve, 600))

    if (isEditing) {
      updateProduct(product.id, payload)
    } else {
      addProduct(payload)
    }

    setSaving(false)
    router.push('/admin/produits')
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-violet-deep">
        {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
      </h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-card">
            <Field label="Nom du produit" error={errors.name}>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du produit" />
            </Field>
            {name && <p className="mt-1.5 text-xs text-gray-400">URL : /produits/{slug}</p>}

            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-violet-deep">Description</label>
              <MarkdownEditor value={description} onChange={setDescription} placeholder="Décrivez le produit..." />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <Field label="Prix de vente (FCFA)" error={errors.price}>
                <Input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
              </Field>
              <Field label="Prix original (optionnel)">
                <Input
                  type="number"
                  min="0"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Stock disponible" error={errors.stock}>
                <Input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="max-w-[200px]"
                />
              </Field>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-card">
            <label className="flex cursor-pointer items-center justify-between">
              <span>
                <p className="font-medium text-violet-deep">Ce produit a des variantes</p>
                <p className="text-sm text-gray-500">Couleur, taille, pointure...</p>
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={hasVariants}
                onClick={() => setHasVariants((v) => !v)}
                className={cn(
                  'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                  hasVariants ? 'bg-violet-active' : 'bg-gray-200'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform',
                    hasVariants ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
            </label>

            {hasVariants && (
              <div className="mt-4 space-y-3 border-t border-beige-border pt-4">
                {variants.map((variant, index) => (
                  <div key={variant.id} className="flex items-start gap-2">
                    <Input
                      value={variant.label}
                      onChange={(e) => updateVariantGroup(index, { label: e.target.value })}
                      placeholder="Nom (ex. Couleur)"
                      className="w-40"
                    />
                    <Input
                      value={variant.options}
                      onChange={(e) => updateVariantGroup(index, { options: e.target.value })}
                      placeholder="Options séparées par une virgule (ex. Noir, Bleu)"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariantGroup(index)}
                      aria-label="Supprimer"
                      className="flex h-12 w-10 items-center justify-center text-red-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <Button type="button" variant="ghost" size="sm" onClick={addVariantGroup}>
                  <Plus className="mr-1.5 h-4 w-4" /> Ajouter une variante
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-card">
            <p className="font-medium text-violet-deep">Caractéristiques</p>
            <div className="mt-4 space-y-3">
              {specifications.map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={spec.label}
                    onChange={(e) => updateSpecification(index, { label: e.target.value })}
                    placeholder="Clé (ex. Matière)"
                    className="w-40"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, { value: e.target.value })}
                    placeholder="Valeur (ex. Coton)"
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    aria-label="Supprimer"
                    className="flex h-12 w-10 items-center justify-center text-red-400 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={addSpecification}>
                <Plus className="mr-1.5 h-4 w-4" /> Ajouter une caractéristique
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full space-y-6 lg:w-80 lg:shrink-0">
          <div className="rounded-xl bg-white p-6 shadow-card">
            <p className="mb-3 font-medium text-violet-deep">Images</p>
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('product-image-input')?.click()}
              className={cn(
                'cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors',
                dragActive ? 'border-violet-active bg-violet-light' : 'border-beige-border'
              )}
            >
              <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">Glisser-déposer ou cliquer pour choisir</p>
              <p className="mt-1 text-xs text-gray-400">PNG, JPG jusqu&apos;à 5 Mo · 5 photos max</p>
              <input
                id="product-image-input"
                type="file"
                accept="image/png,image/jpeg"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {images.map((image) => (
                  <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg bg-beige-card">
                    <Image src={image.url} alt="" fill sizes="100px" className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      aria-label="Retirer l'image"
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white p-6 shadow-card">
            <label className="mb-1.5 block text-sm font-medium text-violet-deep">Statut</label>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="active">Actif</option>
              <option value="hidden">Masqué</option>
              <option value="draft">Brouillon</option>
            </Select>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-card">
            <Field label="Catégorie" error={errors.category}>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-card">
            <label className="mb-1.5 block text-sm font-medium text-violet-deep">Tags / mots-clés</label>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-violet-light px-2.5 py-1 text-xs font-medium text-violet-active"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                    aria-label={`Retirer ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
              placeholder="Ajouter un tag et appuyer sur Entrée"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => handleSave('draft')} loading={saving} disabled={saving}>
          Enregistrer comme brouillon
        </Button>
        <Button
          type="button"
          onClick={() => handleSave(status === 'draft' ? 'active' : status)}
          loading={saving}
          disabled={saving}
        >
          Publier le produit
        </Button>
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-violet-deep">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
