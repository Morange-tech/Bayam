import CountdownTimer from './CountdownTimer'
import ProductCard from './ProductCard'

export default function FlashSale({ endsAt, products }) {
  return (
    <section className="bg-violet-deep py-10">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Offres flash</h2>
            <p className="mt-1 text-sm text-white/60">Jusqu&apos;à -30% sur une sélection de produits</p>
          </div>
          <CountdownTimer endsAt={endsAt} />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
