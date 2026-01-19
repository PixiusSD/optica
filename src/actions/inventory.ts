'use server'

import { createClient } from '@/lib/supabase/server'
import { InventoryMovementInsert } from '@/types/index'
import { revalidatePath } from 'next/cache'

export async function addStockMovement(data: Omit<InventoryMovementInsert, 'user_id' | 'id' | 'created_at'>) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error } = await supabase
        .from('inventory_movements')
        .insert({
            ...data,
            user_id: user.id
        })

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath(`/admin/products/${data.product_id}`)
    return { success: true }
}

export async function getStockHistory(productId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    const { data, error } = await supabase
        .from('inventory_movements')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

    if (error) {
        throw new Error(error.message)
    }

    return data
}
