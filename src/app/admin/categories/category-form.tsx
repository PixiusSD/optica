'use client'

import { createCategory } from '@/actions/categories'
import { useState } from 'react'

export default function CategoryForm() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const name = formData.get('name') as string
        const slug = formData.get('slug') as string

        try {
            await createCategory({ name, slug })
            // Optional: Reset form
            const form = document.getElementById('category-form') as HTMLFormElement
            form.reset()
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message)
            } else {
                setError('An unknown error occurred')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form id="category-form" action={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
                <input type="text" name="slug" id="slug" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {loading ? 'Saving...' : 'Save'}
            </button>
        </form>
    )
}
