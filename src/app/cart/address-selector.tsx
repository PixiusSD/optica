'use client'

import { Address } from '@/types/index'

export function AddressSelector({ addresses, selectedId, onSelect }: { addresses: Address[], selectedId: string, onSelect: (id: string) => void }) {
    if (addresses.length === 0) {
        return (
            <div className="bg-accent/5 border border-accent/20 p-6 rounded-xl text-center">
                <p className="text-primary font-bold text-sm mb-4">No tienes direcciones guardadas.</p>
                <a href="/profile" className="premium-button text-[10px] uppercase tracking-widest py-2 px-4 shadow-none">
                    Agregar Domicilio
                </a>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <h3 className="text-xs font-black text-primary tracking-widest uppercase">Domicilio de Entrega</h3>
                <a href="/profile" className="text-[10px] font-bold text-accent hover:text-primary transition-colors underline decoration-accent/30 underline-offset-4">Editar</a>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        onClick={() => onSelect(addr.id)}
                        className={`relative p-4 cursor-pointer rounded-xl border-2 transition-all duration-300 ${selectedId === addr.id
                                ? 'border-accent bg-accent/5 ring-4 ring-accent/5 shadow-inner'
                                : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-bold text-primary">{addr.street}</p>
                            {selectedId === addr.id && (
                                <div className="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                                    <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-tight">
                            {addr.city}, {addr.state} • {addr.zip_code}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
