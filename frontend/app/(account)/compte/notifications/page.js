'use client'

import { Bell, Tag, Truck } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'
import { notifications } from '@/lib/mock/notifications'
import { cn, formatDate } from '@/lib/utils'

const TYPE_ICONS = { order: Truck, promo: Tag }

export default function NotificationsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-violet-deep">Notifications</h1>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="Aucune notification" description="Vous êtes à jour." />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = TYPE_ICONS[notification.type] ?? Bell
            return (
              <div
                key={notification.id}
                className={cn(
                  'flex items-start gap-3 rounded-xl bg-white p-4 shadow-card',
                  !notification.read && 'ring-1 ring-violet-active/20'
                )}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-beige-card text-violet-active">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-violet-deep">{notification.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                </div>
                {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-active" />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
