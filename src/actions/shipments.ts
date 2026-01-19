'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getShipmentByOrder(orderId: string) {
    const supabase = await createClient()
    const { data } = await supabase
        .from('shipments')
        .select('*')
        .eq('order_id', orderId)
        .single()
    return data
}

import { protectAction } from '@/lib/permissions'

export async function updateShipment(shipmentId: string, status: string, tracking: string) {
    await protectAction(['admin', 'operator'])
    const supabase = await createClient()

    const { error } = await supabase
        .from('shipments')
        .update({
            status: status,
            tracking_number: tracking
        })
        .eq('id', shipmentId)

    if (error) throw new Error(error.message)

    // Optionally update Order status too if we mark as Shipped
    if (status === 'shipped') {
        const { data: shipment } = await supabase.from('shipments').select('order_id').eq('id', shipmentId).single()
        if (shipment) {
            await supabase.from('orders').update({ status: 'shipped' }).eq('id', shipment.order_id)
        }
    }

    revalidatePath('/admin/orders')
}
