'use client'

import { createProduct, updateProduct } from '@/actions/products'
import { Category, Product } from '@/types/index'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ProductFormProps {
    product?: Product
    categories: Category[]
    isEdit?: boolean
}

export default function ProductForm({ product, categories, isEdit = false }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        // Extract data
        const name = formData.get('name') as string
        const brand = formData.get('brand') as string
        const model = formData.get('model') as string
        const product_type = formData.get('product_type') as string
        const description = formData.get('description') as string
        const price = parseFloat(formData.get('price') as string)
        const stock = parseInt(formData.get('stock') as string)
        const category_id = formData.get('category_id') as string
        const sku = formData.get('sku') as string
        const status = formData.get('status') as "active" | "draft" | "archived"

        try {
            if (isEdit && product) {
                await updateProduct(product.id, {
                    name, brand, model, product_type, description, price, stock, category_id, sku, status
                })
            } else {
                await createProduct({
                    name, brand, model, product_type, description, price, stock, category_id, sku, status
                })
            }
            router.push('/admin/products')
            router.refresh()
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message)
            } else {
                setError('Unknown error')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                    <input defaultValue={product?.name} type="text" name="name" id="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="sku" className="block text-sm font-medium text-gray-700">SKU Global</label>
                    <input defaultValue={product?.sku || ''} type="text" name="sku" id="sku" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca</label>
                    <input defaultValue={(product as any)?.brand || ''} type="text" name="brand" id="brand" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
                    <input defaultValue={(product as any)?.model || ''} type="text" name="model" id="model" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="product_type" className="block text-sm font-medium text-gray-700">Tipo de Producto</label>
                    <select defaultValue={(product as any)?.product_type || 'glasses'} id="product_type" name="product_type" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="glasses">Anteojos</option>
                        <option value="contacts">Lentes de Contacto</option>
                        <option value="accessories">Accesorios</option>
                        <option value="other">Otro</option>
                    </select>
                </div>

                <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea defaultValue={product?.description || ''} name="description" id="description" rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input defaultValue={product?.price} type="number" step="0.01" name="price" id="price" required className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="0.00" />
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
                    <input defaultValue={product?.stock || 0} type="number" name="stock" id="stock" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>

                <div className="sm:col-span-2">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select defaultValue={product?.status || 'draft'} id="status" name="status" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="draft">Draft</option>
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
                    <select defaultValue={product?.category_id || ''} id="category_id" name="category_id" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="">None</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end">
                <button type="button" onClick={() => router.back()} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3">
                    Cancel
                </button>
                <button type="submit" disabled={loading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    )
}
