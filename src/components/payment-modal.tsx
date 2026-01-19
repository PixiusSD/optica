'use client'

import { createPaymentRecord, processMockPayment } from '@/actions/payments'
import { useState } from 'react'

export function PaymentModal({ orderId, amount, onComplete }: { orderId: string, amount: number, onComplete: () => void }) {
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState('select') // select, simulated_gateway

    async function handleStartPayment() {
        setLoading(true)
        try {
            const payment = await createPaymentRecord(orderId, 'mock', amount)
            sessionStorage.setItem('current_payment_id', payment.id)
            setStep('simulated_gateway')
        } catch {
            alert('Error iniciando el pago')
        } finally {
            setLoading(false)
        }
    }

    async function handleGatewayResponse(success: boolean) {
        setLoading(true)
        const paymentId = sessionStorage.getItem('current_payment_id')
        if (!paymentId) return

        try {
            await processMockPayment(paymentId, success)
            if (success) {
                alert('¡Pago Aprobado!')
                setIsOpen(false)
                onComplete()
            } else {
                alert('Pago Rechazado')
                setStep('select')
            }
        } catch (e) {
            console.error(e)
            alert('Error procesando el pago')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="premium-button w-full shadow-lg shadow-green-600/20 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-widest"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Pagar Ahora
            </button>
        )
    }

    return (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-primary/90 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setIsOpen(false)}></div>

                <div className="inline-block align-middle bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full relative z-10">
                    <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-6 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-bold text-accent tracking-[0.3em] uppercase">Pasarela de Pago</span>
                                <h3 className="text-2xl font-black text-white tracking-tight mt-1" id="modal-title">
                                    Simulador de Pago
                                </h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 text-white/60 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white px-6 py-8">
                        {step === 'select' && (
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total a Pagar</p>
                                    <p className="text-4xl font-black text-primary">${amount}</p>
                                </div>

                                <p className="text-sm text-gray-500">
                                    Selecciona el proveedor de pago. En este entorno de prueba, solo está disponible el proveedor simulado.
                                </p>

                                <button
                                    onClick={handleStartPayment}
                                    disabled={loading}
                                    className="premium-button w-full shadow-lg shadow-primary/10 py-4 text-xs uppercase tracking-widest"
                                >
                                    {loading ? 'Iniciando...' : 'Proceder con Proveedor Simulado'}
                                </button>
                            </div>
                        )}

                        {step === 'simulated_gateway' && (
                            <div className="space-y-6">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border-2 border-dashed border-gray-200 text-center">
                                    <p className="font-mono text-sm mb-2 text-primary font-bold">REDIRIGIENDO A PASARELA EXTERNA...</p>
                                    <p className="text-sm text-gray-600 mb-6">Simulando acción del usuario en el sitio de pago.</p>

                                    <div className="flex gap-4 justify-center">
                                        <button
                                            onClick={() => handleGatewayResponse(true)}
                                            disabled={loading}
                                            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-green-600/20"
                                        >
                                            ✓ Simular Éxito
                                        </button>
                                        <button
                                            onClick={() => handleGatewayResponse(false)}
                                            disabled={loading}
                                            className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-600/20"
                                        >
                                            ✗ Simular Fallo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-2 border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all uppercase tracking-widest"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
