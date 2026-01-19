'use client'

import { useState } from 'react'
import { savePrescription, deletePrescription } from '@/actions/prescriptions'

interface Prescription {
    id: string
    patient_name: string
    od_sphere: string
    od_cylinder: string
    od_axis: string
    oi_sphere: string
    oi_cylinder: string
    oi_axis: string
    addition: string
    pd: string
    notes: string
    created_at: string
}

export function PrescriptionManager({ prescriptions }: { prescriptions: any[] }) {
    const [isAdding, setIsAdding] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.currentTarget)
        try {
            await savePrescription(formData)
            setIsAdding(false)
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                    <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Mis Recetas / Graduaciones
                </h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline"
                    >
                        + Agregar Nueva
                    </button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="premium-card bg-primary p-6 text-white space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <input name="patient_name" placeholder="Nombre del Paciente" className="bg-white/10 border-white/20 text-white placeholder:text-white/40 p-3 text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-accent" required />
                    </div>

                    <div className="grid grid-cols-2 gap-8 ring-1 ring-white/10 p-4 rounded-xl">
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-accent uppercase tracking-widest">Ojo Derecho (OD)</p>
                            <div className="grid grid-cols-3 gap-2">
                                <input name="od_sphere" placeholder="Esf" className="bg-white/5 text-center p-2 text-[10px] font-bold" />
                                <input name="od_cylinder" placeholder="Cil" className="bg-white/5 text-center p-2 text-[10px] font-bold" />
                                <input name="od_axis" placeholder="Eje" className="bg-white/5 text-center p-2 text-[10px] font-bold" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <p className="text-[9px] font-black text-accent uppercase tracking-widest">Ojo Izquierdo (OI)</p>
                            <div className="grid grid-cols-3 gap-2">
                                <input name="oi_sphere" placeholder="Esf" className="bg-white/5 text-center p-2 text-[10px] font-bold" />
                                <input name="oi_cylinder" placeholder="Cil" className="bg-white/5 text-center p-2 text-[10px] font-bold" />
                                <input name="oi_axis" placeholder="Eje" className="bg-white/5 text-center p-2 text-[10px] font-bold" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input name="addition" placeholder="Adición" className="bg-white/10 border-white/20 text-white p-3 text-xs font-bold" />
                        <input name="pd" placeholder="Distancia Pupilar (DP)" className="bg-white/10 border-white/20 text-white p-3 text-xs font-bold" />
                    </div>

                    <textarea name="notes" placeholder="Notas adicionales..." className="w-full bg-white/10 border-white/20 text-white p-3 text-xs font-bold h-20" />

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setIsAdding(false)} className="text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100">Cancelar</button>
                        <button type="submit" disabled={loading} className="bg-accent text-primary px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50">
                            {loading ? 'Guardando...' : 'Guardar Receta'}
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {prescriptions.map((p) => (
                    <div key={p.id} className="group premium-card bg-white p-6 border-transparent hover:border-accent/20 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xs font-black text-primary uppercase tracking-wider">{p.patient_name}</h3>
                                <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Cargada el {new Date(p.created_at).toLocaleDateString()}</p>
                            </div>
                            <button
                                onClick={async () => {
                                    if (confirm('¿Eliminar esta receta?')) {
                                        await deletePrescription(p.id)
                                    }
                                }}
                                className="text-[9px] font-bold text-red-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                            >
                                Eliminar
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                            <div className="text-[10px]">
                                <p className="font-black text-gray-400 uppercase tracking-tighter mb-1">OD</p>
                                <p className="font-bold text-primary">Esfera: {p.od_sphere || '-'} | Cil: {p.od_cylinder || '-'} | Eje: {p.od_axis || '-'}</p>
                            </div>
                            <div className="text-[10px]">
                                <p className="font-black text-gray-400 uppercase tracking-tighter mb-1">OI</p>
                                <p className="font-bold text-primary">Esfera: {p.oi_sphere || '-'} | Cil: {p.oi_cylinder || '-'} | Eje: {p.oi_axis || '-'}</p>
                            </div>
                        </div>

                        {(p.addition || p.pd) && (
                            <div className="flex gap-4 mt-3 text-[10px]">
                                {p.addition && <p className="font-bold text-primary"><span className="text-accent uppercase">Add:</span> {p.addition}</p>}
                                {p.pd && <p className="font-bold text-primary"><span className="text-accent uppercase">DP:</span> {p.pd}</p>}
                            </div>
                        )}
                    </div>
                ))}

                {prescriptions.length === 0 && !isAdding && (
                    <div className="py-12 text-center ring-1 ring-inset ring-gray-100 rounded-2xl bg-gray-50/50">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No tienes recetas guardadas</p>
                    </div>
                )}
            </div>
        </div>
    )
}
