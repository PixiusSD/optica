'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { User } from '@supabase/supabase-js'

export function Navbar({ user, role, userName }: { user: User | null, role: string | null, userName?: string | null }) {
    const pathname = usePathname()

    // Don't show public navbar on admin pages
    if (pathname.startsWith('/admin')) return null

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300 h-20 flex items-center shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex flex-col">
                            <span className="text-2xl font-black text-primary tracking-tighter uppercase leading-none">Óptica</span>
                            <span className="text-[10px] font-bold text-accent tracking-[0.3em] uppercase ml-1">Premium Shop</span>
                        </Link>

                        <div className="hidden md:flex space-x-8">
                            <Link href="/" className={`text-sm font-semibold tracking-wide transition-all hover:text-accent ${pathname === '/' ? 'text-accent' : 'text-gray-600'}`}>CATÁLOGO</Link>
                            {(role === 'admin' || role === 'operator') && (
                                <Link href="/orders" className={`text-sm font-semibold tracking-wide transition-all hover:text-accent ${pathname === '/orders' ? 'text-accent' : 'text-gray-600'}`}>MIS PEDIDOS</Link>
                            )}
                            {user && (
                                <Link href="/profile" className={`text-sm font-semibold tracking-wide transition-all hover:text-accent ${pathname === '/profile' ? 'text-accent' : 'text-gray-600'}`}>MI PERFIL</Link>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link href="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[11px] font-bold text-accent uppercase tracking-wider">Bienvenido</p>
                                    <p className="text-sm font-bold text-gray-900 leading-tight">{userName || user.email?.split('@')[0]}</p>
                                </div>
                                <form action="/auth/signout" method="post">
                                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Desconectar">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </button>
                                </form>
                                {(role === 'admin' || role === 'operator') && (
                                    <Link href="/admin" className="px-4 py-1.5 border border-red-200 text-[10px] font-black text-red-600 rounded-full hover:bg-red-50 transition-all uppercase tracking-widest">
                                        Admin
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <Link href="/auth/login" className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-full hover:bg-primary/90 transition-all uppercase tracking-widest">
                                Ingresar
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
