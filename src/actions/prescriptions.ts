'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPrescriptions() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching prescriptions:', error)
        return []
    }

    return data || []
}

export async function savePrescription(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const prescription = {
        user_id: user.id,
        patient_name: formData.get('patient_name') as string,
        od_sphere: formData.get('od_sphere') as string,
        od_cylinder: formData.get('od_cylinder') as string,
        od_axis: formData.get('od_axis') as string,
        oi_sphere: formData.get('oi_sphere') as string,
        oi_cylinder: formData.get('oi_cylinder') as string,
        oi_axis: formData.get('oi_axis') as string,
        addition: formData.get('addition') as string,
        pd: formData.get('pd') as string,
        notes: formData.get('notes') as string,
    }

    const { error } = await supabase
        .from('prescriptions')
        .insert(prescription)

    if (error) {
        throw new Error('Error al guardar la receta: ' + error.message)
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function deletePrescription(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('prescriptions')
        .update({ is_active: false })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        throw new Error('Error al eliminar la receta: ' + error.message)
    }

    revalidatePath('/profile')
    return { success: true }
}
