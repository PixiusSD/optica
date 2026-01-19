import { getSellerOrders } from '@/actions/orders'
import { Order, OrderItem, Product } from '@/types/index'
import { getShipmentByOrder } from '@/actions/shipments'
import { notFound } from 'next/navigation'
import { OrderStatusController } from './status-controller'
import { ShipmentManager } from './shipment-manager'
import { getInvoiceByOrder } from '@/actions/invoices'
import { InvoiceManager } from './invoice-manager'

export default async function AdminOrderDetailPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const orders = await getSellerOrders()
    // Helper type for the complex join
    type OrderWithItems = Order & { order_items: (OrderItem & { products: Product | null })[] }
    const order = (orders as unknown as OrderWithItems[]).find((o) => o.id === params.id)

    if (!order) {
        notFound()
    }

    const shipment = await getShipmentByOrder(order.id)
    const invoice = await getInvoiceByOrder(order.id)

    return (
        <div>
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Order #{order.id}
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Order Info</h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">Total: ${order.total}</p>
                        </div>
                        <OrderStatusController orderId={order.id} currentStatus={order.status || 'pending'} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <ShipmentManager shipment={shipment} />
                    </div>
                    <InvoiceManager orderId={order.id} invoice={invoice} />
                </div>
            </div>


            <h3 className="text-xl font-bold text-gray-900 mb-4">Items</h3>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {order.order_items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {item.products?.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.quantity}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ${item.price}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                ${item.price * item.quantity}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
