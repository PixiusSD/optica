'use client'

import { InventoryMovement } from '@/types/index'

export function StockHistory({ movements }: { movements: InventoryMovement[] }) {
    if (movements.length === 0) {
        return <p className="text-gray-500 text-sm">No stock movements recorded yet.</p>
    }

    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Notes
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {movements.map((movement) => (
                                    <tr key={movement.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(movement.created_at!).toLocaleDateString()} {new Date(movement.created_at!).toLocaleTimeString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 uppercase">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${movement.type === 'purchase' || movement.type === 'return' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {movement.type}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {movement.notes || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
