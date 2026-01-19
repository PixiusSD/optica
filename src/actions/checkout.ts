'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function checkout(addressId: string, prescriptionId?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Not authenticated')
    }

    if (!addressId) {
        throw new Error('Address ID is required')
    }

    const { data: orderId, error } = await supabase
        .rpc('complete_checkout_v3', {
            p_user_id: user.id,
            p_address_id: addressId,
            p_prescription_id: prescriptionId || null
        })

    if (error) {
        console.error('Checkout error:', error)
        throw new Error('Transaction failed: ' + error.message)
    }

    // Redirect to order confirmation/payment
    redirect(`/orders/${orderId}`)
}
