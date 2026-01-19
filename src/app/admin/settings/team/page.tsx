import { getUsers } from '@/actions/roles'
import { checkRole } from '@/lib/permissions'
import { redirect } from 'next/navigation'
import TeamList from './team-list'

export default async function TeamPage() {
    const isAdmin = await checkRole(['admin'])
    if (!isAdmin) redirect('/admin/products')

    const users = await getUsers()

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Team Management</h1>
            <TeamList users={users} />
        </div>
    )
}
