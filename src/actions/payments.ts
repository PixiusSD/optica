'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPaymentRecord(orderId: string, method: string, amount: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Create a pending payment record
    const { data, error } = await supabase
        .from('payments')
        .insert({
            order_id: orderId,
            amount: amount,
            method: method,
            status: 'pending'
        })
        .select()
        .single()

    if (error) throw new Error(error.message)
    return data
}

export async function processMockPayment(paymentId: string, success: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 1. Update Payment Status
    const status = success ? 'approved' : 'rejected'
    const { data: payment, error } = await supabase
        .from('payments')
        .update({ status: status })
        .eq('id', paymentId)
        .select('*, orders(total)')
        .single()

    if (error) throw new Error(error.message)

    // 2. If Approved, check if order is fully paid
    if (success && payment) {
        const { data: allPayments } = await supabase
            .from('payments')
            .select('amount')
            .eq('order_id', payment.order_id)
            .eq('status', 'approved')

        const totalPaid = (allPayments || []).reduce((acc, p) => acc + Number(p.amount), 0)
        const orderTotal = Number((payment as any).orders.total)

        if (totalPaid >= orderTotal) {
            await supabase
                .from('orders')
                .update({ status: 'paid' })
                .eq('id', payment.order_id)
        } else {
            // New ERP logic: if partial, maybe mark as 'partially_paid' if you have that status
            // or just keep 'pending' but with more payments registered.
        }
    }

    revalidatePath(`/orders`)
    revalidatePath(`/admin/orders/${payment.order_id}`)
    return { success: true }
}

export async function getOrderPayments(orderId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false })
    return data || []
}
