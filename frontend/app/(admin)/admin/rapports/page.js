'use client'

import { useState } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Download, Eye, FileText, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { ORDER_STATUS, PAYMENT_METHOD_LABELS } from '@/lib/orders'
import { reports } from '@/lib/mock/admin'
import { formatDate, formatPrice } from '@/lib/utils'
import useAdminOrdersStore from '@/stores/adminOrdersStore'
import useAdminUsersStore from '@/stores/adminUsersStore'

const REPORT_COLUMNS = {
  sales: [
    { key: 'id', label: 'N°' },
    { key: 'buyer', label: 'Acheteur' },
    { key: 'amount', label: 'Montant' },
    { key: 'payment', label: 'Paiement' },
    { key: 'status', label: 'Statut' },
    { key: 'date', label: 'Date' },
  ],
  users: [
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'joined', label: 'Inscrit le' },
    { key: 'orders', label: 'Commandes' },
    { key: 'status', label: 'Statut' },
  ],
}
REPORT_COLUMNS.orders = REPORT_COLUMNS.sales

function buildRows(dataset, orders, users) {
  if (dataset === 'users') {
    return users.map((u) => ({
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      joined: formatDate(u.joinedAt),
      orders: u.ordersCount,
      status: u.banned ? 'Banni' : 'Actif',
    }))
  }
  return orders.map((o) => ({
    id: `#${o.id}`,
    buyer: o.buyer.name,
    amount: formatPrice(o.total),
    payment: PAYMENT_METHOD_LABELS[o.paymentMethod],
    status: ORDER_STATUS[o.status].label,
    date: formatDate(o.placedAt),
  }))
}

function downloadReportPdf(report, columns, rows) {
  const doc = new jsPDF()

  doc.setTextColor(58, 24, 104) // violet-deep
  doc.setFontSize(16)
  doc.text(report.title, 14, 18)
  doc.setTextColor(107, 92, 126) // text-secondary
  doc.setFontSize(10)
  doc.text(`Période : ${report.period}`, 14, 25)

  autoTable(doc, {
    startY: 32,
    head: [columns.map((c) => c.label)],
    body: rows.map((row) => columns.map((c) => row[c.key])),
    headStyles: { fillColor: [58, 24, 104], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 245, 236] },
    styles: { fontSize: 9, cellPadding: 4, textColor: [30, 16, 38] },
    margin: { left: 14, right: 14 },
  })

  doc.save(`bayam-${report.dataset}.pdf`)
}

export default function AdminRapportsPage() {
  const orders = useAdminOrdersStore((state) => state.orders)
  const users = useAdminUsersStore((state) => state.users)
  const [activeReport, setActiveReport] = useState(null)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-violet-deep">Rapports</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <div key={report.id} className="flex flex-col rounded-xl bg-white p-6 shadow-card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-light">
              <FileText className="h-5 w-5 text-violet-active" />
            </div>
            <p className="mt-4 font-bold text-violet-deep">{report.title}</p>
            <p className="mt-1 flex-1 text-sm text-gray-500">{report.description}</p>
            <p className="mt-3 text-xs text-gray-400">Période : {report.period}</p>
            <Button variant="secondary" className="mt-4" onClick={() => setActiveReport(report)}>
              <Eye className="mr-1.5 h-4 w-4" /> Voir le détail
            </Button>
          </div>
        ))}
      </div>

      {activeReport && (
        <ReportDetailModal
          report={activeReport}
          columns={REPORT_COLUMNS[activeReport.dataset]}
          rows={buildRows(activeReport.dataset, orders, users)}
          onClose={() => setActiveReport(null)}
        />
      )}
    </div>
  )
}

function ReportDetailModal({ report, columns, rows, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-beige-border p-6">
          <div>
            <p className="font-bold text-violet-deep">{report.title}</p>
            <p className="mt-1 text-sm text-gray-500">{report.description}</p>
            <p className="mt-1 text-xs text-gray-400">Période : {report.period}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 hover:bg-beige-base hover:text-violet-deep"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-beige-border text-xs uppercase text-gray-400">
                {columns.map((col) => (
                  <th key={col.key} className="whitespace-nowrap px-5 py-3 font-medium">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-border">
              {rows.map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-5 py-3 text-violet-deep">
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 border-t border-beige-border p-4">
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={() => downloadReportPdf(report, columns, rows)}>
            <Download className="mr-1.5 h-4 w-4" /> Télécharger en PDF
          </Button>
        </div>
      </div>
    </div>
  )
}
