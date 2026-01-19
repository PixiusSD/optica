import { getCategories } from '@/actions/categories'
import { getProduct } from '@/actions/products'
import { getStockHistory } from '@/actions/inventory'
import ProductForm from '../product-form'
import { StockHistory } from './stock-history'
import { StockAdjustmentForm } from './stock-form'
import { notFound } from 'next/navigation'

interface PageProps {
    params: { id: string }
}

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const { id } = params
    const [categories, product, history] = await Promise.all([
        getCategories(),
        getProduct(id),
        getStockHistory(id)
    ])

    if (!product) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <ProductForm categories={categories || []} product={product} isEdit={true} />

            <hr className="border-gray-200" />

            <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Inventory Management</h2>
                    <div className="text-sm text-gray-500">
                        Current Stock: <span className="font-bold text-gray-900">{product.stock}</span>
                    </div>
                </div>

                <StockAdjustmentForm productId={product.id} />

                <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Movement History</h3>
                    <StockHistory movements={history || []} />
                </div>
            </div>
        </div>
    )
}
