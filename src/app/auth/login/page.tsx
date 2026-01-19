'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (view === 'sign-in') {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) {
                setError(error.message)
                setLoading(false)
            } else {
                router.push('/')
                router.refresh()
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: `${firstName} ${lastName}`.trim(),
                    }
                }
            })
            if (error) {
                setError(error.message)
                setLoading(false)
            } else {
                setError('Registro exitoso. Revisa tu email o inicia sesión.')
                setLoading(false)
                setView('sign-in')
            }
        }
    }

    return (
        <div>
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {view === 'sign-in' ? 'Inicia sesión en tu cuenta' : 'Crea una cuenta nueva'}
                </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                    {view === 'sign-up' && (
                        <>
                            <div>
                                <label htmlFor="first-name" className="sr-only">Nombre</label>
                                <input
                                    id="first-name"
                                    name="firstName"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Nombre"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="last-name" className="sr-only">Apellido</label>
                                <input
                                    id="last-name"
                                    name="lastName"
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Apellido"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <label htmlFor="email-address" className="sr-only">
                            Correo electrónico
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${view === 'sign-in' ? 'rounded-t-md' : ''}`}
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? 'Procesando...' : (view === 'sign-in' ? 'Iniciar sesión' : 'Registrarse')}
                    </button>
                </div>

                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        onClick={() => setView(view === 'sign-in' ? 'sign-up' : 'sign-in')}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                        {view === 'sign-in' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                    </button>
                </div>
            </form>
        </div>
    )
}
