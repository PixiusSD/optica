'use client'

import { updateUserRole } from '@/actions/roles'
import { useState } from 'react'

import { Profile, AppRole } from '@/types/index'

export default function TeamList({ users }: { users: Profile[] }) {
    const [loading, setLoading] = useState<string | null>(null)

    async function handleRoleChange(userId: string, newRole: AppRole) {
        if (!confirm(`Change role to ${newRole}?`)) return
        setLoading(userId)
        try {
            await updateUserRole(userId, newRole)
        } catch (e: unknown) {
            if (e instanceof Error) {
                alert(e.message)
            }
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.full_name || 'No Name'}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : ''}
                        ${user.role === 'operator' ? 'bg-blue-100 text-blue-800' : ''}
                        ${user.role === 'customer' ? 'bg-green-100 text-green-800' : ''}
                        ${user.role === 'viewer' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value as AppRole)}
                                                disabled={loading === user.id}
                                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="operator">Operator</option>
                                                <option value="viewer">Viewer</option>
                                                <option value="customer">Customer</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
