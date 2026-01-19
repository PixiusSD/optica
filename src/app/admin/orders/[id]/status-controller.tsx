'use client'

import { updateOrderStatus } from '@/actions/orders'
import { useState } from 'react'

export function OrderStatusController({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false)

    async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
        if (!confirm('Update order status?')) return
        setLoading(true)
        try {
            await updateOrderStatus(orderId, e.target.value)
        } catch {
            alert('Error updating status')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center space-x-4">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">Update Status:</label>
            <select
                id="status"
                disabled={loading}
                value={currentStatus}
                onChange={handleStatusChange}
                className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed (Legacy)</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
            </select>
        </div>
    )
}
