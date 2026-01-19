import Dashboard from './dashboard'
import { checkRole } from '@/lib/permissions'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
    const hasAccess = await checkRole(['admin', 'operator', 'viewer'])
    if (!hasAccess) redirect('/')

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Dashboard />
        </div>
    )
}
