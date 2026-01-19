import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function OrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>

            <div className="space-y-8">
                {orders?.map((order) => (
                    <div key={order.id} className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
                        <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Pedido #{order.id.slice(0, 8)}
                                </h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Realizado el {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <p className="text-lg font-bold text-gray-900 mb-2">${order.total}</p>
                                <div className="flex space-x-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                                    ${order.status === 'confirmed' || order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                                `}>
                                        {order.status}
                                    </span>
                                    <Link href={`/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                                        Ver Detalles y Pagar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {(!orders || orders.length === 0) && (
                    <p className="text-gray-500">Aún no has realizado ningún pedido.</p>
                )}
            </div>
        </div>
    )
}
