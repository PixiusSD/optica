import { getCart } from '@/actions/cart'
import { getAddresses } from '@/actions/profile'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CartSummary from './cart-summary' // We will extract logic to client comp

export default async function CartPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const items = await getCart()
    const addresses = await getAddresses()

    if (!items || items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
                <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-black text-primary tracking-tighter uppercase mb-4">Tu bolsa está vacía</h1>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto">Parece que aún no has seleccionado ninguna de nuestras piezas exclusivas.</p>
                <Link href="/" className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg inline-block uppercase tracking-widest text-xs">
                    Comenzar a Comprar
                </Link>
            </div>
        )
    }

    // Calculate Subtotal
    const subtotal = items.reduce((acc, item) => {
        const product = item.products as unknown as { price: number }
        return acc + (item.quantity * (product?.price || 0))
    }, 0)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-12">
                <h1 className="text-4xl font-black text-primary tracking-tighter uppercase mb-2">Mi Carrito</h1>
                <div className="h-1 w-20 bg-accent rounded-full" />
            </div>

            <CartSummary items={items} subtotal={subtotal} addresses={addresses} />
        </div>
    )
}
