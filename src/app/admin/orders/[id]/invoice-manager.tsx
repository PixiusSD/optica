'use client'

import { createInvoiceDraft } from '@/actions/invoices'
import { Invoice } from '@/types/index'
import { useState } from 'react'

export function InvoiceManager({ orderId, invoice }: { orderId: string, invoice: Invoice | null }) {
    const [loading, setLoading] = useState(false)

    async function handleCreateDraft() {
        if (!confirm('Generate Invoice Draft? This will lock the current customer fiscal data.')) return

        setLoading(true)
        try {
            await createInvoiceDraft(orderId)
            alert('Draft created!')
        } catch (e: unknown) {
            if (e instanceof Error) {
                alert(e.message)
            } else {
                alert('Unknown error')
            }
        } finally {
            setLoading(false)
        }
    }

    if (!invoice) {
        return (
            <div className="bg-white shadow rounded-lg p-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Billing & Fiscal</h3>
                <div className="bg-yellow-50 p-4 rounded-md mb-4">
                    <p className="text-sm text-yellow-700">No invoice generated for this order yet.</p>
                </div>
                <button
                    onClick={handleCreateDraft}
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
                >
                    {loading ? 'Generating...' : 'Generate Invoice Draft'}
                </button>
            </div>
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const snapshot = invoice.fiscal_snapshot as any

    return (
        <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Billing & Fiscal</h3>

            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-gray-900 capitalize font-bold">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'authorized' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {invoice.status}
                        </span>
                    </dd>
                </div>
                <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">Factura {invoice.invoice_type}</dd>
                </div>

                <div className="sm:col-span-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Fiscal Snapshot</h4>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                        <p><strong>Name/Razon Social:</strong> {snapshot.customer_name}</p>
                        <p><strong>CUIT/Tax ID:</strong> {snapshot.tax_id || 'N/A'}</p>
                        <p><strong>Condition:</strong> {snapshot.tax_condition}</p>
                    </div>
                </div>

                {invoice.cae && (
                    <div className="sm:col-span-2 bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-sm text-green-800"><strong>CAE:</strong> {invoice.cae}</p>
                        <p className="text-sm text-green-800"><strong>Vto CAE:</strong> {invoice.cae_expires_at}</p>
                    </div>
                )}
            </dl>
        </div>
    )
}
