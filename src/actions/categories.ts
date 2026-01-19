'use server'

import { createClient } from '@/lib/supabase/server'
import { Database } from '@/types/database.types'
import { revalidatePath } from 'next/cache'

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export async function getCategories() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function createCategory(formData: { name: string; slug: string }) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('categories')
        .insert({
            name: formData.name,
            slug: formData.slug,
            user_id: user.id
        })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/products')
    revalidatePath('/admin/categories')
    return { success: true }
}

export async function updateCategory(id: string, formData: { name?: string; slug?: string }) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('categories')
        .update({
            ...formData
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/categories')
    return { success: true }
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/categories')
    return { success: true }
}
