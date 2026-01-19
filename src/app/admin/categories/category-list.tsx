'use client'


import { deleteCategory } from '@/actions/categories'
import { Category } from '@/types/index'
import { useState } from 'react'

export function CategoryList({ categories }: { categories: Category[] }) {
    const [deleting, setDeleting] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return
        setDeleting(id)
        try {
            await deleteCategory(id)
        } catch {
            alert('Failed to delete')
        } finally {
            setDeleting(null)
        }
    }

    return (
        <ul className="divide-y divide-gray-200">
            {categories.map((category) => (
                <li key={category.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-900">{category.name}</p>
                        <p className="text-sm text-gray-500">{category.slug}</p>
                    </div>
                    <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deleting === category.id}
                        className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                    >
                        {deleting === category.id ? 'Deleting...' : 'Delete'}
                    </button>
                </li>
            ))}
            {categories.length === 0 && (
                <li className="px-6 py-4 text-center text-gray-500">No categories found.</li>
            )}
        </ul>
    )
}
