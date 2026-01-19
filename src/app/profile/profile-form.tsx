'use client'

import { updateProfile } from '@/actions/profile'
import { Profile } from '@/types/index'
import { useState } from 'react'

export function ProfileForm({ profile }: { profile: Profile }) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            await updateProfile(formData)
            alert('¡Perfil actualizado!')
        } catch {
            alert('Error al actualizar el perfil')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-1">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Información Personal</h3>
                    <p className="mt-1 text-sm text-gray-500">Usa una dirección permanente donde puedas recibir correo.</p>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2 space-y-6">
                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6 sm:col-span-4">
                            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Nombre completo</label>
                            <input
                                type="text"
                                name="full_name"
                                id="full_name"
                                defaultValue={profile.full_name || ''}
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                defaultValue={profile.email || ''}
                                readOnly
                                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                            />
                        </div>

                        <div className="col-span-6 sm:col-span-4">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input
                                type="text"
                                name="phone"
                                id="phone"
                                defaultValue={profile.phone || ''}
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <hr />

                    <div className="grid grid-cols-6 gap-6">
                        <div className="col-span-6">
                            <h4 className="text-md font-medium text-gray-900">Información Fiscal (Facturación)</h4>
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="tax_id" className="block text-sm font-medium text-gray-700">Tax ID (CUIT/CUIL)</label>
                            <input
                                type="text"
                                name="tax_id"
                                id="tax_id"
                                defaultValue={profile.tax_id || ''}
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">Razón Social</label>
                            <input
                                type="text"
                                name="business_name"
                                id="business_name"
                                defaultValue={profile.business_name || ''}
                                placeholder="Opcional si es diferente del nombre completo"
                                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="col-span-6 sm:col-span-3">
                            <label htmlFor="tax_condition" className="block text-sm font-medium text-gray-700">Condición Fiscal</label>
                            <select
                                id="tax_condition"
                                name="tax_condition"
                                defaultValue={profile.tax_condition || 'consumidor_final'}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="consumidor_final">Consumidor Final</option>
                                <option value="monotributista">Monotributista</option>
                                <option value="responsable_inscripto">Responsable Inscripto</option>
                                <option value="exento">Exento</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar Perfil'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
