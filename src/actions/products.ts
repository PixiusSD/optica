'use server'

import { createClient } from '@/lib/supabase/server'
import { protectAction } from '@/lib/permissions'
import { Database } from '@/types/database.types'
import { revalidatePath } from 'next/cache'

export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export async function getProducts() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(error.message)
    }

    return data
}

export async function getProduct(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('id', id)
        .single()

    if (error) {
        return null
    }

    return data
}

export async function createProduct(data: any) {
    await protectAction(['admin', 'operator'])
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('No autorizado')
    }

    const { error } = await supabase
        .from('products')
        .insert({
            ...data,
            user_id: user.id
        })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/products')
    return { success: true }
}

export async function updateProduct(id: string, data: any) {
    await protectAction(['admin', 'operator'])
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('No autorizado')
    }

    const { error } = await supabase
        .from('products')
        .update({
            ...data,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/products')
    revalidatePath(`/admin/products/${id}`)
    return { success: true }
}

export async function deleteProduct(id: string) {
    await protectAction(['admin'])
    const supabase = await createClient()

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin/products')
    return { success: true }
}

// Variant Actions
export async function getVariants(productId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
    if (error) throw new Error(error.message)
    return data
}

export async function createVariant(data: any) {
    await protectAction(['admin', 'operator'])
    const supabase = await createClient()
    const { error } = await supabase
        .from('product_variants')
        .insert(data)
    if (error) throw new Error(error.message)
    revalidatePath(`/admin/products/${data.product_id}`)
    return { success: true }
}

