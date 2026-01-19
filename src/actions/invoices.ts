'use server'

import { createClient } from '@/lib/supabase/server'
import { protectAction } from '@/lib/permissions'
import { revalidatePath } from 'next/cache'

export async function createInvoiceDraft(orderId: string) {
    await protectAction(['admin', 'operator'])
    const supabase = await createClient()

    // 1. Fetch Order and User Profile
    const { data: order } = await supabase.from('orders').select('user_id, status').eq('id', orderId).single()
    if (!order) throw new Error('Order not found')

    // Optional: Check if paid?
    // if (order.status !== 'paid') throw new Error('Order must be paid first')

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', order.user_id).single()
    if (!profile) throw new Error('User profile not found')

    // 2. Check if invoice already exists
    const { data: existing } = await supabase.from('invoices').select('id').eq('order_id', orderId).single()
    if (existing) throw new Error('Invoice already exists')

    // 3. Determine Invoice Type (Simplified Logic for Argentina)
    let type: 'A' | 'B' = 'B' // Default Consumer
    if (profile.tax_condition === 'responsable_inscripto') {
        type = 'A'
    }

    // 4. Create Fiscal Snapshot
    const snapshot = {
        customer_name: profile.business_name || profile.full_name,
        tax_id: profile.tax_id,
        tax_condition: profile.tax_condition,
        address: 'See Shipment' // Ideally we fetch shipment address too
    }

    // 5. Insert Draft
    const { error } = await supabase.from('invoices').insert({
        order_id: orderId,
        status: 'draft',
        invoice_type: type,
        fiscal_snapshot: snapshot
    })

    if (error) throw new Error(error.message)

    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
}

export async function getInvoiceByOrder(orderId: string) {
    const supabase = await createClient()
    const { data } = await supabase.from('invoices').select('*').eq('order_id', orderId).single()
    return data
}
