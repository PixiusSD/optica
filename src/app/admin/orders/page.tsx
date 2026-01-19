import { getSellerOrders } from '@/actions/orders'
import { AdminOrderList } from './order-list'

export default async function AdminOrdersPage() {
    const orders = await getSellerOrders()

    return (
        <div className="space-y-6">
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Sales & Orders
                    </h2>
                </div>
            </div>

            <AdminOrderList orders={orders} />
        </div>
    )
}
