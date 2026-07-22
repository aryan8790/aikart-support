'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Ticket } from '@/types'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [filtered, setFiltered] = useState<Ticket[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('tickets').select('*').order('created_at', { ascending: false })
      setTickets(data || [])
      setFiltered(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(tickets.filter(t => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)))
  }, [search, tickets])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Tickets</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and track all support tickets</p>
        </div>
        <Link href="/tickets/new" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          <Plus size={16} /> New Ticket
        </Link>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search tickets..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-800 text-white placeholder-gray-500 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition"
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">Title</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">Category</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">Priority</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-400">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No tickets found.</td></tr>
            ) : filtered.map(ticket => (
              <tr key={ticket.id} className="hover:bg-gray-800/50 transition cursor-pointer">
                <td className="px-6 py-4">
                  <Link href={`/tickets/${ticket.id}`} className="text-white font-medium hover:text-indigo-400">{ticket.title}</Link>
                </td>
                <td className="px-6 py-4 text-gray-400 capitalize">{ticket.category}</td>
                <td className="px-6 py-4"><Badge type="priority" value={ticket.priority} /></td>
                <td className="px-6 py-4"><Badge type="status" value={ticket.status} /></td>
                <td className="px-6 py-4 text-gray-400">{new Date(ticket.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}