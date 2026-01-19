import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Create an unmodified response first
    // to avoid clearing cookies if Supabase is not configured yet
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return response
    }

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes pattern
    if (request.nextUrl.pathname.startsWith('/admin') && !user) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/auth/signout') &&
        user) {
        // Fetch role to decide redirect
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = profile?.role || 'customer'

        if (role === 'customer') {
            return NextResponse.redirect(new URL('/', request.url))
        } else {
            return NextResponse.redirect(new URL('/admin/products', request.url))
        }
    }

    return response
}
