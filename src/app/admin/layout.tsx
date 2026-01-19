import Link from "next/link"
import { checkRole } from "@/lib/permissions"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const isAdminOrOperator = await checkRole(['admin', 'operator', 'viewer'])

    if (!isAdminOrOperator) {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-bold text-gray-800">Panel de Administración</span>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/admin/reports"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/products"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Productos
                                </Link>
                                <Link
                                    href="/admin/categories"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Categorías
                                </Link>
                                <Link
                                    href="/admin/orders"
                                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                >
                                    Pedidos
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 mr-4">
                                Volver a la Tienda
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-10">
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard</h1> */}
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
