import { getCategories } from '@/actions/categories'
import CategoryForm from './category-form'
import { CategoryList } from './category-list'

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <div className="bg-white shadow sm:rounded-lg p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Category</h3>
                        <CategoryForm />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <div className="bg-white shadow sm:rounded-lg">
                        <CategoryList categories={categories || []} />
                    </div>
                </div>
            </div>
        </div>
    )
}
