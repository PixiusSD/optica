'use client'

import { useEffect, useState } from 'react'
import { getDashboardStats } from '@/actions/reports'
import Link from 'next/link'

interface SalesStat {
    date: string
    total_sales: number
    order_count: number
}

interface TopProduct {
    product_name: string
    total_quantity: number
    total_revenue: number
}

interface LowStockItem {
    id: string
    name: string
    stock: number
}

interface DashboardStats {
    totalOrders: number
    lowStock: LowStockItem[]
    salesStats: SalesStat[]
    topProducts: TopProduct[]
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getDashboardStats()
            .then(data => {
                setStats(data as DashboardStats)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) return <div className="p-8">Loading Dashboard...</div>
    if (!stats) return <div className="p-8">Error loading stats.</div>

    // Calculate total revenue from the 30-day window
    const totalRevenue30d = stats.salesStats.reduce((acc: number, curr) => acc + curr.total_sales, 0)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue (Last 30d)</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">${totalRevenue30d.toFixed(2)}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Orders (All Time)</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalOrders}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                        <dd className="mt-1 text-3xl font-semibold text-red-600">{stats.lowStock.length}</dd>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Table (Simple Chart Replacement) */}
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Sales History (30 Days)</h3>
                    <div className="overflow-y-auto max-h-64">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {stats.salesStats.map((day) => (
                                    <tr key={day.date}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(day.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${day.total_sales}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.order_count}</td>
                                    </tr>
                                ))}
                                {stats.salesStats.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No sales data in range.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white shadow sm:rounded-lg p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Top 5 Products</h3>
                    <ul className="divide-y divide-gray-200">
                        {stats.topProducts.map((prod, idx: number) => (
                            <li key={idx} className="py-4 flex justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{prod.product_name}</p>
                                    <p className="text-sm text-gray-500">{prod.total_quantity} sold</p>
                                </div>
                                <div className="text-sm text-gray-900 font-semibold">
                                    ${prod.total_revenue}
                                </div>
                            </li>
                        ))}
                        {stats.topProducts.length === 0 && (
                            <li className="py-4 text-center text-gray-500 text-sm">No data yet.</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-red-600">Low Stock Alert</h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {stats.lowStock.map((prod) => (
                        <li key={prod.id} className="px-4 py-4 sm:px-6 flex justify-between items-center hover:bg-gray-50">
                            <div>
                                <p className="text-sm font-medium text-indigo-600 truncate">{prod.name}</p>
                                <p className="text-sm text-gray-500">Current Stock: <span className="font-bold text-red-600">{prod.stock}</span></p>
                            </div>
                            <div>
                                <Link href={`/admin/products/${prod.id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Restock</Link>
                            </div>
                        </li>
                    ))}
                    {stats.lowStock.length === 0 && (
                        <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">Inventory levels are good.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
