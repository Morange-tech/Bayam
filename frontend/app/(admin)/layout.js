'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { firstAllowedPath, sectionForPath } from '@/lib/staff'
import useAuthStore from '@/stores/authStore'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  const isAdmin = user?.role === 'admin'
  const isStaff = user?.role === 'staff'
  const staffSections = user?.staffSections ?? []
  const section = sectionForPath(pathname)
  const allowed = isAdmin || (isStaff && section && staffSections.includes(section))

  useEffect(() => {
    if (!hasHydrated) return

    if (!user || (!isAdmin && !isStaff)) {
      router.replace('/connexion')
      return
    }

    if (!allowed) {
      router.replace(isStaff ? firstAllowedPath(user?.staffSections ?? []) : '/')
    }
  }, [hasHydrated, user, isAdmin, isStaff, allowed, router])

  if (!hasHydrated || !user || (!isAdmin && !isStaff) || !allowed) return null

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <main className="min-w-0 flex-1 overflow-auto bg-beige-base p-4 lg:p-6">{children}</main>
    </div>
  )
}
