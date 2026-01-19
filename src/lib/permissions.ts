import { createClient } from './supabase/server'


export async function checkRole(allowedRoles: string[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile) return false

    return allowedRoles.includes(profile.role)
}

export async function protectAction(allowedRoles: string[]) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || !allowedRoles.includes(profile.role)) {
        throw new Error('Forbidden: Insufficient permissions')
    }
}
