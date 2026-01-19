import { getProducts } from '@/actions/products'
import Link from 'next/link'

export default async function ProductsPage() {
    const products = await getProducts()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                <Link href="/admin/products/new" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                    Agregar Producto
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {products?.map((product) => (
                        <li key={product.id}>
                            <div className="px-4 py-4 flex items-center sm:px-6">
                                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <div className="flex text-sm">
                                            <p className="font-medium text-indigo-600 truncate">{product.name}</p>
                                            <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                                                EN {product.categories?.name || 'Sin categoría'}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <p>Stock: {product.stock}</p>
                                            </div>
                                            <div className="ml-6 flex items-center text-sm text-gray-500">
                                                <p>Precio: ${product.price}</p>
                                            </div>
                                            <div className="ml-6 flex items-center text-sm text-gray-500 uppercase">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' :
                                                    product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {product.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="ml-5 flex-shrink-0">
                                    <Link href={`/admin/products/${product.id}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}
                    {(!products || products.length === 0) && (
                        <li className="px-4 py-4 text-center text-gray-500">No se encontraron productos.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
