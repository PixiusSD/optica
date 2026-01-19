import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { createClient } from '@/lib/supabase/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Optica Store',
  description: 'Premium Eyewear',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role: string | null = null
  let userName: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single()
    role = profile?.role || null
    userName = profile?.full_name || null
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar user={user} role={role} userName={userName} />
        {children}
      </body>
    </html>
  )
}
