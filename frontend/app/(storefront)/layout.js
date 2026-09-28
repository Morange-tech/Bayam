import { Suspense } from 'react'
import Header from '@/components/layout/Header'
import CategoryNav from '@/components/layout/CategoryNav'
import Footer from '@/components/layout/Footer'
import BottomNav from '@/components/layout/BottomNav'

export default function StorefrontLayout({ children }) {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <CategoryNav />
      </Suspense>
      <main className="min-h-screen bg-beige-base">{children}</main>
      <Footer />
      <BottomNav />
    </>
  )
}
