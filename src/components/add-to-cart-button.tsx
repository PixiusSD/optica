'use client'

import { addToCart } from '@/actions/cart'
import { useState } from 'react'

export function AddToCartButton({ productId, stock }: { productId: string, stock: number }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleAdd = async () => {
        if (stock <= 0) return
        setLoading(true)
        setError(null)
        try {
            await addToCart(productId, 1)
            alert('¡Agregado al carrito!')
        } catch (e: unknown) {
            if (e instanceof Error) {
                if (e.message.includes('Unauthorized')) {
                    window.location.href = '/auth/login'
                } else {
                    setError('Error al agregar al carrito')
                }
            }
        } finally {
            setLoading(false)
        }
    }

    if (stock === 0) {
        return (
            <button disabled className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">
                Sin Stock
            </button>
        )
    }

    return (
        <div>
            <button
                onClick={handleAdd}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
                {loading ? 'Agregando...' : 'Agregar al Carrito'}
            </button>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
}
