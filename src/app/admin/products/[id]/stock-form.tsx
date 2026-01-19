'use client'

import { addStockMovement } from '@/actions/inventory'
import { useState } from 'react'

export function StockAdjustmentForm({ productId }: { productId: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const type = formData.get('type') as 'purchase' | 'return' | 'sale' | 'adjustment'
        const quantity = parseInt(formData.get('quantity') as string)
        const notes = formData.get('notes') as string

        // Adjust quantity based on type being an exit
        const finalQuantity = (type === 'sale' || type === 'adjustment') ? -Math.abs(quantity) : Math.abs(quantity)

        try {
            await addStockMovement({
                product_id: productId,
                type,
                quantity: finalQuantity,
                notes
            })
            setIsOpen(false)
            const form = document.getElementById('stock-form') as HTMLFormElement
            form.reset()
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message)
            } else {
                setError('Unknown error')
            }
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <button onClick={() => setIsOpen(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Update Stock
            </button>
        )
    }

    return (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mt-4">
            <h4 className="text-sm font-bold text-gray-900 mb-3">New Movement</h4>
            <form id="stock-form" action={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                    <select name="type" id="type" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="purchase">Purchase (In)</option>
                        <option value="return">Return (In)</option>
                        <option value="sale">Sale (Out)</option>
                        <option value="adjustment">Adjustment (Out)</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input type="number" min="1" name="quantity" id="quantity" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                    <input type="text" name="notes" id="notes" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div className="flex space-x-3">
                    <button type="submit" disabled={loading} className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        {loading ? 'Saving...' : 'Confirm'}
                    </button>
                    <button type="button" onClick={() => setIsOpen(false)} className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}
