'use client'

import { checkout } from '@/actions/checkout'
import { removeFromCart } from '@/actions/cart'
import { useState } from 'react'
import { AddressSelector } from './address-selector'
import { CartItem, Address } from '@/types/index'

export default function CartSummary({ items, subtotal, addresses }: { items: CartItem[], subtotal: number, addresses: Address[] }) {
    const [selectedAddressId, setSelectedAddressId] = useState<string>('')
    const [loading, setLoading] = useState(false)

    async function handleCheckout() {
        if (!selectedAddressId) {
            alert('Por favor selecciona una dirección de envío.')
            return
        }
        setLoading(true)
        try {
            await checkout(selectedAddressId)
        } catch (e: unknown) {
            if (e instanceof Error) {
                alert(e.message)
            }
            setLoading(false)
        }
    }

    return (
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
            <div className="lg:col-span-8">
                <ul className="space-y-6">
                    {items.map((item) => (
                        <li key={item.id} className="premium-card p-6 flex flex-col sm:flex-row gap-6 bg-white overflow-hidden group">
                            <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-md overflow-hidden">
                                <img
                                    src={item.products?.images?.[0] || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=400&auto=format&fit=crop'}
                                    alt={item.products?.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>

                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-bold text-accent tracking-[0.2em] uppercase mb-1">Elegancia & Precisión</p>
                                            <h3 className="text-xl font-bold text-primary leading-tight hover:text-accent transition-colors">
                                                {item.products?.name}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart([item.id])}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                            title="Eliminar de la bolsa"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="mt-4 text-2xl font-black text-primary">${item.products?.price}</p>
                                </div>

                                <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cantidad</span>
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-bold text-primary">{item.quantity}</span>
                                    </div>
                                    <p className="text-sm font-bold text-gray-500">Subtotal: <span className="text-primary">${(item.quantity * (item.products?.price || 0)).toFixed(2)}</span></p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="lg:col-span-4 mt-16 lg:mt-0 sticky top-24">
                <div className="premium-card p-8 bg-white shadow-xl shadow-primary/5">
                    <h2 className="text-2xl font-black text-primary tracking-tighter uppercase mb-8 border-b border-gray-100 pb-4">Resumen</h2>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center text-gray-500 font-medium">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-500 font-medium">
                            <span>Envío</span>
                            <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest bg-green-50 px-2 py-1 rounded">Gratis</span>
                        </div>
                        <div className="h-px bg-gray-100 my-4" />
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-primary uppercase tracking-widest">Total</span>
                            <span className="text-3xl font-black text-primary leading-none">${subtotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <AddressSelector
                            addresses={addresses}
                            selectedId={selectedAddressId}
                            onSelect={setSelectedAddressId}
                        />
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading || addresses.length === 0}
                        className="premium-button w-full shadow-lg shadow-primary/20 disabled:opacity-50 disabled:bg-gray-400 disabled:shadow-none uppercase tracking-widest text-xs py-4 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Finalizar Compra'}
                    </button>
                    {!addresses.length && (
                        <p className="mt-4 text-xs text-red-500 font-medium text-center">Debes agregar una dirección antes de continuar.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
