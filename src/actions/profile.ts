'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Profile Actions
export async function getProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return data
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const updates = {
        full_name: formData.get('full_name') as string,
        phone: formData.get('phone') as string,
        tax_id: formData.get('tax_id') as string,
        tax_condition: formData.get('tax_condition') as string,
    }

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

    if (error) throw new Error(error.message)
    revalidatePath('/profile')
    return { success: true }
}

// Address Actions
export async function getAddresses() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    const { data } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return data || []
}

export async function addAddress(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const newAddress = {
        user_id: user.id,
        street: formData.get('street') as string,
        city: formData.get('city') as string,
        state: formData.get('state') as string,
        zip_code: formData.get('zip_code') as string,
        country: 'Argentina', // Hardcoded for now
        is_default: false
    }

    const { error } = await supabase.from('addresses').insert(newAddress)

    if (error) throw new Error(error.message)
    revalidatePath('/profile')
    return { success: true }
}

export async function deleteAddress(addressId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', user.id)

    if (error) throw new Error(error.message)
    revalidatePath('/profile')
    return { success: true }
}
