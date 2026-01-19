'use client'

import { updateShipment } from '@/actions/shipments'
import { useState } from 'react'
import { Shipment, ShipmentStatus, Address } from '@/types/index'

export function ShipmentManager({ shipment }: { shipment: Shipment | null }) {
    const [loading, setLoading] = useState(false)
    const [tracking, setTracking] = useState(shipment?.tracking_number || '')
    const [status, setStatus] = useState(shipment?.status || 'pending')

    if (!shipment) {
        return <p className="text-gray-500 text-sm">No shipment record found.</p>
    }

    // cast address jsonb. Using Address type (approximate match since jsonb vs row)
    const address = shipment.shipping_address as unknown as Address

    async function handleUpdate() {
        setLoading(true)
        try {
            await updateShipment(shipment!.id, status, tracking)
            alert('Shipment updated')
        } catch (e: unknown) {
            if (e instanceof Error) {
                alert('Error: ' + e.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Shipment Details</h3>

            <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-900">Destination:</p>
                <p className="text-sm text-gray-500">{address.street}</p>
                <p className="text-sm text-gray-500">{address.city}, {address.state} {address.zip_code}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="pending">Pending</option>
                        <option value="prepared">Prepared</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="failed">Failed</option>
                    </select>
                </div>

                <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
                    <input
                        type="text"
                        value={tracking}
                        onChange={(e) => setTracking(e.target.value)}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
            </div>

            <div className="mt-5 sm:flex sm:flex-row-reverse">
                <button
                    onClick={handleUpdate}
                    disabled={loading}
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                    {loading ? 'Updating...' : 'Update Shipment'}
                </button>
            </div>
        </div>
    )
}
