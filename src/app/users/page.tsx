'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Profile } from '@/types'

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setUsers(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Users</h1>
        <p className="text-gray-400 text-sm mt-1">All registered users in the system</p>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">Email</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">Role</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found.</td></tr>
            ) : users.map(user => (
              <tr key={user.id} className="hover:bg-gray-800/50 transition">
                <td className="px-6 py-4 text-white font-medium">{user.full_name || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-400">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                    user.role === 'agent' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                  }`}>{user.role}</span>
                </td>
                <td className="px-6 py-4 text-gray-400">{new Date(user.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}