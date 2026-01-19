'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCart() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('cart_items')
        .select('*, products(*)')
        .eq('user_id', user.id)

    if (error) {
        console.error('Error fetching cart:', error)
        return []
    }

    return data
}

export async function addToCart(productId: string, quantity: number) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        throw new Error('Unauthorized')
    }

    // Check if item exists to update quantity or insert new
    const { data: existing } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .single()

    let error
    if (existing) {
        const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + quantity })
            .eq('id', existing.id)
        error = updateError
    } else {
        const { error: insertError } = await supabase
            .from('cart_items')
            .insert({ product_id: productId, quantity: quantity, user_id: user.id })
        error = insertError
    }

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/cart')
    return { success: true }
}

export async function removeFromCart(cartIds: string[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('cart_items')
        .delete()
        .in('id', cartIds)
        .eq('user_id', user.id) // Security check

    if (error) throw new Error(error.message)
    revalidatePath('/cart')
    return { success: true }
}
