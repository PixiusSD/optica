'use client'

import { addAddress, deleteAddress } from '@/actions/profile'
import { Address } from '@/types/index'
import { useState } from 'react'

export function AddressManager({ addresses }: { addresses: Address[] }) {
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleDelete(id: string) {
        if (!confirm('¿Eliminar dirección?')) return
        try {
            await deleteAddress(id)
        } catch {
            alert('Error al eliminar la dirección')
        }
    }

    async function handleAdd(formData: FormData) {
        setLoading(true)
        try {
            await addAddress(formData)
            setIsAdding(false)
        } catch {
            alert('Error al agregar la dirección')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Direcciones</h3>
                    <p className="mt-1 text-sm text-gray-500">Gestiona tus destinos de envío.</p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <div className="space-y-4">
                        {addresses.map((addr) => (
                            <div key={addr.id} className="flex justify-between items-center border p-4 rounded-md">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{addr.street}</p>
                                    <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip_code}</p>
                                    <p className="text-sm text-gray-500">{addr.country}</p>
                                </div>
                                <button onClick={() => handleDelete(addr.id)} className="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
                            </div>
                        ))}

                        {addresses.length === 0 && !isAdding && (
                            <p className="text-gray-500 text-sm">Aún no has agregado direcciones.</p>
                        )}

                        {!isAdding ? (
                            <button onClick={() => setIsAdding(true)} className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                Agregar Dirección
                            </button>
                        ) : (
                            <form action={handleAdd} className="border border-indigo-200 p-4 rounded-md bg-indigo-50 space-y-4">
                                <h4 className="font-medium text-sm">Nueva Dirección</h4>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Calle</label>
                                    <input type="text" name="street" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Ciudad</label>
                                        <input type="text" name="city" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Provincia</label>
                                        <input type="text" name="state" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Código Postal</label>
                                    <input type="text" name="zip_code" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                                </div>

                                <div className="flex space-x-3">
                                    <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        {loading ? 'Guardando' : 'Guardar'}
                                    </button>
                                    <button type="button" onClick={() => setIsAdding(false)} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
