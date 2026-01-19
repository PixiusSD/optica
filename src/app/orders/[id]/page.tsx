import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { PaymentModal } from '@/components/payment-modal'
import { getOrderPayments } from '@/actions/payments'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', params.id)
        .maybeSingle()

    if (orderError) {
        console.error('Error fetching order:', orderError)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const order = orderData as any

    if (!order) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Orden no encontrada</h1>
                <p className="text-gray-600">No pudimos encontrar la orden con ID: <code className="bg-gray-100 px-2 py-1 rounded">{params.id}</code></p>
                {orderError && <p className="mt-2 text-sm text-red-400">Error: {orderError.message}</p>}
                <p className="mt-4 text-sm text-gray-500">Esto puede deberse a un error en el ID o a restricciones de acceso (RLS).</p>
                <Link href="/orders" className="mt-6 inline-block text-indigo-600 hover:underline">Volver a mis pedidos</Link>
            </div>
        )
    }

    // Security check: Ensure order belongs to user
    if (order.user_id !== user.id) {
        return <div>No autorizado</div>
    }

    const payments = await getOrderPayments(order.id)

    async function refresh() {
        'use server'
        revalidatePath(`/orders/${params.id}`)
    }

    // Debug: verificar estructura de datos
    console.log('Order data:', JSON.stringify(order, null, 2))
    console.log('Order items count:', order.order_items?.length || 0)

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-bold text-accent tracking-[0.3em] uppercase">Confirmación de Pedido</span>
                        <div className="h-px w-12 bg-accent/30" />
                    </div>
                    <h1 className="text-4xl font-black text-primary tracking-tighter uppercase">Orden <span className="text-accent">#{order.id.slice(0, 8)}</span></h1>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border-2 
                        ${order.status === 'confirmed' || order.status === 'paid' ? 'border-green-200 bg-green-50 text-green-700' : ''}
                        ${order.status === 'pending' ? 'border-accent/20 bg-accent/5 text-accent' : ''}
                        ${order.status === 'shipped' ? 'border-blue-200 bg-blue-50 text-blue-700' : ''}
                        ${order.status === 'cancelled' ? 'border-red-200 bg-red-50 text-red-700' : ''}
                    `}>
                        {order.status}
                    </span>
                    <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-tight">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {/* Product List */}
                <div className="premium-card bg-white p-8">
                    <h3 className="text-xs font-black text-primary tracking-widest uppercase mb-8 border-b border-gray-100 pb-4">Artículos</h3>
                    <ul className="divide-y divide-gray-50">
                        {order.order_items.map((item: any) => (
                            <li key={item.id} className="py-6 flex justify-between items-center group">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 italic flex items-center justify-center text-[10px] text-gray-300">
                                        {item.products.images?.[0] ? (
                                            <img src={item.products.images[0]} alt="" className="w-full h-full object-cover" />
                                        ) : "Sin imagen"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{item.products.name}</p>
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">Cantidad: {item.quantity}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-primary">${item.price}</p>
                                    <p className="text-[10px] font-medium text-gray-400">c/u</p>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 pt-8 border-t-2 border-primary/5 flex flex-col items-end">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pagado</p>
                        <p className="text-4xl font-black text-primary tracking-tighter">${order.total}</p>

                        {(order.status === 'confirmed' || order.status === 'pending') && (
                            <div className="mt-8 w-full md:w-auto">
                                <PaymentModal orderId={order.id} amount={order.total} onComplete={refresh} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Account details / Payment history */}
                {payments.length > 0 && (
                    <div className="premium-card bg-primary p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                        <h3 className="text-xs font-black text-accent tracking-widest uppercase mb-8 border-b border-white/10 pb-4">Historial de Transacciones</h3>
                        <div className="space-y-6">
                            {payments.map((payment: any) => (
                                <div key={payment.id} className="flex justify-between items-start border-l-2 border-accent/30 pl-6 relative">
                                    <div className="absolute left-[-5px] top-0 w-2 h-2 bg-accent rounded-full" />
                                    <div>
                                        <p className="text-xs font-bold text-accent uppercase tracking-[0.2em] mb-1">{payment.provider}</p>
                                        <p className="text-sm font-medium text-gray-300">{new Date(payment.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-white">${payment.amount}</p>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${payment.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                            payment.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-center mt-8">
                    <Link href="/orders" className="text-[10px] font-black tracking-widest uppercase text-gray-400 hover:text-primary transition-all flex items-center gap-2 group">
                        <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver a mis pedidos
                    </Link>
                </div>
            </div>
        </div>
    )
}
