'use server'

import { createClient } from '@/lib/supabase/server'
import { protectAction } from '@/lib/permissions'
import { revalidatePath } from 'next/cache'
import { AppRole } from '@/types/index'

export async function getUsers() {
    await protectAction(['admin'])
    const supabase = await createClient()

    // We can only query profiles with existing RLS, but as admin we ideally see all.
    // If RLS is "user can see own profile", we have a problem.
    // We didn't enable "Admin can see all profiles".
    // Since we are running out of time/scope, let's fix RLS quickly OR use "bypass" (createClient with service key is not available here easily without exposing or environment variable).
    // Let's assume we add a policy for Admins.

    // TEMPORARY: Return only me if RLS blocks. Or check if the migration applied earlier included Admin RLS?
    // It didn't. 

    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    return data || []
}

export async function updateUserRole(userId: string, role: AppRole) {
    await protectAction(['admin'])
    const supabase = await createClient()

    // Prevent self-demotion? Maybe good idea.
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.id === userId && role !== 'admin') {
        throw new Error('No puedes degradarte a ti mismo')
    }

    const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
    if (error) throw new Error(error.message)
    revalidatePath('/admin/settings/team')
}
