import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    // Check if we have a session before signing out
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        await supabase.auth.signOut()
    }

    const url = new URL(request.url)
    return NextResponse.redirect(new URL('/', url.origin), {
        status: 302,
    })
}
